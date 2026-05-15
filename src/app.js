const express = require("express");
const cors = require("cors");

const app = express();

const authRouter = require("./routes/auth.routes");
const profileRouter = require("./routes/profile.routes");
const projectsRouter = require("./routes/projects.routes");
const blogsRouter = require("./routes/blogs.routes");

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, postman, curl)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/blogs", blogsRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  console.log("errors", err.message);

  res.status(statusCode).json({
    message,
  });
});

module.exports = app;