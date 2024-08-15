import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const handleNewUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // Check for duplicate usernames in the database
    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate) return res.sendStatus(409); // Conflict

    try {
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
