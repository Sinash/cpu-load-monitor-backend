// Importing the Express framework
import express from 'express';
// Importing the global error handler middleware
import { errorHandler } from './middleware/errorMiddleware';
// Importing the routes for CPU load alerts, history, and current load
import basicAuth from './middleware/authorization';
import cpuLoadAlertsRoute from './routes/cpuLoadAlertsRoute';
import cpuLoadHistoryRoute from './routes/cpuLoadHistoryRoute';
import cpuLoadRoute from './routes/cpuLoadRoute';
import cpuSummaryRoute from './routes/cpuSummaryRoutes';

// Create an instance of the Express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Apply Basic Auth to all /api routes
app.use('/api', basicAuth);

// Register routes for handling API requests related to CPU load, history, and alerts
app.use('/api/v1', cpuLoadRoute); // Route for current CPU load
app.use('/api/v1', cpuLoadHistoryRoute); // Route for CPU load history
app.use('/api/v1', cpuLoadAlertsRoute); // Route for CPU load alerts
app.use('/api/v1', cpuSummaryRoute); // Route for CPU Summary

// Catch-all route for undefined routes, returning a 404 error
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found. Please check the URL.' });
});

// Global error handler for handling errors throughout the application
app.use(errorHandler);

// Export the app instance to be used in other parts of the application (e.g., server setup)
export default app;
