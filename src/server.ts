import app from './app'; // Import the Express app instance
import { config } from './config'; // Import the configuration settings
import { logger } from './utils/logger'; // Import the logger utility

/**
 * Starts the Express application and listens on the configured port.
 *
 * The server listens on the port specified in the configuration,
 * and once the server starts, a message is logged using the logger utility.
 */
export const startServer = () => {
  const server = app.listen(config.PORT, () => {
    logger(`Server started on port ${config.PORT}`);
  });

  return server;
};

// Only start the server if this file is executed directly (not during testing)
if (require.main === module) {
  startServer();
}
