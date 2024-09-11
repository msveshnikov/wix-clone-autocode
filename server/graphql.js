import { gql } from 'apollo-server-express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk';
import { PubSub } from 'graphql-subscriptions';

const User = mongoose.model('User');
const Website = mongoose.model('Website');
const Template = mongoose.model('Template');
const EcommerceProduct = mongoose.model('EcommerceProduct');
const Collaboration = mongoose.model('Collaboration');
const SEOData = mongoose.model('SEOData');

const pubsub = new PubSub();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        websites: [Website!]!
    }

    type Website {
        id: ID!
        userId: ID!
        name: String!
        content: JSON
        domain: String
        published: Boolean!
        version: Int!
        collaborators: [User!]!
        seoData: SEOData
        ecommerceProducts: [EcommerceProduct!]!
    }

    type Template {
        id: ID!
        name: String!
        content: JSON!
        category: String!
    }

    type EcommerceProduct {
        id: ID!
        websiteId: ID!
        name: String!
        description: String!
        price: Float!
        imageUrl: String
    }

    type Collaboration {
        id: ID!
        websiteId: ID!
        userId: ID!
        role: String!
    }

    type SEOData {
        id: ID!
        websiteId: ID!
        title: String
        description: String
        keywords: [String!]
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type S3SignedUrl {
        url: String!
        key: String!
    }

    input WebsiteInput {
        name: String!
        content: JSON
        domain: String
        published: Boolean
    }

    input EcommerceProductInput {
        name: String!
        description: String!
        price: Float!
        imageUrl: String
    }

    input SEODataInput {
        title: String
        description: String
        keywords: [String!]
    }

    type Query {
        me: User
        website(id: ID!): Website
        websites: [Website!]!
        templates: [Template!]!
        ecommerceProducts(websiteId: ID!): [EcommerceProduct!]!
        collaborators(websiteId: ID!): [User!]!
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        createWebsite(input: WebsiteInput!): Website!
        updateWebsite(id: ID!, input: WebsiteInput!): Website!
        deleteWebsite(id: ID!): Boolean!
        createEcommerceProduct(websiteId: ID!, input: EcommerceProductInput!): EcommerceProduct!
        updateEcommerceProduct(id: ID!, input: EcommerceProductInput!): EcommerceProduct!
        deleteEcommerceProduct(id: ID!): Boolean!
        addCollaborator(websiteId: ID!, userId: ID!, role: String!): Collaboration!
        removeCollaborator(websiteId: ID!, userId: ID!): Boolean!
        updateSEOData(websiteId: ID!, input: SEODataInput!): SEOData!
        getS3SignedUrl(filename: String!, contentType: String!): S3SignedUrl!
    }

    type Subscription {
        websiteUpdated(id: ID!): Website!
    }

    scalar JSON
`;

const resolvers = {
    Query: {
        me: (_, __, { user }) => {
            if (!user) throw new Error('Not authenticated');
            return User.findById(user.userId);
        },
        website: async (_, { id }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const website = await Website.findOne({ _id: id, userId: user.userId });
            if (!website) throw new Error('Website not found');
            return website;
        },
        websites: async (_, __, { user }) => {
            if (!user) throw new Error('Not authenticated');
            return Website.find({ userId: user.userId });
        },
        templates: () => Template.find(),
        ecommerceProducts: (_, { websiteId }) => EcommerceProduct.find({ websiteId }),
        collaborators: async (_, { websiteId }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const collaborations = await Collaboration.find({ websiteId });
            const collaboratorIds = collaborations.map((c) => c.userId);
            return User.find({ _id: { $in: collaboratorIds } });
        }
    },
    Mutation: {
        register: async (_, { username, email, password }) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) throw new Error('Email already in use');

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword });
            await user.save();

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });
            return { token, user };
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error('Invalid credentials');

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) throw new Error('Invalid credentials');

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });
            return { token, user };
        },
        createWebsite: async (_, { input }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const website = new Website({ ...input, userId: user.userId, version: 1 });
            await website.save();
            return website;
        },
        updateWebsite: async (_, { id, input }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const website = await Website.findOneAndUpdate(
                { _id: id, userId: user.userId },
                { ...input, $inc: { version: 1 } },
                { new: true }
            );
            if (!website) throw new Error('Website not found');
            pubsub.publish('WEBSITE_UPDATED', { websiteUpdated: website });
            return website;
        },
        deleteWebsite: async (_, { id }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const result = await Website.findOneAndDelete({ _id: id, userId: user.userId });
            return !!result;
        },
        createEcommerceProduct: async (_, { websiteId, input }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const website = await Website.findOne({ _id: websiteId, userId: user.userId });
            if (!website) throw new Error('Website not found');
            const product = new EcommerceProduct({ ...input, websiteId });
            await product.save();
            return product;
        },
        updateEcommerceProduct: async (_, { id, input }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const product = await EcommerceProduct.findOneAndUpdate(
                {
                    _id: id,
                    websiteId: { $in: await Website.find({ userId: user.userId }).distinct('_id') }
                },
                input,
                { new: true }
            );
            if (!product) throw new Error('Product not found');
            return product;
        },
        deleteEcommerceProduct: async (_, { id }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const result = await EcommerceProduct.findOneAndDelete({
                _id: id,
                websiteId: { $in: await Website.find({ userId: user.userId }).distinct('_id') }
            });
            return !!result;
        },
        addCollaborator: async (_, { websiteId, userId, role }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const website = await Website.findOne({ _id: websiteId, userId: user.userId });
            if (!website) throw new Error('Website not found');
            const collaboration = new Collaboration({ websiteId, userId, role });
            await collaboration.save();
            return collaboration;
        },
        removeCollaborator: async (_, { websiteId, userId }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const website = await Website.findOne({ _id: websiteId, userId: user.userId });
            if (!website) throw new Error('Website not found');
            const result = await Collaboration.findOneAndDelete({ websiteId, userId });
            return !!result;
        },
        updateSEOData: async (_, { websiteId, input }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const website = await Website.findOne({ _id: websiteId, userId: user.userId });
            if (!website) throw new Error('Website not found');
            const seoData = await SEOData.findOneAndUpdate(
                { websiteId },
                { ...input },
                { new: true, upsert: true }
            );
            return seoData;
        },
        getS3SignedUrl: async (_, { filename, contentType }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const key = `${user.userId}/${Date.now()}-${filename}`;
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
                ContentType: contentType,
                Expires: 60
            };
            const url = await s3.getSignedUrlPromise('putObject', params);
            return { url, key };
        }
    },
    Subscription: {
        websiteUpdated: {
            subscribe: (_, { id }) => pubsub.asyncIterator(`WEBSITE_UPDATED_${id}`)
        }
    },
    Website: {
        collaborators: async (website) => {
            const collaborations = await Collaboration.find({ websiteId: website.id });
            const collaboratorIds = collaborations.map((c) => c.userId);
            return User.find({ _id: { $in: collaboratorIds } });
        },
        seoData: (website) => SEOData.findOne({ websiteId: website.id }),
        ecommerceProducts: (website) => EcommerceProduct.find({ websiteId: website.id })
    },
    User: {
        websites: (user) => Website.find({ userId: user.id })
    }
};

export { typeDefs, resolvers };
