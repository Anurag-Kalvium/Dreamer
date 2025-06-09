// Common dream symbols and their meanings
export const dreamSymbols = [
  // Animals
  { symbol: 'snake', meaning: 'Transformation, healing, or hidden threats' },
  { symbol: 'spider', meaning: 'Creativity, patience, or feeling trapped' },
  { symbol: 'dog', meaning: 'Loyalty, protection, or friendship' },
  { symbol: 'cat', meaning: 'Independence, mystery, or feminine energy' },
  { symbol: 'bird', meaning: 'Freedom, perspective, or spiritual messages' },
  { symbol: 'fish', meaning: 'Emotions, intuition, or abundance' },
  { symbol: 'spider', meaning: 'Creativity, patience, or feeling trapped' },
  { symbol: 'wolf', meaning: 'Instinct, intelligence, or freedom' },
  { symbol: 'bear', meaning: 'Strength, introspection, or healing' },
  { symbol: 'butterfly', meaning: 'Transformation, change, or rebirth' },
  
  // Nature
  { symbol: 'water', meaning: 'Emotions, subconscious, or purification' },
  { symbol: 'fire', meaning: 'Passion, destruction, or transformation' },
  { symbol: 'tree', meaning: 'Growth, strength, or family roots' },
  { symbol: 'mountain', meaning: 'Obstacles, goals, or achievement' },
  { symbol: 'ocean', meaning: 'Deep emotions, the unconscious mind' },
  { symbol: 'storm', meaning: 'Turmoil, emotional release, or change' },
  { symbol: 'rain', meaning: 'Renewal, cleansing, or sadness' },
  { symbol: 'sun', meaning: 'Vitality, energy, or enlightenment' },
  { symbol: 'moon', meaning: 'Intuition, the subconscious, or feminine energy' },
  { symbol: 'forest', meaning: 'The unknown, exploration, or the unconscious' },
  
  // Common Objects
  { symbol: 'house', meaning: 'The self, different aspects of personality' },
  { symbol: 'car', meaning: 'Direction in life or personal control' },
  { symbol: 'key', meaning: 'Solutions, opportunities, or hidden knowledge' },
  { symbol: 'door', meaning: 'Opportunities, transitions, or new beginnings' },
  { symbol: 'mirror', meaning: 'Self-reflection, truth, or self-image' },
  { symbol: 'money', meaning: 'Self-worth, value, or resources' },
  { symbol: 'phone', meaning: 'Communication, connection, or missed opportunities' },
  
  // Actions
  { symbol: 'flying', meaning: 'Freedom, escape, or ambition' },
  { symbol: 'falling', meaning: 'Loss of control, insecurity, or anxiety' },
  { symbol: 'running', meaning: 'Avoidance, pursuit, or desire to escape' },
  { symbol: 'fighting', meaning: 'Inner conflict, struggle, or resistance' },
  { symbol: 'chasing', meaning: 'Avoiding an issue or pursuing a goal' },
  
  // Body Parts
  { symbol: 'teeth', meaning: 'Anxiety, self-image, or communication' },
  { symbol: 'hair', meaning: 'Strength, virility, or personal power' },
  { symbol: 'eyes', meaning: 'Perception, awareness, or truth' },
  { symbol: 'hands', meaning: 'Action, capability, or personal power' },
  { symbol: 'feet', meaning: 'Stability, foundation, or life direction' },
  
  // Colors
  { symbol: 'red', meaning: 'Passion, anger, or energy' },
  { symbol: 'blue', meaning: 'Calm, peace, or communication' },
  { symbol: 'green', meaning: 'Growth, healing, or nature' },
  { symbol: 'black', meaning: 'Mystery, the unknown, or fear' },
  { symbol: 'white', meaning: 'Purity, new beginnings, or clarity' },
  { symbol: 'yellow', meaning: 'Happiness, intellect, or energy' },
  { symbol: 'purple', meaning: 'Spirituality, wisdom, or luxury' }
];

// Function to find symbols in dream text
export function findSymbolsInText(text) {
  if (!text) return [];
  
  const foundSymbols = [];
  const lowerText = text.toLowerCase();
  
  // Check for each symbol
  dreamSymbols.forEach(symbol => {
    if (lowerText.includes(symbol.symbol)) {
      foundSymbols.push({
        symbol: symbol.symbol.charAt(0).toUpperCase() + symbol.symbol.slice(1), // Capitalize first letter
        meaning: symbol.meaning
      });
    }
  });
  
  // Return unique symbols only
  return [...new Map(foundSymbols.map(item => [item.symbol, item])).values()];
}
