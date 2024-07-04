import jwt from 'jsonwebtoken';

// Check token expired
export const isTokenExpired = async (token: string) => {

// Assuming `token` is your JWT token
const decodeToken = jwt.decode(token);
const currentTime = Date.now() / 1000;

if (typeof decodeToken !== 'string') {
    // decodeToken is JwtPayload
    return decodeToken?.exp === undefined ? true : decodeToken?.exp < currentTime;
} else {
    // decodeToken is a string
    return false; // Or handle it based on your logic
}
  
};
