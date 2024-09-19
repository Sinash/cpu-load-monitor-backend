// Importing the Express framework to create a router instance
import express from 'express';
// Importing the getCpuLoad controller function to handle requests for the current CPU load
import { getCpuLoad } from '../controllers/cpuLoadController';

// Creating a new router instance from Express
const router = express.Router();

// Define a route for GET requests to '/cpu-load' that will invoke the getCpuLoad controller
router.get('/cpu-load', getCpuLoad);

// Export the router so it can be used in other parts of the application
export default router;
