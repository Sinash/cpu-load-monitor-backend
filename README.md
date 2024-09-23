# 🚀 CPU Load Monitor - Backend Service

![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green?style=flat&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.0%2B-blue?style=flat&logo=typescript)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey?style=flat&logo=express)
![Jest](https://img.shields.io/badge/Jest-27.0%2B-red?style=flat&logo=jest)

## 📝 Overview

The **CPU Load Monitor Backend Service** is a RESTful API built with Node.js that monitors CPU load, tracks historical data, and manages alerts for high load conditions. It provides endpoints to access current CPU load, historical load data, and alert management, making it ideal for monitoring system performance.

---

## ✨ Features

- 📊 **Fetch Current CPU Load**: Get the real-time CPU load average.
- 📈 **Retrieve Historical Data**: View CPU load history for the last 10 minutes.
- 🔔 **High Load & Recovery Alerts**: Track CPU load alerts and their recovery.
- 🌐 **RESTful API**: Easy integration with frontend applications.

---

## 🛠️ Technologies Used

- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web framework to build RESTful APIs.
- **TypeScript**: Typed superset of JavaScript for enhanced development experience.
- **Jest**: Testing framework for unit and integration tests.
- **ESLint**: Linter to maintain consistent and error-free code.
- **Prettier**: Code formatter to enforce a consistent style.
- **Nodemon**: Tool to automatically restart the server during development.
- **Husky**: Git hooks to enforce code quality before commits.
- **Dotenv**: Manages environment variables efficiently.

---

## 📡 API Endpoints

### 1️⃣ **Get Current CPU Load**

- **Endpoint**: `GET /api/v1/cpu-load`
- **Description**: Fetches the current CPU load average along with flags indicating high load and recovery status.
- **Response**:

  ```json
  {
    "loadAverage": 0.248,
    "isHighLoad": false,
    "isRecovery": false,
    "timestamp": "2024-09-23T20:00:50.885Z"
  }
  ```

### 2️⃣ **Get Historical CPU Load**

- **Endpoint**: `GET /api/v1/cpu-load-history`
- **Description**: Retrieves CPU load history stored for the last 10 minutes.
- **Response**:

  ```json
  [
    { "loadAverage": 0.248, "timestamp": "2024-09-23T20:00:50.885Z" },
    { "loadAverage": 0.201, "timestamp": "2024-09-23T20:05:50.438Z" }
  ]
  ```

### 3️⃣ **Get CPU Load Alerts**

- **Endpoint**: `GET /api/v1/cpu-load-alerts`
- **Description**: Fetches all CPU load alerts and recovery events. Includes the number of high load and recovery events.
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
      }
    ],
    "recoveryAlerts": [
      {
        "startTime": "2024-09-23T20:17:20.400Z",
        "endTime": "2024-09-23T20:19:20.400Z"
      }
    ],
    "highLoadCount": 3,
    "recoveryCount": 2
  }
  ```

---

## 📦 Installation

### ✅ Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 14.x or higher
- **npm**: Installed with Node.js (ensure it's updated using `npm install -g npm`)
- **nvm**: Recommended to manage Node.js versions

To verify Node.js is installed:

```bash
node -v
```

### 🛠️ Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone git@github.com:Sinash/cpu-load-monitor-backend.git
   cd cpu-load-monitor-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```bash
   # .env
   PORT=3001
   USERNAME="cpu-user"
   PASSWORD="cpu-password"
   ```

4. **Run the service:**

   For development with auto-restart:

   ```bash
   npm run dev
   ```

   For production:

   ```bash
   npm start
   ```

---

## 💻 Development Guide

### 1️⃣ **Linting**

Run ESLint to check for code issues:

```bash
npm run lint
```

To auto-fix issues:

```bash
npm run lint:fix
```

### 2️⃣ **Code Formatting**

Run Prettier to format your code:

```bash
npm run format
```

### 3️⃣ **Testing**

Run all tests using Jest:

```bash
npm test
```

---

## 📝 Commit Message Guidelines

- Use the present tense: "Add feature" not "Added feature."
- Limit the first line to 72 characters.
- Reference issues or PRs if applicable.

Example commit message:

```bash
git commit -m "feat: add API endpoint for fetching current CPU load"
```

---

## 📸 Screenshots

![CPU Load Monitor](https://github.com/user-attachments/assets/3e9a7403-e2b9-4d0a-8b35-2f8b4209156e)

---
