import Tesseract from "tesseract.js";

export async function extractText(filePath) {
  const result = await Tesseract.recognize(filePath, "eng");
  return result.data.text;
}