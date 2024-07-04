const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get .env variable
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRE_MINUTES = process.env.ACCESS_TOKEN_EXPIRE_MINUTES;

// Token JWT Class
class Token {
     // Generate JWT Token
     createToken(id) {
          // Access Token
          const accessToken = jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
               expiresIn: `${ACCESS_TOKEN_EXPIRE_MINUTES}h`,
          });

          // Time
          const expirationTime = parseInt(ACCESS_TOKEN_EXPIRE_MINUTES) * 1000;

          // Return Token
          return { accessToken, expiration: new Date(Date.now() + expirationTime)};
     }

     // Verify JWT Token
     verifyToken(token) {
          // Exception
          try {
               // Verify Token
               const data = jwt.verify(token, ACCESS_TOKEN_SECRET);

               // Return id
               return data.id;

          } catch (error) {
               throw new Error('Không thể xác thực token');
          }
     }
}

module.exports = new Token();