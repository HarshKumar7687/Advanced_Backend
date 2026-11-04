import { Worker } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";
import sendEmail from "./lib/sendEmail.js";

dotenv.config();

const connection = new Redis(process.env.REDIS_URL, {maxRetriesPerRequest: null,});
const worker = new Worker("emailQueue", async (job) => {
    console.log("Job Started:");
    const email = job.data.email;
    await sendEmail(email);
    console.log("Job Completed:");
    console.log(`Email sent to ${email}`);
},{connection: connection});
