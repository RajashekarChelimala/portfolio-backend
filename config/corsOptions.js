import allowedOrigins from "./allowedOrigins.js";

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true, // Allow cookies to be sent with requests
    methods: ['GET', 'POST','PUT','DELETE'], // Add allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Add allowed headers
}

export default corsOptions;