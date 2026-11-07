import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./lib/db.js";
import Redis from "ioredis";

dotenv.config();

const app = express();
export const redis = new Redis(process.env.REDIS_URL);
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`Hello, World! from ${process.env.SERVER_NAME}`);
});

app.listen(PORT, () => {
  connectToDatabase();
  console.log(`Server is running on port ${PORT}`);
});