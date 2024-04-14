const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const protectRoute = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // console.log('Token:', token);
    // console.log('AuthHeader:', authHeader);

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Token is missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userID).select("-password -friendRequests -friends");

        if (!req.user) {
            return res.status(401).json({ error: 'Access denied. Invalid token.' });
        }

        next();
    } catch (error) {
        console.error('Error authenticating token:', error.message);
        return res.status(403).json({ error: 'Access denied. Invalid token.' });
    }
}
module.exports = protectRoute