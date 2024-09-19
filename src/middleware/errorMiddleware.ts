// Importing NextFunction, Request, and Response types from Express
import { Request, Response } from 'express';

/**
 * Middleware function to handle errors in the application.
 *
 * This function catches errors that occur during the request-handling process,
 * logs the error stack to the console, and sends a generic 500 Internal Server Error
 * response to the client.
 *
 * @param {Error} err - The error object caught by the middleware
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @param {NextFunction} next - The next function to pass control to the next middleware
 *
 * @returns {void} Sends a 500 error response with a generic message
 */
export const errorHandler = (
  err: Error, // The error object caught by the middleware
  req: Request, // The request object from Express
  res: Response // The response object from Express
) => {
  // Log the full error stack to the console for debugging purposes
  console.error(err.stack);

  // Send a 500 Internal Server Error response with a generic error message
  res.status(500).send({ error: 'Something went wrong!' });
};
