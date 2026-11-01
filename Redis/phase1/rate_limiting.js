import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./lib/db.js";
import Redis from "ioredis";
import rateLimitter from "./middleware/rateLimit.js";

dotenv.config();

const app = express();
export const redis = new Redis(process.env.REDIS_URL);
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/",rateLimitter ,(req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  connectToDatabase();
  console.log(`Server is running on port ${PORT}`);
});