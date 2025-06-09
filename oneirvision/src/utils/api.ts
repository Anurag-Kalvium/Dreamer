// API utility functions

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const HUGGINGFACE_API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY;

export const interpretDream = async (dreamText: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
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
                  text: `Analyze this dream and provide a detailed interpretation in markdown format with the following sections:
                    
## 1. Overall Meaning
[Provide a brief summary of the dream's overall meaning]

## 2. Key Symbols
- **Symbol 1**: [Meaning]
- **Symbol 2**: [Meaning]
- **Symbol 3**: [Meaning]

## 3. Psychological Insights
[Provide psychological analysis of the dream]

## 4. Emotional Themes
[Describe the emotional themes present in the dream]

## 5. Actionable Advice
[Provide practical advice based on the dream's interpretation]

Dream to analyze: ${dreamText}`
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No interpretation available.';
  } catch (error) {
    console.error('Error interpreting dream:', error);
    throw new Error('Failed to interpret dream. Please try again later.');
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          inputs: `${prompt}, dreamlike, ethereal, surreal, vibrant colors, highly detailed, digital art`,
          options: {
            wait_for_model: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hugging Face API error: ${response.status} - ${error}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image. Please try again later.');
  }
};
