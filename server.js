import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";


const app = express();
const port = process.env.PORT || 4000;

const genAI = new GoogleGenerativeAI("AIzaSyBOww7IX8J-xq5lJQPXkKVESx6-NmMDnM8");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' })); 


app.get("/", (req, res) => {
  res.send("Hello World!");
})

app.post("/post", async (req, res) => {
  try{
    const base64  = req.body.image.split(",")[1];
    console.log(base64);

    function fileToGenerativePart() {
      return {
        inlineData: {
          data: base64,
          mimeType:"image/jpeg"
        },
      };
    }

    const prompt = "Answer the following question: ";
    const imagePart = fileToGenerativePart();

    const result = await model.generateContent([prompt, imagePart]);
    console.log(result.response.text());
    res.json({ text: result.response.text() });
  }
  catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


