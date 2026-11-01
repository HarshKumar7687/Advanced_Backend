import { redis } from "../rate_limiting.js";

const rateLimitter = async (req, res, next) => {
    const ip = req.ip;
    const key = `rate-limit:${ip}`;
    const requestCount = await redis.incr(key);
    if(requestCount === 1) {
        await redis.expire(key, 60); // Set expiration time for the key to 60 seconds
    }
    if (requestCount>5) {
        return res.status(429).json({ error: "Too many requests" });
    }
    next();
};
export default rateLimitter;