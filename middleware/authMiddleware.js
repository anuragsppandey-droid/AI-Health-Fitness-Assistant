/* Import */

const jwt = require("jsonwebtoken");


/* Authentication Middleware */

const authMiddleware = (req, res, next) => {

    try {

        // Get Authorization Header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // Extract Token
        const token = authHeader.split(" ")[1];

        // Verify Token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store User ID
        req.user = {
            id: decoded.userId
        };

        next();

    } catch (error) {

        console.error("JWT verification error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};


/* Export */

module.exports = authMiddleware;