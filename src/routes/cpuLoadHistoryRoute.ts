// Importing the Express framework to create a router instance
import express from 'express';
// Importing the getCpuHistory controller function to handle requests for CPU load history
import { getCpuHistory } from '../controllers/cpuHistoryController';

// Creating a new router instance from Express
const router = express.Router();

// Define a route for GET requests to '/cpu-load-history' that will invoke the getCpuHistory controller
router.get('/cpu-load-history', getCpuHistory);

// Export the router so it can be used in other parts of the application
export default router;
