// API utility functions for backend communication only

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