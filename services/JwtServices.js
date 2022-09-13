const { JWT_SECRET } =require("../config");
const jwt = require("jsonwebtoken");

class JwtService {
    // Synchronous Sign 
    static sign(payload, expiry = '1m', secret = JWT_SECRET) {
        // Returns the jsonwebtoken as string
        return jwt.sign(payload, secret, { expiresIn: expiry });
    }

    // Synchronous Verify 
    static verify(token, secret = JWT_SECRET) {
        // Returns the payload decoded if the token is valid If not, it will throw the error.
        return jwt.verify(token, secret);
    }
}

module.exports= JwtService;