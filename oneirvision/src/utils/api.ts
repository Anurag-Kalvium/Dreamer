// API utility functions for direct API calls

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

// Generate image using Hugging Face API directly (following their docs)
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    console.log('Generating image with prompt:', prompt);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `${prompt}, dreamlike, ethereal, surreal, vibrant colors, highly detailed, digital art`,
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
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    // Convert response to blob and create object URL
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    console.log('Successfully generated image');
    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image. Please try again later.');
  }
};

// Sequential dream visualization function
export const generateSequentialVisualization = async (dreamText: string): Promise<{
  prompts: { prompt1: string; prompt2: string };
  images: { image1: string; image2: string };
}> => {
  try {
    console.log('Starting sequential visualization for:', dreamText);

    // Step 1: Generate two sequential prompts using Gemini
    const promptGenerationRequest = `You are an AI image prompt generator.  
Given a dream description, split the dream into two logical parts:
- Part 1: The first half of the dream — the setup or beginning situation.
- Part 2: The second half — the action, climax, or what happens next.

For each part, write a visually descriptive prompt that includes:
- Important characters, emotions, setting, and objects.
- Clear environmental and emotional context for image generation.
- Artistic style: dreamlike, surreal, highly detailed, vibrant colors, fantasy art

Return the two prompts clearly labeled as "Prompt 1" and "Prompt 2".
Dream: "${dreamText}"`;

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
      throw new Error('Failed to generate image prompts');
    }

    const geminiData = await geminiResponse.json();
    const promptsText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    console.log('Generated prompts from Gemini:', promptsText);

    // Parse the two prompts
    const prompt1Match = promptsText.match(/Prompt 1[:\s]*([\s\S]*?)(?=Prompt 2|$)/i);
    const prompt2Match = promptsText.match(/Prompt 2[:\s]*([\s\S]*?)$/i);

    if (!prompt1Match || !prompt2Match) {
      throw new Error('Failed to parse image prompts from Gemini response');
    }

    const prompt1 = prompt1Match[1].trim();
    const prompt2 = prompt2Match[1].trim();

    console.log('Parsed Prompt 1:', prompt1);
    console.log('Parsed Prompt 2:', prompt2);

    // Step 2: Generate images using Hugging Face API directly
    console.log('Generating images...');
    const [image1, image2] = await Promise.all([
      generateImage(prompt1),
      generateImage(prompt2)
    ]);

    console.log('Successfully generated both sequential images');

    return {
      prompts: {
        prompt1: prompt1,
        prompt2: prompt2
      },
      images: {
        image1: image1,
        image2: image2
      }
    };
  } catch (error) {
    console.error('Error in sequential dream visualization:', error);
    throw new Error('Failed to generate sequential visualization. Please try again later.');
  }
};

// Parse dream interpretation from markdown format
export const parseDreamInterpretation = (markdownText: string) => {
  const sections = {
    overallMeaning: '',
    keySymbols: [] as Array<{ symbol: string; meaning: string }>,
    psychologicalInsights: '',
    emotionalThemes: '',
    actionableAdvice: ''
  };

  try {
    // Extract Overall Meaning
    const overallMatch = markdownText.match(/## 1\. Overall Meaning\s*([\s\S]*?)(?=## 2\.|$)/i);
    if (overallMatch) {
      sections.overallMeaning = overallMatch[1].trim();
    }

    // Extract Key Symbols
    const symbolsMatch = markdownText.match(/## 2\. Key Symbols\s*([\s\S]*?)(?=## 3\.|$)/i);
    if (symbolsMatch) {
      const symbolsText = symbolsMatch[1];
      const symbolLines = symbolsText.split('\n').filter(line => line.trim().startsWith('-'));
      
      sections.keySymbols = symbolLines.map(line => {
        const match = line.match(/- \*\*(.*?)\*\*:\s*(.*)/);
        if (match) {
          return { symbol: match[1], meaning: match[2] };
        }
        return { symbol: 'Unknown', meaning: line.replace(/^-\s*/, '') };
      });
    }

    // Extract Psychological Insights
    const psychMatch = markdownText.match(/## 3\. Psychological Insights\s*([\s\S]*?)(?=## 4\.|$)/i);
    if (psychMatch) {
      sections.psychologicalInsights = psychMatch[1].trim();
    }

    // Extract Emotional Themes
    const emotionalMatch = markdownText.match(/## 4\. Emotional Themes\s*([\s\S]*?)(?=## 5\.|$)/i);
    if (emotionalMatch) {
      sections.emotionalThemes = emotionalMatch[1].trim();
    }

    // Extract Actionable Advice
    const adviceMatch = markdownText.match(/## 5\. Actionable Advice\s*([\s\S]*?)$/i);
    if (adviceMatch) {
      sections.actionableAdvice = adviceMatch[1].trim();
    }

  } catch (error) {
    console.error('Error parsing dream interpretation:', error);
  }

  return sections;
};