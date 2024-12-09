import dotenv from "dotenv";
dotenv.config();

import { app, server } from "./lib/socket.js";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

const port = process.env.PORT;
const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("common"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.use(errorHandler);

server.listen(port, () => {
  console.log("Server is running on port: ", port);
  connectDB();
});

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).send(err);
}
