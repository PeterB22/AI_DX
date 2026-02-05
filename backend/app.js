import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

const INSTRUCTIONS_DIR = path.join(process.cwd(), "instructions");

app.use(express.json());

/**
 * Utility: ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * POST /instructions
 * Upload a new instruction JSON
 */
app.post("/instructions", (req, res) => {
  const instruction = req.body;

  if (!instruction.id || !instruction.version) {
    return res.status(400).json({
      error: "Instruction must include id and version"
    });
  }

  const instructionDir = path.join(
    INSTRUCTIONS_DIR,
    instruction.id
  );

  ensureDir(instructionDir);

  const filePath = path.join(
    instructionDir,
    `${instruction.version}.json`
  );

  fs.writeFileSync(
    filePath,
    JSON.stringify(instruction, null, 2)
  );

  res.status(201).json({
    message: "Instruction uploaded",
    id: instruction.id,
    version: instruction.version
  });
});

/**
 * GET /instructions
 * List all available instructions (summary only)
 */
app.get("/instructions", (req, res) => {
  if (!fs.existsSync(INSTRUCTIONS_DIR)) {
    return res.json([]);
  }

  const result = [];

  const instructionIds = fs.readdirSync(INSTRUCTIONS_DIR);

  for (const id of instructionIds) {
    const versions = fs.readdirSync(
      path.join(INSTRUCTIONS_DIR, id)
    );

    for (const versionFile of versions) {
      const filePath = path.join(
        INSTRUCTIONS_DIR,
        id,
        versionFile
      );

      const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      result.push({
        id: json.id,
        version: json.version,
        title: json.ui?.title,
        description: json.ui?.description,
        keywords: json.keywords ?? []
      });
    }
  }

  res.json(result);
});

/**
 * GET /instructions/:id
 * Get latest version of an instruction
 */
app.get("/instructions/:id", (req, res) => {
  const { id } = req.params;
  const instructionDir = path.join(INSTRUCTIONS_DIR, id);

  if (!fs.existsSync(instructionDir)) {
    return res.status(404).json({ error: "Instruction not found" });
  }

  const versions = fs.readdirSync(instructionDir);

  // naive "latest" (can be improved with semver later)
  const latest = versions.sort().reverse()[0];

  const filePath = path.join(instructionDir, latest);
  const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  res.json(json);
});

/**
 * GET /instructions/:id/:version
 * Get a specific version
 */
app.get("/instructions/:id/:version", (req, res) => {
  const { id, version } = req.params;

  const filePath = path.join(
    INSTRUCTIONS_DIR,
    id,
    `${version}.json`
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Instruction version not found" });
  }

  const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  res.json(json);
});

app.listen(PORT, () => {
  console.log(`Instruction registry running on http://localhost:${PORT}`);
});