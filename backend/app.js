import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import { callOllama } from './ollama-client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

function getAllFeatures() {
  const collectorPath = path.join(__dirname, './feature-docs');
  const files = fs.readdirSync(collectorPath);
  return files.map(file => {
    return JSON.parse(fs.readFileSync(path.join(collectorPath, file)));
  });
}

function getSystemRules() {
  const rulesPath = path.join(__dirname, 'rules.txt');
  const systemRules = fs.readFileSync(rulesPath, 'utf-8');
  return systemRules;
}

function loadRelevantJson(projectId) {
  const allFeatures = getAllFeatures();
  const targetFeatures = allFeatures.filter(feature => feature.projectId === projectId);
  const possibleCompatibleOtherFeatures = targetFeatures.flatMap(feature => feature.compatibleWith || []);
  const compatibleFeatures = allFeatures.filter(feature => possibleCompatibleOtherFeatures.includes(feature.name)) || [];
  return { targetFeatures, compatibleFeatures }
}

// API Layer
app.post('/api/search', async (request, response) => {
  const { query, projectId } = request.body;
  const { targetFeatures, compatibleFeatures } = loadRelevantJson(projectId);
  const systemRules = getSystemRules();
  const aiFeatures = [...targetFeatures, ...compatibleFeatures];
  const aiAnswer = await callOllama(query, aiFeatures, systemRules);
  return response.json(aiAnswer);
});

app.get('/api/projects', async(request, response) => {
  const allFeatures = getAllFeatures();
  const featuresProjectId = allFeatures.map(feature => feature.projectId);
  const uniqueProjectIds = [...new Set(featuresProjectId)];
  return response.json(uniqueProjectIds);
});

app.post('/api/features', async(request, response) => {
  const allFeatures = getAllFeatures();
  const { projectId } = request.body;
  const featureNames = allFeatures
    .filter(feature => feature.projectId === projectId)
    .map(feature => feature.name);
  return response.json(featureNames);
})

app.listen(3000, () => {
  console.log('backend running on port 3000');
});
