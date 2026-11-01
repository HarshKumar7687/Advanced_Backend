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

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(`otp:${email}`, otp, "EX", 300); // Store OTP for 5 minutes
  return res.status(200).json({ message: `OTP sent successfully to ${email} : ${otp}` });
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = await redis.get(`otp:${email}`);
  if(storedOtp){
    if (storedOtp === otp) {
        await redis.del(`otp:${email}`); // Remove OTP after successful verification
        return res.status(200).json({ message: "OTP verified successfully" });
    }
  }else{
    return res.status(400).json({ message: "OTP expired or not found" });
  }
  return res.status(400).json({ message: "Invalid OTP" });
});

app.listen(PORT, () => {
  connectToDatabase();
  console.log(`Server is running on port ${PORT}`);
});
