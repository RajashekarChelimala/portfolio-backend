import User from '../models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

export const handleNewUser = async (req, res) => {
    const { username, password, adminKey } = req.body;

    // Check if all required fields are provided
    if (!username || !password || !adminKey) {
        return res.status(400).json({ 'message': 'Username, password, and adminKey are required.' });
    }

    // Verify the adminKey
    if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({ 'message': 'Invalid admin key.' }); // Forbidden
    }

    try {
        // Check if any user already exists in the database
        const existingUsers = await User.find().exec();
        if (existingUsers.length > 0) {
            return res.status(409).json({ 'message': 'A user already exists. Registration is not allowed.' }); // Conflict
        }

        // Encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        // Create and store the new user
        const result = await User.create({
            "username": username,
            "password": hashedPwd
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};
