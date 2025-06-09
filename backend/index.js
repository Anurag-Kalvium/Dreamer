require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { findSymbolsInText } = require('./dreamSymbols');

const app = express();
const PORT = process.env.PORT || 5001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Dream Interpretation API is running' });
});

// Dream interpretation endpoint
app.post('/api/interpret', async (req, res) => {
  try {
    const { dream } = req.body;

    if (!dream) {
      return res.status(400).json({ error: 'Dream description is required' });
    }

    const prompt = `For the following dream, provide:
    1. A brief (2-3 sentences) overall interpretation
    2. 3-5 key symbols from the dream with their meanings (format as "symbol: meaning" on separate lines)
    3. Emotional insights (1-2 sentences)
    4. Actionable advice (1-2 sentences)

    Dream: ${dream}

    Format your response exactly like this:
    INTERPRETATION: [your interpretation here]
    SYMBOLS: [symbol1] | [meaning1]\n[symbol2] | [meaning2]\n[...]
    EMOTIONS: [emotional insights here]
    ADVICE: [actionable advice here]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to interpret dream',
        details: errorData 
      });
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse the structured response
    const interpretationMatch = responseText.match(/INTERPRETATION:([\s\S]*?)(?=EMOTIONS:|$)/i);
    const emotionsMatch = responseText.match(/EMOTIONS:([\s\S]*?)(?=ADVICE:|$)/i);
    const adviceMatch = responseText.match(/ADVICE:([\s\S]*?)$/i);
    
    // Find symbols in the dream text
    const symbols = findSymbolsInText(dream);
    
    // If no symbols found, add some common ones based on the interpretation
    if (symbols.length === 0) {
      const commonSymbols = [
        { symbol: 'Dream', meaning: 'Your subconscious mind is processing daily experiences' },
        { symbol: 'Emotions', meaning: 'Your feelings are seeking attention and understanding' },
        { symbol: 'Thoughts', meaning: 'Your mind is working through complex ideas' }
      ];
      symbols.push(...commonSymbols);
    }

    // Prepare response
    const responseData = {
      success: true,
      interpretation: interpretationMatch ? interpretationMatch[1].trim() : 'No interpretation available',
      symbols: symbols.slice(0, 5), // Limit to top 5 symbols
      emotions: emotionsMatch ? emotionsMatch[1].trim() : 'Emotional insights not available',
      advice: adviceMatch ? adviceMatch[1].trim() : 'No specific advice available'
    };
    
    console.log('Sending response:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Error in dream interpretation:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
