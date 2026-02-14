# Project Feature Assistant

This project provides a feature-aware AI assistant that can answer questions about your software features in a controlled and structured way. It leverages Ollama (LLaMA-based models) to reason over structured feature descriptions (feature.json) and generate responses while adhering to system rules. The assistant supports multi-project reasoning, multilingual responses, and cross-feature suggestions.

## Features

Feature-aware Q&A: Answers questions based only on defined feature descriptions.
Cross-project reasoning: Supports combining features across projects (e.g., integrating a Recipe Manager with a Birthday Card).
Multilingual responses: Can respond in English, German, Hungarian, or other languages based on system instructions.
Dynamic system rules: Load rules.txt to define assistant boundaries and behavior.
Feature compatibility hints: compatibleWith and tags allow the assistant to suggest connected features.


## Usage 
```
import { callOllama } from './ollama';
import { loadRelevantJson, getSystemRules } from './feature-loader';

const projectId = 'your-project-id';
const features = loadRelevantJson(projectId);
const systemRules = getSystemRules();

const query = "Your awesome question";
const aiAnswer = await callOllama(query, features, systemRules);

// consume answer

```

Query: The question you want to ask the assistant.
Features: Structured JSON describing available features.
System Rules: Instructions for AI behavior, e.g., language, boundaries, polite rejection of unrelated queries.

## Multi-Project & Cross-Feature Usage

To enable reasoning across multiple projects, include features from multiple projectIds:

```
const selectedProjects = ["ui-widgets", "conference"];
const features = loadAllFeatures().filter(f => selectedProjects.includes(f.projectId));
```
For compatible features, you can dynamically include features referenced in compatibleWith:
```
const compatibleFeatures = loadAllFeatures().filter(f =>
  features.some(feature => feature.compatibleWith?.includes(f.name))
);
const aiFeatures = [...features, ...compatibleFeatures];
```


## Multilingual Support

The assistant can answer in multiple languages.
To force a specific language, include it in the system rules:

```
Always respond in German, regardless of the user’s query language.
```

## Feature (json) Structure
Each feature is described in a structured JSON format. Example:
```
{
  "id": "feature identifier",
  "projectId": "project identifier",
  "name": "Feature name",
  "purpose": "The purpose of the feature",
  "capabilities": [
    "Feature capability explanations"
  ],
  "interactions": [
    "Uses the defined API to fetch details",
    "Integrates with Feature 6"
  ],
  "userRoles": ["Logged in users"]
  "entryPoints": ["project/src/app/feature/public-api.ts"]
  "status": "stable",
  "notes": "This is an example additional note",
  "relatedFeatures": ["feature 5", "feature 6"],
  "compatibleWith": ["feature 2"]
  "tags": ["feature 1", "feature 2", "feature 3"]
}

```

### Comments explained:

| Field             | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `id`              | Unique feature identifier.                                  |
| `projectId`       | Project or module the feature belongs to.                   |
| `name`            | Human-readable name.                                        |
| `purpose`         | What the feature does and why it exists.                    |
| `capabilities`    | List of actions or functions the feature supports.          |
| `interactions`    | Dependencies, APIs, or other features it interacts with.    |
| `userRoles`       | Who can use or access this feature.                         |
| `entryPoints`     | Main code entry points or files.                            |
| `status`          | Feature stability: stable, experimental, WIP.               |
| `notes`           | Optional extra info or limitations.                         |
| `relatedFeatures` | Features that are relevant or connected.                    |
| `compatibleWith`  | Explicitly compatible features (cross-project suggestions). |
| `tags`            | Optional keywords to aid search or multi-feature reasoning. |


## System Rules (rules.txt)
The assistant behavior is controlled via a system rules file:
Example:
```
You are a technical documentation assistant:
- Only answer using the provided feature descriptions.
- If a question is unrelated, respond: "This is not part of my feature set knowledge. Ask about possible features: [list feature names]."
- Always maintain a professional and polite tone.
- Always respond in German, regardless of query language.
```
Can be dynamically loaded and injected per Ollama request.
Supports dash-prefixed lists for clarity.
Can include placeholders (like [list feature names]) dynamically replaced in Node.js.

## Extending the Assistant

Add new features by creating additional feature.json entries.
Add tags or compatibleWith fields to enable cross-feature reasoning.
Include multiple projects to allow multi-project Q&A.
Adjust rules.txt for language, tone, and other boundaries.