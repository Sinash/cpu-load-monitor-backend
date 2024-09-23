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
- **Description**: Fetch CPU load alerts. It keeps track of all the occurence of high load alerts and recovery alerts. It includes start and end datetime for each alert and also the number of total alerts on each category.
- **Authentication**: Requires Basic Authentication.
- **Response**:
  ```json
  {
    "highLoadAlerts": [
      {
        "startTime": "2024-09-23T20:15:20.400Z",
        "endTime": "2024-09-23T20:17:20.400Z"
      },
      {
        "startTime": "2024-09-23T21:22:20.400Z",
        "endTime": "2024-09-23T21:30:20.400Z"
      },
      {
        "startTime": "2024-09-23T22:01:00.400Z"
      }
    ],
    "recoveryAlerts": [
      {
        "startTime": "2024-09-23T20:17:20.400Z",
        "endTime": "2024-09-23T20:19:20.400Z"
      },
      {
        "startTime": "2024-09-23T21:30:20.400Z",
        "endTime": "2024-09-23T21:32:20.400Z"
      }
    ],
    "highLoadCount": 3,
    "recoveryCount": 2
  }
  ```

## Installation

## Prerequisites

Before installing and running the CPU Load Monitor Backend Service, ensure you have the following installed on your system:

- **Node.js**: v14.x or higher
- **npm**: Comes with Node.js. Ensure it’s updated by running `npm install -g npm`.

To check if Node.js is installed and verify the version, run the following command in your terminal:

```bash
node -v
```

## To set up the CPU Load Monitor - Backend Service, follow these steps:

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone git@github.com:Sinash/cpu-load-monitor-backend.git
cd cpu-load-monitor-backend
```

### 2. Install Dependencies

Install the required dependencies using npm:

```bash
npm install
```

### 3. Set Up Environment Variables

This project uses dotenv to manage environment variables. Create a .env file in the root of your project directory. Below is an example of the `.env` file structure. You can also rename the `.env.sample` to `.env` thats in the repo

```bash
# .env
PORT=3001
USERNAME="cpu-user"
PASSWORD="cpu-password"
```
