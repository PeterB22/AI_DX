import express from "express";
import { getInstruction } from "./instructions.js";
import { runWithInstruction } from "./ollamaclient.js";

const app = express();
app.use(express.json());

/**
 * POST /chat
 * {
 *   "instructionId": "semantic_search",
 *   "prompt": "Find contracts mentioning termination clauses"
 * }
 */
app.post("/chat", async (req, res) => {
  const { instructionId, prompt } = req.body;

  if (!instructionId || !prompt) {
    return res.status(400).json({
      error: "instructionId and prompt are required"
    });
  }

  try {
    const instruction = await getInstruction(instructionId);

    const response = await runWithInstruction(
      instruction,
      prompt
    );

    res.json({
      instructionId,
      output: response.message.content
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(4000, () => {
  console.log("AI service running on http://localhost:4000");
});