require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { findSymbolsInText } = require('./dreamSymbols');

const app = express();
const PORT = process.env.PORT || 5001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com', 'https://oneirvision.vercel.app'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'OneirVision Dream Interpretation API is running',
    version: '1.0.0'
  });
});

// Dream interpretation endpoint
app.post('/api/interpret', async (req, res) => {
  try {
    const { dream } = req.body;

    if (!dream) {
      return res.status(400).json({ error: 'Dream description is required' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
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

// Dream visualization endpoint using Hugging Face
app.post('/api/visualize', async (req, res) => {
  try {
    const { prompt, style = 'dreamlike' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!HUGGINGFACE_API_KEY) {
      return res.status(500).json({ error: 'Hugging Face API key not configured' });
    }

    // Create a descriptive prompt for dream visualization
    const enhancedPrompt = `A dreamlike visualization of: ${prompt}${style ? `, in the style of ${style}` : ''}. Highly detailed, 4k, photorealistic, surreal, ethereal, vibrant colors`;
    
    console.log('Generating visualization with prompt:', enhancedPrompt);
    
    // Call Hugging Face API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          inputs: enhancedPrompt,
          parameters: {
            num_inference_steps: 30,
            guidance_scale: 7.5,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API Error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Failed to generate visualization',
        details: errorText 
      });
    }

    // Get the image as buffer
    const imageBuffer = await response.buffer();
    
    // Convert to base64 for transmission
    const base64Image = imageBuffer.toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;
    
    console.log('Successfully generated visualization');
    
    // Prepare response
    const responseData = {
      success: true,
      imageUrl: imageDataUrl,
      prompt: enhancedPrompt,
      style,
      generatedAt: new Date().toISOString()
    };
    
    res.json(responseData);
  } catch (error) {
    console.error('Error in dream visualization:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OneirVision API Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Gemini API: ${GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🎨 Hugging Face API: ${HUGGINGFACE_API_KEY ? '✅ Configured' : '❌ Missing'}`);
});

module.exports = app;