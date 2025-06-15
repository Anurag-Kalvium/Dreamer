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

// Sequential dream visualization endpoint
app.post('/api/visualize-sequential', async (req, res) => {
  try {
    const { dream } = req.body;

    if (!dream) {
      return res.status(400).json({ error: 'Dream description is required' });
    }

    if (!GEMINI_API_KEY || !HUGGINGFACE_API_KEY) {
      return res.status(500).json({ error: 'API keys not configured' });
    }

    console.log('Processing sequential dream visualization for:', dream);

    // Step 1: Generate two sequential prompts using Gemini - SHORTENED PROMPT
    const promptGenerationRequest = `Split this dream into 2 parts and create short image prompts:
Dream: "${dream}"

Return exactly:
Part 1: [short visual description]
Part 2: [short visual description]`;

    const geminiResponse = await fetch(
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
                  text: promptGenerationRequest,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Gemini API Error:', errorData);
      return res.status(geminiResponse.status).json({ 
        error: 'Failed to generate image prompts',
        details: errorData 
      });
    }

    const geminiData = await geminiResponse.json();
    const promptsText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    console.log('Generated prompts from Gemini:', promptsText);

    // Parse the two prompts - simplified parsing
    const part1Match = promptsText.match(/Part 1[:\s]*(.*?)(?=Part 2|$)/i);
    const part2Match = promptsText.match(/Part 2[:\s]*(.*?)$/i);

    if (!part1Match || !part2Match) {
      return res.status(500).json({ 
        error: 'Failed to parse image prompts from Gemini response',
        details: promptsText 
      });
    }

    // Shorten prompts to avoid Hugging Face errors
    const prompt1 = part1Match[1].trim().substring(0, 100); // Limit to 100 chars
    const prompt2 = part2Match[1].trim().substring(0, 100); // Limit to 100 chars

    console.log('Shortened Prompt 1:', prompt1);
    console.log('Shortened Prompt 2:', prompt2);

    // Step 2: Generate images using Hugging Face - IMPROVED ERROR HANDLING
    const generateImage = async (prompt, partNumber) => {
      console.log(`Generating image ${partNumber} with prompt:`, prompt);
      
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            inputs: prompt // Use "inputs" not "prompt"
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Hugging Face API Error for image ${partNumber} (${response.status}):`, errorText);
        
        // Try to parse as JSON for better error details
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(`Hugging Face error ${response.status}: ${errorJson.error || errorText}`);
        } catch (parseError) {
          throw new Error(`Hugging Face error ${response.status}: ${errorText}`);
        }
      }

      // Check if the response is JSON (error) or binary (image)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        console.error(`Hugging Face API returned JSON error for image ${partNumber}:`, errorData);
        throw new Error(`Hugging Face API error for image ${partNumber}: ${errorData.error || 'Unknown error'}`);
      }

      // Fix: Use arrayBuffer() instead of buffer() for node-fetch
      const imageArrayBuffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);
      const base64Image = imageBuffer.toString('base64');
      return `data:image/jpeg;base64,${base64Image}`;
    };

    // Generate both images concurrently
    const [image1, image2] = await Promise.all([
      generateImage(prompt1, 1),
      generateImage(prompt2, 2)
    ]);

    console.log('Successfully generated both sequential images');

    // Prepare response
    const responseData = {
      success: true,
      dream: dream,
      prompts: {
        prompt1: prompt1,
        prompt2: prompt2
      },
      images: {
        image1: image1,
        image2: image2
      },
      generatedAt: new Date().toISOString()
    };
    
    res.json(responseData);
  } catch (error) {
    console.error('Error in sequential dream visualization:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
});

// Original single dream visualization endpoint (keeping for backward compatibility)
app.post('/api/visualize', async (req, res) => {
  try {
    const { prompt, style = 'dreamlike' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!HUGGINGFACE_API_KEY) {
      return res.status(500).json({ error: 'Hugging Face API key not configured' });
    }

    // Create a SHORT descriptive prompt for dream visualization
    const shortPrompt = prompt.substring(0, 80); // Limit to 80 characters
    
    console.log('Generating visualization with short prompt:', shortPrompt);
    
    // Call Hugging Face API with improved error handling
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          inputs: shortPrompt // Use "inputs" not "prompt"
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Hugging Face API Error (${response.status}):`, errorText);
      
      // Try to parse as JSON for better error details
      try {
        const errorJson = JSON.parse(errorText);
        return res.status(response.status).json({ 
          error: 'Failed to generate visualization',
          details: errorJson.error || errorText 
        });
      } catch (parseError) {
        return res.status(response.status).json({ 
          error: 'Failed to generate visualization',
          details: errorText 
        });
      }
    }

    // Check if the response is JSON (error) or binary (image)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      console.error('Hugging Face API returned JSON error:', errorData);
      return res.status(500).json({ 
        error: 'Failed to generate visualization',
        details: errorData.error || 'Unknown error' 
      });
    }

    // Fix: Use arrayBuffer() instead of buffer() for node-fetch
    const imageArrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    
    // Convert to base64 for transmission
    const base64Image = imageBuffer.toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;
    
    console.log('Successfully generated visualization');
    
    // Prepare response
    const responseData = {
      success: true,
      imageUrl: imageDataUrl,
      prompt: shortPrompt,
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