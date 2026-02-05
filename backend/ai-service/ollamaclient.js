import ollama from "ollama";

export async function runWithInstruction(instruction, userPrompt) {
  return ollama.chat({
    model: "llama3.1",
    messages: [
      {
        role: "system",
        content: instruction.model.systemPrompt
      },
      {
        role: "user",
        content: userPrompt
      }
    ],
    options: instruction.model.options ?? {}
  });
}