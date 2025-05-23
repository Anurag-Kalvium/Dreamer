import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Dream interpretation model
export interface DreamInterpretation {
  id: string;
  summary: string;
  symbols: { symbol: string; meaning: string }[];
  psychologicalAnalysis: string;
  emotionalInsights: string;
  actionableAdvice: string;
}

// Dream visualization model
export interface DreamVisualization {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

// Dream entry model
export interface DreamEntry {
  id: number;
  title: string;
  date: string;
  description: string;
  tags: string[];
  interpretation?: string;
  mood?: string;
  visualization?: string;
  visualizationUrl?: string;
  favorite?: boolean;
}

// Sample dream interpretations
const sampleInterpretations: DreamInterpretation[] = [
  {
    id: 'interp-1',
    summary: 'Your dream reflects a desire for freedom and exploration of your subconscious mind.',
    symbols: [
      { symbol: 'Flying', meaning: 'Represents freedom, transcendence, or escape from limitations.' },
      { symbol: 'Mountains', meaning: 'Symbolize challenges, obstacles, or higher perspective.' }
    ],
    psychologicalAnalysis: 'This dream suggests you may be seeking to rise above current challenges in your life and gain a broader perspective.',
    emotionalInsights: 'The feelings of weightlessness and freedom indicate a desire to break free from constraints or responsibilities.',
    actionableAdvice: 'Consider areas in your life where you feel restricted and explore ways to introduce more freedom and flexibility.'
  },
  {
    id: 'interp-2',
    summary: 'Your dream suggests exploration of the unknown parts of yourself and your emotions.',
    symbols: [
      { symbol: 'Water', meaning: 'Represents emotions, the unconscious mind, or life transitions.' },
      { symbol: 'Ancient city', meaning: 'Symbolizes hidden knowledge, forgotten aspects of yourself, or ancestral wisdom.' }
    ],
    psychologicalAnalysis: 'This dream indicates you may be exploring deeper layers of your psyche or emotions that have been previously unknown to you.',
    emotionalInsights: 'Your curiosity in the dream suggests an openness to discovering new aspects of yourself.',
    actionableAdvice: 'Journal about what \'hidden treasures\' might exist in your subconscious that you\'d like to explore further.'
  }
];

// Sample visualizations with placeholder images
const sampleVisualizations: DreamVisualization[] = [
  {
    id: 'vis-1',
    title: 'Dream Visualization (Surreal style)',
    description: 'Visualization based on your dream description',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600',
    createdAt: new Date().toISOString()
  },
  {
    id: 'vis-2',
    title: 'Dream Visualization (Abstract style)',
    description: 'Visualization based on your dream description',
    imageUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600',
    createdAt: new Date().toISOString()
  }
];

// Sample dream entries
const sampleDreamEntries: DreamEntry[] = [
  {
    id: 1,
    title: 'Flying over mountains',
    date: '2025-05-15',
    description: 'I was flying over snow-capped mountains, feeling completely free and weightless.',
    tags: ['flying', 'freedom', 'nature'],
    mood: 'Peaceful',
    visualizationUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600',
    favorite: true
  },
  {
    id: 2,
    title: 'Underwater city exploration',
    date: '2025-05-10',
    description: 'Discovered an ancient city beneath the ocean, with buildings made of crystal and strange sea creatures as inhabitants.',
    tags: ['water', 'exploration', 'discovery'],
    mood: 'Curious',
    visualizationUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600',
    favorite: false
  }
];

interface DreamContextType {
  // Dream Interpretation
  interpretation: DreamInterpretation | null;
  interpretationLoading: boolean;
  interpretationError: string | null;
  interpretDreamAsync: (dreamData: { description: string; date?: string; mood?: string[] }) => Promise<void>;
  
  // Dream Visualization
  visualization: DreamVisualization | null;
  visualizationLoading: boolean;
  visualizationError: string | null;
  generateVisualizationAsync: (dreamId: number | string, style: string) => Promise<void>;
  
  // Dream Journal
  dreamJournal: DreamEntry[];
  journalLoading: boolean;
  journalError: string | null;
  fetchDreamJournal: () => Promise<void>;
  addDreamEntryAsync: (entry: Omit<DreamEntry, 'id'>) => Promise<DreamEntry>;
  updateDreamEntryAsync: (entry: DreamEntry) => Promise<DreamEntry>;
  deleteDreamEntryAsync: (id: number) => Promise<boolean>;
}

const DreamContext = createContext<DreamContextType | undefined>(undefined);

export const useDreamContext = () => {
  const context = useContext(DreamContext);
  if (context === undefined) {
    throw new Error('useDreamContext must be used within a DreamProvider');
  }
  return context;
};

interface DreamProviderProps {
  children: ReactNode;
}

// Helper function to parse Gemini's response into sections
const parseGeminiResponse = (text: string) => {
  const sections: {
    summary?: string;
    symbols?: string;
    psychological?: string;
    emotional?: string;
    advice?: string;
  } = {};
  
  // Try to extract sections based on numbered list or headers
  if (text.includes('1. Overall meaning') || text.includes('Overall meaning')) {
    const lines = text.split('\n');
    let currentSection: keyof typeof sections | '' = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.includes('Overall meaning') || (line.includes('1.') && line.toLowerCase().includes('meaning'))) {
        currentSection = 'summary';
        sections.summary = '';
      } else if (line.includes('Key symbols') || (line.includes('2.') && line.toLowerCase().includes('symbol'))) {
        currentSection = 'symbols';
        sections.symbols = '';
      } else if (line.includes('Psychological insights') || (line.includes('3.') && line.toLowerCase().includes('psychological'))) {
        currentSection = 'psychological';
        sections.psychological = '';
      } else if (line.includes('Emotional themes') || (line.includes('4.') && line.toLowerCase().includes('emotion'))) {
        currentSection = 'emotional';
        sections.emotional = '';
      } else if (line.includes('Actionable advice') || (line.includes('5.') && line.toLowerCase().includes('advice'))) {
        currentSection = 'advice';
        sections.advice = '';
      } else if (currentSection && line) {
        // Append content to the current section
        if (currentSection) {
          sections[currentSection] = (sections[currentSection] || '') + (sections[currentSection] ? '\n' : '') + line;
        }
      }
    }
  }
  
  return sections;
};

// Helper function to extract symbols from the Gemini response
const extractSymbols = (symbolText: string): { symbol: string; meaning: string }[] => {
  const symbols: { symbol: string; meaning: string }[] = [];
  
  // Try to extract symbols and their meanings
  try {
    // Look for patterns like 'Symbol: Meaning' or '- Symbol: Meaning'
    const symbolPattern = /[-•]?\s*([^:]+):\s*([^\n]+)/g;
    let match;
    
    while ((match = symbolPattern.exec(symbolText)) !== null) {
      const symbol = match[1].trim();
      const meaning = match[2].trim();
      
      if (symbol && meaning) {
        symbols.push({ symbol, meaning });
      }
    }
    
    // If no symbols were found using the pattern, create default ones
    if (symbols.length === 0) {
      // Extract potential symbols from the text
      const lines = symbolText.split('\n');
      for (let i = 0; i < Math.min(lines.length, 3); i++) {
        const line = lines[i].trim();
        if (line) {
          const parts = line.split(' - ');
          if (parts.length > 1) {
            symbols.push({ symbol: parts[0].trim(), meaning: parts[1].trim() });
          } else {
            // Just use the first few words as the symbol name
            const words = line.split(' ');
            if (words.length > 3) {
              symbols.push({ 
                symbol: words.slice(0, 2).join(' '), 
                meaning: words.slice(2).join(' ')
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error extracting symbols:', error);
  }
  
  // If still no symbols, create default ones
  if (symbols.length === 0) {
    symbols.push({ symbol: 'Dream Elements', meaning: 'Represent aspects of your subconscious mind' });
    symbols.push({ symbol: 'Dream Setting', meaning: 'Reflects your emotional state and current life situation' });
  }
  
  return symbols;
};

export const DreamProvider: React.FC<DreamProviderProps> = ({ children }) => {
  // Dream Interpretation state
  const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
  const [interpretationLoading, setInterpretationLoading] = useState<boolean>(false);
  const [interpretationError, setInterpretationError] = useState<string | null>(null);
  
  // Dream Visualization state
  const [visualization, setVisualization] = useState<DreamVisualization | null>(null);
  const [visualizationLoading, setVisualizationLoading] = useState<boolean>(false);
  const [visualizationError, setVisualizationError] = useState<string | null>(null);
  
  // Dream Journal state
  const [dreamJournal, setDreamJournal] = useState<DreamEntry[]>(sampleDreamEntries);
  const [journalLoading, setJournalLoading] = useState<boolean>(false);
  const [journalError, setJournalError] = useState<string | null>(null);
  
  // Fetch dream journal on component mount
  useEffect(() => {
    fetchDreamJournal();
  }, []);
  
  // Dream Interpretation function - using backend API
  const interpretDreamAsync = async (dreamData: { description: string; date?: string; mood?: string[] }) => {
    setInterpretationLoading(true);
    setInterpretationError(null);
    
    try {
      console.log('Sending dream interpretation request to backend:', dreamData.description);
      
      // Call the backend API
      const response = await fetch('http://localhost:5000/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dreamText: dreamData.description }),
      });
      
      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Server responded with status: ${response.status}`;
        console.error('Backend API error:', errorMessage);
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      // Parse the interpretation from the Gemini API response
      const aiInterpretation = data.interpretation;
      
      // Extract sections from the Gemini response
      // Attempt to parse the structured response from Gemini
      const sections = parseGeminiResponse(aiInterpretation);
      
      // Extract symbols from the response
      const symbols = extractSymbols(sections.symbols || aiInterpretation);
      
      const result: DreamInterpretation = {
        id: `interp-${Date.now()}`,
        summary: sections.summary || aiInterpretation.split('.')[0] + '.',  // First sentence as summary if no clear summary section
        symbols: symbols,
        psychologicalAnalysis: sections.psychological || aiInterpretation,
        emotionalInsights: sections.emotional || 'Reflect on the emotions present in your dream',
        actionableAdvice: sections.advice || 'Consider how the symbols in your dream relate to your waking life'
      };
      
      setInterpretation(result);
    } catch (error) {
      setInterpretationError('Failed to interpret dream. Please try again.');
      console.error('Dream interpretation error:', error);
    } finally {
      setInterpretationLoading(false);
    }
  };
  
  // Dream Visualization function - simplified without API calls
  const generateVisualizationAsync = async (dreamId: number | string, style: string) => {
    setVisualizationLoading(true);
    setVisualizationError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return a random sample visualization
      const randomIndex = Math.floor(Math.random() * sampleVisualizations.length);
      const result = {
        ...sampleVisualizations[randomIndex],
        id: `vis-${Date.now()}`,
        title: `Dream Visualization (${style} style)`
      };
      
      setVisualization(result);
    } catch (error) {
      setVisualizationError('Failed to generate visualization. Please try again.');
      console.error('Dream visualization error:', error);
    } finally {
      setVisualizationLoading(false);
    }
  };
  
  // Dream Journal functions - simplified without API calls or localStorage
  const fetchDreamJournal = async () => {
    setJournalLoading(true);
    setJournalError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // We're already using the sample data from state initialization
      // This is just to simulate the API call
    } catch (error) {
      setJournalError('Failed to fetch dream journal. Please try again.');
      console.error('Dream journal fetch error:', error);
    } finally {
      setJournalLoading(false);
    }
  };
  
  const addDreamEntryAsync = async (entry: Omit<DreamEntry, 'id'>) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newEntry: DreamEntry = {
        ...entry,
        id: Date.now(),
        favorite: false,
        visualizationUrl: entry.visualizationUrl || ''
      };
      
      setDreamJournal(prevJournal => [newEntry, ...prevJournal]);
      return newEntry;
    } catch (error) {
      console.error('Add dream entry error:', error);
      throw error;
    }
  };
  
  const updateDreamEntryAsync = async (entry: DreamEntry) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setDreamJournal(prevJournal => 
        prevJournal.map(item => item.id === entry.id ? entry : item)
      );
      
      return entry;
    } catch (error) {
      console.error('Update dream entry error:', error);
      throw error;
    }
  };
  
  const deleteDreamEntryAsync = async (id: number) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      setDreamJournal(prevJournal => prevJournal.filter(item => item.id !== id));
      return true;
    } catch (error) {
      console.error('Delete dream entry error:', error);
      throw error;
    }
  };
  
  const value = {
    // Dream Interpretation
    interpretation,
    interpretationLoading,
    interpretationError,
    interpretDreamAsync,
    
    // Dream Visualization
    visualization,
    visualizationLoading,
    visualizationError,
    generateVisualizationAsync,
    
    // Dream Journal
    dreamJournal,
    journalLoading,
    journalError,
    fetchDreamJournal,
    addDreamEntryAsync,
    updateDreamEntryAsync,
    deleteDreamEntryAsync,
  };
  
  return <DreamContext.Provider value={value}>{children}</DreamContext.Provider>;
};
