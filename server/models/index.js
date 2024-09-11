import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const websiteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    content: { type: Object, required: true },
    published: { type: Boolean, default: false },
    domain: { type: String },
    version: { type: Number, default: 1 },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const templateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    content: { type: Object, required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ecommerceSchema = new mongoose.Schema({
    websiteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: true },
    products: [
        {
            name: { type: String, required: true },
            description: { type: String },
            price: { type: Number, required: true },
            inventory: { type: Number, default: 0 }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Website = mongoose.model('Website', websiteSchema);
const Template = mongoose.model('Template', templateSchema);
const Ecommerce = mongoose.model('Ecommerce', ecommerceSchema);

export { User, Website, Template, Ecommerce };
