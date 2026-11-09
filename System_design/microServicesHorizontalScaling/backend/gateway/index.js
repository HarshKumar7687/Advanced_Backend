import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.json({ message: `Backend API Gateway is running on ${process.env.SERVER_NAME}` });
});

app.use("/auth",proxy("http://auth-service:8001"));
app.use("/order",proxy("http://order-service:8002"));
app.use("/product",proxy("http://product-service:8003"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});