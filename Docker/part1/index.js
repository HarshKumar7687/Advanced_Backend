import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello Docker!" });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});