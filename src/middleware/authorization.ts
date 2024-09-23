import { NextFunction, Request, Response } from 'express';

// Define an interface to extend the Request object with optional user property if needed
interface AuthenticatedRequest extends Request {
  user?: string;
}

// Basic Auth Middleware in TypeScript
const basicAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Check for the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res
      .status(401)
      .json({ message: 'Authorization header missing or malformed' });
  }

  // Decode base64-encoded credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii'
  );
  const [username, password] = credentials.split(':');

  // Check if the username and password are correct (hardcoded for demo purposes)
  const validUsername = process.env.USERNAME;
  const validPassword = process.env.PASSWORD;

  if (username === validUsername && password === validPassword) {
    req.user = username; // Optionally store the user in the request object
    return next(); // Allow the request to proceed
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};

export default basicAuth;
