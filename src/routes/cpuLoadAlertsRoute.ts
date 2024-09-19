// Importing the Express framework to create a router instance
import express from 'express';
// Importing the getCpuAlerts controller function to handle requests for CPU load alerts
import { getCpuAlerts } from '../controllers/cpuAlertsController';

const router = express.Router();

// Define a route for GET requests to '/cpu-load-alerts' that will invoke the getCpuHistory controller
router.get('/cpu-load-alerts', getCpuAlerts);

// Export the router to be used in other parts of the application
export default router;
