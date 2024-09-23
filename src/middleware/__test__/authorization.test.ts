import { NextFunction, Request, Response } from 'express';
import basicAuth from '../authorization';

// Extend Request to include the 'user' property for type safety
interface AuthenticatedRequest extends Request {
  user?: string;
}

describe('basicAuth Middleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Initialize request, response, and next function
    req = {
      headers: {}, // Initialize headers to avoid 'possibly undefined' errors
    };
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    res = {
      json: jsonMock,
      status: statusMock,
    };

    next = jest.fn(); // Mock next function

    // Clear mocks before each test
    jest.clearAllMocks();

    // Set valid environment variables for testing
    process.env.USERNAME = 'testuser';
    process.env.PASSWORD = 'testpassword';
  });

  it('should return 401 if the authorization header is missing', () => {
    // Call the middleware without authorization header
    basicAuth(req as Request, res as Response, next);

    // Expect status 401 and error message
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Authorization header missing or malformed',
    });

    // Expect next() not to be called
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if the authorization header is malformed', () => {
    // Provide an incorrect authorization header
    req.headers!.authorization = 'Bearer abc123'; // Incorrect format

    // Call the middleware
    basicAuth(req as Request, res as Response, next);

    // Expect status 401 and error message
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Authorization header missing or malformed',
    });

    // Expect next() not to have been called
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if the credentials are invalid', () => {
    // Provide an incorrect username and password
    const invalidCredentials = Buffer.from(
      'invaliduser:invalidpassword'
    ).toString('base64');
    req.headers!.authorization = `Basic ${invalidCredentials}`;

    // Call the middleware
    basicAuth(req as Request, res as Response, next);

    // Expect status 401 and error message
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid credentials',
    });

    // Expect next() not to be called
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if the credentials are valid', () => {
    // Provide valid credentials
    const validCredentials = Buffer.from('testuser:testpassword').toString(
      'base64'
    );
    req.headers!.authorization = `Basic ${validCredentials}`;

    // Call the middleware
    basicAuth(req as Request, res as Response, next);

    // Expect next() to be called
    expect(next).toHaveBeenCalled();

    // Expect status and json not to be called (because next() was called)
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should store the user in the request object if credentials are valid', () => {
    // Provide valid credentials
    const validCredentials = Buffer.from('testuser:testpassword').toString(
      'base64'
    );
    req.headers!.authorization = `Basic ${validCredentials}`;

    // Call the middleware
    basicAuth(req as AuthenticatedRequest, res as Response, next);

    // Expect the user to be stored in the request object
    expect(req.user).toBe('testuser');

    // Expect next() to be called
    expect(next).toHaveBeenCalled();
  });
});
