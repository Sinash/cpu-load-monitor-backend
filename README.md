# CPU Load Monitor - Backend Service

## Overview

The CPU Load Monitor Backend Service is a Node.js application that provides a RESTful API for monitoring CPU load and managing alerts. It collects data on CPU load averages and allows users to access current load, historical data, and alerts related to high CPU usage and recovery.

## Features

- Fetch current CPU load data
- Retrieve historical CPU load data
- Manage high load alerts and recovery alerts
- RESTful API endpoints for integration with frontend applications

## Technologies Used

- **Node.js**: JavaScript runtime for server-side development
- **Express**: Web framework for building RESTful APIs
- **TypeScript**: Typed superset of JavaScript for better development experience
- **Jest**: Testing framework for unit and integration tests
- **ESLint**: Linter for identifying and fixing problems in Typescript code
- **Prettier**: Code formatter for consistent styling
- **Nodemon**: Automatically restart the server during development
- **Husky**: Git hooks for ensuring code quality and best practices before commits
- **Dotenv**: Environment variable management

## API Endpoints

### Authentication

All endpoints require Basic Authentication. You need to send an `Authorization` header with the credentials in the format `Basic base64(username:password)`.

Example Authorization header: `Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=`

### 1. Get Current CPU Load

- **Endpoint**: `GET /api/v1/cpu-load`
- **Description**: Fetches the current CPU load average data along with timestamp and isHighLoad & isRecovery flags.
- **Authentication**: Requires Basic Authentication.
- **Response**:
  ```json
  {
    "loadAverage": 0.2484130859375,
    "isHighLoad": false,
    "isRecovery": false,
    "timestamp": "2024-09-23T20:00:50.885Z"
  }
  ```

### 2. Get Historical CPU Load

- **Endpoint**: `GET api/v1/cpu-load-history`
- **Description**: Retrieves historical CPU load data. Use in-memory to store the 10 mins data and old entries get cleared as new entries gets added.
- **Authentication**: Requires Basic Authentication.
- **Response**:

  ```json
  [
    {
      "loadAverage": 0.2484130859375,
      "timestamp": "2024-09-23T20:00:50.885Z"
    },
    {
      "loadAverage": 0.201171875,
      "timestamp": "2024-09-23T20:05:50.438Z"
    },
    {
      "loadAverage": 0.195068359375,
      "timestamp": "2024-09-23T20:05:52.666Z"
    }
  ]
  ```

  ### 3. Get CPU Load Alerts

- **Endpoint**: `GET api/v1/cpu-load-alerts`
- **Description**: Fetch CPU load alerts. It keeps track of all the occurence of high load alerts and recovery alerts.
- **Authentication**: Requires Basic Authentication.
- **Response**:
  ```json
  {
    "highLoadAlerts": [],
    "recoveryAlerts": [],
    "highLoadCount": 0,
    "recoveryCount": 0
  }
  ```
