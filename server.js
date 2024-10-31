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
import contentRoutes from './routes/content.js';
import jwt from 'jsonwebtoken';
// import refreshRoutes from './routes/refresh.js'; 
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: process.env.REACT_APP_FRONTEND_URL, // Adjust to your client's origin
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  

const PORT = process.env.PORT || 5000;

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();
// Middleware for JWT authentication
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          console.error("JWT Verification Error:", err); // Log any verification error
          return next(new Error("Unauthorized"));
        }
        next();
      });
    } else {
      // Allow connection without token, assuming no authorization needed for this socket
      next(); 
    }
  });
  
  
  // Handle socket connection
  io.on("connection", (socket) => {
    console.log("A user connected:");
    // Additional event listeners can go here
  });
  
  // Make io accessible to the routes
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

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
app.use('/content', contentRoutes);

app.use(verifyJWT);
app.use('/todo', todoRoutes);
// app.use('/users', userRoutes);

app.use(errorHandler);

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

// Mongoose connection
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
