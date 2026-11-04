import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./lib/db.js";
import User from "./model/user.model.js";
import Redis from "ioredis";

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
  await redis.del("user:all"); // Invalidate the cache when a new user is created
  const user = await User.create({name, email, age, password});
  return res.status(201).json(user);
});

//get all users without caching 11 ms
app.get("/users", async (req, res) => {
  const users = await User.find();
  return res.status(200).json(users);
});

//get all users with caching 3 ms
app.get("/get-users-redis", async (req, res) => {
  const cachedUsers = await redis.get("user:all");
  if (cachedUsers) {
    //JSON.parse() is used to convert the cached string back into a JavaScript object or array. This is necessary because Redis stores 
    //data as strings, and when we retrieve it, we need to convert it back to its original format for use in our application.
    return res.status(200).json(JSON.parse(cachedUsers));
  }
  const users = await User.find();
  //JSON.stringify() is used to convert the JavaScript object or array into a string format before storing it in Redis. 
  //This is necessary because Redis stores data as strings, and we need to serialize the data before saving it.
  await redis.set("user:all", JSON.stringify(users));
  return res.status(200).json(users);
});

app.listen(PORT, () => {
  connectToDatabase();
  console.log(`Server is running on port ${PORT}`);
});

//without redis - 11 ms
//with redis - 3 ms

//npm i ioredis