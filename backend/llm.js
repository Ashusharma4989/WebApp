import axios from "axios";

export async function extractStructuredData(text) {
  try {
    const response = await axios.post("http://localhost:11434/v1/chat/completions", {
      model: "llava", // make sure this matches `ollama list`
      messages: [
        {
          role: "system",
          content: `
Extract all possible key-value pairs from the given text.

STRICT RULES:
- Output ONLY valid JSON
- Do NOT include explanation or extra text
- Format: {"Key":"Value"}

Example:
{"Name":"John Doe","DOB":"01-01-1990"}
`
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    let content = response.data.choices[0].message.content;

    console.log("LLaVA RAW RESPONSE:", content); // helpful debug

    // ---------- STEP 1: Try direct JSON ----------
    try {
      return JSON.parse(content);
    } catch {}

    // ---------- STEP 2: Extract JSON block ----------
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {}
    }

    // ---------- STEP 3: Parse Key: Value formats ----------
    const result = {};
    const lines = content.split("\n");

    lines.forEach((line) => {
      // Match: Key: XXX Value: YYY
      let match = line.match(/Key:\s*(.*?)\s*Value:\s*(.*)/i);
      if (match) {
        result[match[1].trim()] = match[2].trim();
      }

      // Match: XXX: YYY
      match = line.match(/^\*?\s*(.*?)\s*:\s*(.*)/);
      if (match) {
        result[match[1].trim()] = match[2].trim();
      }
    });

    // ---------- STEP 4: fallback ----------
    if (Object.keys(result).length === 0) {
      return { raw: content };
    }

    return result;

  } catch (error) {
    console.error("LLaVA ERROR:", error.message);
    return { raw: "Failed to process LLaVA response" };
  }
}