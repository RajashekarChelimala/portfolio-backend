import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Handle User Login
const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser) return res.sendStatus(401); // Unauthorized 

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const accessToken = jwt.sign(
            { "UserInfo": { "username": foundUser.username } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '9000s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });

    } else {
        res.sendStatus(401);
    }
}

// Check if the user is authenticated
const checkAuth = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const foundUser = await User.findOne({ username: decoded.username }).exec();
        if (!foundUser || foundUser.refreshToken !== refreshToken) return res.sendStatus(403); // Forbidden

        const accessToken = jwt.sign(
            { "UserInfo": { "username": foundUser.username } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '9000s' }
        );

        res.json({ accessToken });
    } catch (err) {
        res.sendStatus(403); // Forbidden
    }
}

// Handle User Logout
const logout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
};


export { handleLogin, checkAuth, logout };
