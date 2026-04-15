import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { extractText } from "./ocr.js";
import { extractStructuredData } from "./llm.js";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Error handling
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup to save uploads in "uploads" folder
const upload = multer({ dest: path.join(__dirname, "uploads") });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Use multer's path directly
    const filePath = req.file.path;

    // 1️⃣ Extract text from image using OCR
    const rawText = await extractText(filePath);

    // 2️⃣ Extract structured data using LLaVA
    const structured = await extractStructuredData(rawText);

    res.json({ rawText, structured });
  } catch (err) {
    console.error("Error processing file:", err);
    res.status(500).json({ error: "Failed to process file" });
  }
});

// Start server on port 5001
app.listen(5001, () => {
  console.log("Server running on port 5001");
}).on("error", (err) => {
  console.error("Server failed to start:", err);
});