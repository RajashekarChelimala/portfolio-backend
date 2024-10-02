import 'dotenv/config.js';  
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';  // For resolving __dirname
import cors from 'cors';
import corsOptions from './config/corsOptions.js';  
import errorHandler from './middlewares/errorHandler.js';
import { logger } from './middlewares/logEvents.js';
import verifyJWT from './middlewares/verifyJWT.js'; 
import cookieParser from 'cookie-parser';
import credentials from './middlewares/credentials.js';  
import mongoose from 'mongoose';
import connectDB from './config/dbConn.js';  
import rootRoutes from './routes/root.js';  
import postRoutes from './routes/post.js';
import projectRoutes from './routes/project.js';
import registerRoutes from './routes/register.js';
import authRoutes from './routes/auth.js';  
import serviceRoutes from './routes/service.js';  
import contactRoutes from './routes/contact.js';  
import todoRoutes from './routes/todoRoutes.js';
import skillRoutes from './routes/skill.js';
// import refreshRoutes from './routes/refresh.js'; 

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// Custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for JSON
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', rootRoutes);
app.use('/register', registerRoutes);
app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);
app.use('/posts', postRoutes);
app.use('/services', serviceRoutes);
app.use('/projects', projectRoutes);
app.use('/skills', skillRoutes);

app.use(verifyJWT);
app.use('/todo', todoRoutes);
// app.use('/users', userRoutes);

app.all('*', (req, res) => {
    console.log(req.body);
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

// Mongoose connection
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
