import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./lib/db.js";
import User from "./model/user.model.js";
import Redis from "ioredis";
import emailQueue from "./queue.js"; // Import the emailQueue from queue.js

dotenv.config();

const app = express();
const redis = new Redis(process.env.REDIS_URL);
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

//create a new user and invalidate the cache
app.post("/create", async (req, res) => {
  const {name, email, age, password} = req.body;
  const user = await User.create({name, email, age, password});
  await emailQueue.add("sendEmail", { email: email }); // Add a job to the queue to send an email after creating a new user
  return res.status(201).json(user);
});

app.listen(PORT, () => {
  connectToDatabase();
  console.log(`Server is running on port ${PORT}`);
});
