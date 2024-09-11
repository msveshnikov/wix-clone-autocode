import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Server } from 'socket.io';
import { createServer } from 'http';
import sharp from 'sharp';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import { typeDefs, resolvers } from './graphql.js';
import { User, Website } from './models/index.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
    }
});

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/websites', authenticateToken, async (req, res) => {
    try {
        const { name, content } = req.body;
        const website = new Website({
            userId: req.user.userId,
            name,
            content,
            published: false,
            version: 1
        });
        await website.save();
        res.status(201).json(website);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create website' });
    }
});

app.get('/api/websites', authenticateToken, async (req, res) => {
    try {
        const websites = await Website.find({ userId: req.user.userId });
        res.json(websites);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch websites' });
    }
});

app.put('/api/websites/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, content, domain, published } = req.body;
        const website = await Website.findOneAndUpdate(
            { _id: id, userId: req.user.userId },
            { name, content, domain, published, $inc: { version: 1 } },
            { new: true }
        );
        if (!website) return res.status(404).json({ error: 'Website not found' });
        res.json(website);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update website' });
    }
});

app.delete('/api/websites/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Website.findOneAndDelete({
            _id: id,
            userId: req.user.userId
        });
        if (!result) return res.status(404).json({ error: 'Website not found' });
        res.json({ message: 'Website deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete website' });
    }
});

app.post('/api/upload', authenticateToken, async (req, res) => {
    try {
        const file = req.files.file;
        const optimizedBuffer = await sharp(file.data)
            .resize(1000)
            .webp({ quality: 80 })
            .toBuffer();

        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `${Date.now()}-${file.name}`,
            Body: optimizedBuffer,
            ContentType: 'image/webp'
        };

        const data = await s3.upload(params).promise();
        res.json({ url: data.Location });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

app.post('/api/collaborate', authenticateToken, async (req, res) => {
    try {
        const { websiteId, collaboratorEmail } = req.body;
        const website = await Website.findOne({
            _id: websiteId,
            userId: req.user.userId
        });
        if (!website) return res.status(404).json({ error: 'Website not found' });

        const collaborator = await User.findOne({ email: collaboratorEmail });
        if (!collaborator) return res.status(404).json({ error: 'User not found' });

        if (website.collaborators.includes(collaborator._id)) {
            return res.status(400).json({ error: 'User is already a collaborator' });
        }

        website.collaborators.push(collaborator._id);
        await website.save();

        res.json({ message: 'Collaborator added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add collaborator' });
    }
});

io.on('connection', (socket) => {
    socket.on('join-website', (websiteId) => {
        socket.join(websiteId);
    });

    socket.on('update-website', (data) => {
        socket.to(data.websiteId).emit('website-updated', data);
    });
});

const schema = makeExecutableSchema({ typeDefs, resolvers });
const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
        const token = req.headers.authorization || '';
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            return { user };
        } catch (error) {
            return {};
        }
    }
});

async function startServer() {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    httpServer.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log(`GraphQL endpoint: ${apolloServer.graphqlPath}`);
    });
}

startServer();
