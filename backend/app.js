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

function loadRelevantJson(query, projectId) {
  const allFeatures = getAllFeatures();
  return allFeatures.filter(feature => {
    const matchingFeatureInProject = feature.projectId === projectId;
    const matchingFeature = feature.keywords.some(keyword => {
      return query.toLowerCase().includes(keyword.toLowerCase());
    });
    return matchingFeatureInProject && matchingFeature;
  });
}

// API Layer
app.post('/api/search', async (request, response) => {
  const { query, projectId } = request.body;
  const features = loadRelevantJson(query, projectId);
  if (!features.length) {
    return response.json({
      text: `No documented features match ${query} for project ${projectId}`,
      entryPoints: []
    });
  }
  const aiAnswer = await callOllama(query, features);
  return response.json(aiAnswer);
});

app.get('/api/features', async(request, response) => {
  const allFeatures = getAllFeatures();
  return response.json(allFeatures);
});

app.listen(3000, () => {
  console.log('backend running on port 3000');
});
