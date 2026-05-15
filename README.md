# Mini Hack Sprint Backend

This folder contains the backend API server for the Mini Hack Sprint project.

## Overview

The backend is an Express.js application connected to MongoDB. It handles:

- User registration and login
- JWT authentication
- Profile retrieval and updates
- Project creation, editing, and deletion
- Blog retrieval

## Tech stack

- Node.js
- Express
- MongoDB / Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- dotenv

## Structure

- `server.js` - application entry point
- `src/app.js` - Express app setup and route registration
- `src/config/db.js` - MongoDB connection
- `src/controllers/` - API request handlers
- `src/services/` - business logic and data queries
- `src/models/` - Mongoose schemas
- `src/middlewares/` - auth and error middleware
- `src/utils/` - utility helpers

## Environment

Create a `.env` file in the backend folder with the required values:

```env
MONGO_URL=<your-mongodb-connection-string>
PORT=4000
JWT_SECRET=<your-jwt-secret>
```

## Install

```bash
cd backend
npm install
```

## Run

```bash
npm run dev
```

The server will start on the configured port (default `4000`).

## Notes

- MongoDB must be running and reachable via `MONGO_URL`.
- Authentication uses JWT tokens, so the frontend must send credentials appropriately.
- The API schema is designed to support the frontend app in `../sprint`.
