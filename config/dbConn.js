// const mongoose = require('mongoose');
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log('connect',process.env.DATABASE_URI);
        if (!process.env.DATABASE_URI) {
            throw new Error('DATABASE_URI is not defined');
        }
        await mongoose.connect(process.env.DATABASE_URI);
    } catch (err) {
        console.error(err);
    }
}

export default connectDB;