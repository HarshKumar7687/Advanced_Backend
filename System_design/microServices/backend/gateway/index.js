import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.json({ message: "Backend is running" });
});

app.use("/auth",proxy("http://localhost:8001"));
app.use("/order",proxy("http://localhost:8002"));
app.use("/product",proxy("http://localhost:8003"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});