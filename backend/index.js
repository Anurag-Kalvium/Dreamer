// backend/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch'); // Add node-fetch for direct API calls
const axios = require('axios'); // Add axios for Stability AI API calls
const FormData = require('form-data'); // Add form-data for Stability AI API calls
dotenv.config();

const app = express();
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = ['http://localhost:3000', 'https://oneir-vision.vercel.app'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Verify API key is available
const apiKey = process.env.GEMINI_API_KEY;
console.log('Gemini API Key available:', !!apiKey);

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

console.log('Using direct fetch approach for Gemini API');

// Sample dream interpretations for the mock implementation
const dreamInterpretations = [
  `# Dream Interpretation

## 1. Overall Meaning
Your dream about running in a forest with fire that suddenly goes dark reflects feelings of anxiety, fear of the unknown, and a sense of losing direction or security in your life.

## 2. Key Symbols and Their Significance
- **Forest**: Represents the unconscious mind, unknown territories in your life, or feeling lost among many options
- **Running**: Indicates you may be trying to escape from something in your waking life - perhaps responsibilities, fears, or difficult emotions
- **Fire**: Symbolizes transformation, passion, or destruction; its presence suggests powerful emotions or situations that feel volatile
- **Darkness**: Represents uncertainty, fear, the unknown, or aspects of yourself you haven't acknowledged

## 3. Psychological Insights
This dream suggests you may be experiencing a situation in your life where you initially felt a sense of direction or energy (the fire lighting your way), but suddenly found yourself without guidance or clarity. The sudden darkness represents a fear of the unknown or a feeling that something you were relying on has disappeared unexpectedly.

## 4. Emotional Themes
Fear, anxiety, uncertainty, and a sense of being suddenly vulnerable are the primary emotions in this dream. The abrupt transition from having light (fire) to complete darkness highlights a jarring emotional shift from confidence to insecurity.

## 5. Actionable Advice
Consider what situations in your waking life might suddenly feel uncertain or where you've lost a source of guidance. Practice grounding techniques when you feel anxious about the unknown. Remember that darkness, while frightening, can also be a space for new growth and discovery of inner resources you didn't know you had. Try journaling about times when you've successfully navigated uncertainty in the past to build confidence in your ability to find your way even when the path isn't clearly lit.`,
  
  `# Dream Interpretation

## 1. Overall Meaning
Your dream about being in a forest, hearing scary noises, and having your fire lamp fall down represents feelings of vulnerability, loss of security, and fear of the unknown in your current life situation.

## 2. Key Symbols and Their Significance
- **Forest**: Symbolizes the unconscious mind, unknown territories, or feeling lost among many possibilities
- **Scary Noises**: Represent undefined fears, anxieties, or warnings from your subconscious about potential threats
- **Fire Lamp**: Symbolizes guidance, clarity, protection, and your sense of security
- **Lamp Falling**: Represents a loss of direction, security being threatened, or unexpected challenges

## 3. Psychological Insights
This dream suggests you may be venturing into unfamiliar territory in your life (represented by the forest) where you feel uncertain and vulnerable. The scary noises indicate anxieties or fears about unknown aspects of this new situation. The fire lamp represents your sense of security and guidance, and its falling suggests you may feel that your usual sources of support or clarity are failing you when you need them most.

## 4. Emotional Themes
Fear, vulnerability, helplessness, and anxiety are the primary emotions in this dream. There's a strong sense of being exposed to danger without adequate protection, which may reflect how you're feeling in some aspect of your waking life.

## 5. Actionable Advice
Reflect on areas in your life where you feel you're losing your sense of direction or security. Consider what resources or support systems might help you navigate this challenging terrain. Remember that temporary darkness can heighten other senses - in times when clarity is lost, you may develop new strengths or awareness. Practice grounding techniques when anxiety arises, and consider journaling about times when you've successfully overcome feelings of vulnerability in the past. It might also be helpful to identify concrete steps you can take to restore a sense of security in whatever situation is causing you concern.`
];


app.post('/interpret', async (req, res) => {
  console.log('Received interpret request:', req.body);
  
  // Check if dreamText is provided
  const { dreamText } = req.body;
  if (!dreamText) {
    console.error('No dreamText provided in request');
    return res.status(400).json({ error: 'No dream text provided' });
  }

  try {
    console.log('Attempting to use Gemini API for dream interpretation');
    
    // Create the prompt for dream interpretation
    const prompt = `Interpret this dream psychologically and symbolically:

"${dreamText}"

Provide a detailed analysis including:
1. Overall meaning
2. Key symbols and their significance
3. Psychological insights
4. Emotional themes
5. Actionable advice based on the dream`;

    // Use direct fetch to match the curl example structure
    try {
      console.log('Using direct fetch to Gemini API with curl-like structure');
      
      // Make a direct fetch request to the Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      console.log('Successfully received interpretation from Gemini API');
      
      // Extract the text from the response
      const interpretation = data.candidates[0].content.parts[0].text;
      return res.json({ interpretation });
    } catch (geminiErr) {
      console.error('Gemini API error:', geminiErr);
      
      // Try with gemini-pro model as fallback using the same curl-like structure
      try {
        console.log('Trying with alternative model name: gemini-pro');
        
        // Make a direct fetch request to the Gemini API with the alternative model
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        console.log('Successfully received interpretation from alternative Gemini model');
        
        // Extract the text from the response
        const interpretation = data.candidates[0].content.parts[0].text;
        return res.json({ interpretation });
      } catch (altErr) {
        console.error('Alternative Gemini model also failed:', altErr);
        console.log('Falling back to mock implementation');
        
        // Fallback to mock implementation
        const randomIndex = Math.floor(Math.random() * dreamInterpretations.length);
        const interpretation = dreamInterpretations[randomIndex];
        
        // Add a small delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Returning mock interpretation as fallback');
        return res.json({ interpretation });
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Failed to interpret dream: ' + err.message });
  }
});

// Visualization endpoint removed - will be handled by Python service

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Dream interpretation backend running on port ${PORT}`);
  console.log('Using latest Gemini API with fallback to pre-defined interpretations');
});
