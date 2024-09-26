// Importing the Express framework to create a router instance
import express from 'express';
// Importing the getCpuSummary controller function to handle requests for the CPU summary
import { getCpuSummery } from '../controllers/cpuSummeryController';

// Creating a new router instance from Express
const router = express.Router();

// Define a route for GET requests to '/cpu-summery' that will invoke the getCpuSummery controller
router.get('/cpu-summery', getCpuSummery);

// Export the router so it can be used in other parts of the application
export default router;
