import express from 'express';
import dotenv from 'dotenv';
// npm i @google/genai
import { GoogleGenAI } from '@google/genai';
dotenv.config();

const app = express();
app.use(express.json());
const PORT = 5000;

const ai = new GoogleGenAI({
    //https://aistudio.google.com/api-keys
  apiKey: process.env.GEMINI_API_KEY
});

app.post("/ai",async (req, res) => {
    const {input} = req.body;
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
            {
                role:'user',
                parts:[{ text: input }]
            }
        ],
        config: {
            systemInstruction: "You are a helpful assistant. Your name is Jarvis. If you dont know the answer, say 'I don't know'.",
            temperature: 0.7
        }
    });
    return res.json({ response: response.text });
});

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});