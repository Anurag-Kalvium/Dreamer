const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config(); // Load your .env with GEMINI_API_KEY

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key available:', !!apiKey);

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log('Fetching available models...');
    const models = await genAI.listModels();
    console.log(`Found ${models.length} models:\n`);
    
    for (const model of models) {
      console.log(`Model: ${model.name}`);
      console.log(`  Description: ${model.description}`);
      console.log(`  Input Token Limit: ${model.inputTokenLimit}`);
      console.log(`  Output Token Limit: ${model.outputTokenLimit}`);
      console.log(`  Supported Methods: ${model.supportedGenerationMethods.join(", ")}`);
      console.log("\n");
    }
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();
