import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Dream interpretation model
export interface DreamInterpretation {
  id: string;
  summary: string;
  symbols: Array<{symbol: string; meaning: string}>;  // Changed from string to array of objects
  psychological: string;
  psychologicalAnalysis: string;  // Added to match usage in InterpreterPage
  emotional: string;
  emotionalInsights: string;  // Added to match usage in InterpreterPage
  advice: string;
  actionableAdvice: string;  // Added to match usage in InterpreterPage
  createdAt: string;
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
  description: string;
  date: string;
  mood: string;
  tags: string[];
  favorite: boolean;
  interpretation: string;
  visualization: string;
  visualizationUrl: string;
}

// Type for creating a new dream entry (some fields are optional)
export type NewDreamEntry = Omit<DreamEntry, 'id'> & {
  favorite?: boolean;
  interpretation?: string;
  visualization?: string;
  visualizationUrl?: string;
};

// Initialize dream entries from localStorage if available
const getInitialDreamEntries = (): DreamEntry[] => {
  try {
    const savedEntries = localStorage.getItem('dreamJournal');
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries) as DreamEntry[];
      console.log('Initialized dream journal from localStorage:', parsedEntries.length, 'entries');
      return parsedEntries;
    }
  } catch (error) {
    console.error('Error loading initial dream entries:', error);
  }
  return [];
};

// Context type definition
interface DreamContextType {
  // Dream Interpretation
  interpretation: DreamInterpretation | null;
  interpretationLoading: boolean;
  interpretationError: string | null;
  interpretDreamAsync: (dreamData: { description: string; date?: string; mood?: string[] }) => Promise<DreamInterpretation | null>;
  
  // Dream Visualization
  visualization: DreamVisualization | null;
  visualizationLoading: boolean;
  visualizationError: string | null;
  generateVisualizationAsync: (dreamId: string, style: string) => Promise<DreamVisualization | null>;
  
  // Dream Journal
  dreamJournal: DreamEntry[];
  journalLoading: boolean;
  journalError: string | null;
  fetchDreamJournal: () => Promise<void>;
  addDreamEntryAsync: (entry: NewDreamEntry) => Promise<DreamEntry | null>;
  updateDreamEntryAsync: (entry: DreamEntry) => Promise<DreamEntry | null>;
  deleteDreamEntryAsync: (id: number) => Promise<boolean>;
}

// Create the context
const DreamContext = createContext<DreamContextType | undefined>(undefined);

// Custom hook to use the dream context
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
  const [dreamJournal, setDreamJournal] = useState<DreamEntry[]>(getInitialDreamEntries());
  const [journalLoading, setJournalLoading] = useState<boolean>(false);
  const [journalError, setJournalError] = useState<string | null>(null);
  
  // Fetch dream journal entries
  const fetchDreamJournal = async () => {
    setJournalLoading(true);
    setJournalError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we're just using localStorage
      const savedEntries = localStorage.getItem('dreamJournal');
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries) as DreamEntry[];
        setDreamJournal(parsedEntries);
        console.log('Fetched dream journal:', parsedEntries.length, 'entries');
      }
    } catch (error) {
      console.error('Error fetching dream journal:', error);
      setJournalError('Failed to load your dream journal. Please try again.');
    } finally {
      setJournalLoading(false);
    }
  };
  
  // Load dream journal on mount
  useEffect(() => {
    fetchDreamJournal();
  }, []);
  
  // Dream Interpretation function - using backend API
  const interpretDreamAsync = async (dreamData: { description: string; date?: string; mood?: string[] }) => {
    setInterpretationLoading(true);
    setInterpretationError(null);
    
    try {
      console.log('Interpreting dream:', dreamData);
      
      // Call the backend API
      const response = await fetch('http://localhost:5000/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dreamText: dreamData.description
        }),
      });
      
      // Handle non-OK responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error: ${response.status} - ${errorText}`);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      // Parse the response
      const data = await response.json();
      console.log('Received interpretation from backend:', data);
      
      if (!data || !data.interpretation) {
        console.error('Invalid response from backend:', data);
        throw new Error('Invalid response from interpretation API');
      }
      
      // Parse the markdown response from the API
      const interpretation = data.interpretation;
      
      // Extract sections from the markdown
      const summaryMatch = interpretation.match(/## 1\. Overall Meaning\s+([\s\S]*?)(?=##|$)/);
      const symbolsMatch = interpretation.match(/## 2\. Key Symbols[\s\S]*?((?:-\s+\*\*.*?\*\*:[\s\S]*?)+)(?=##|$)/);
      const psychologicalMatch = interpretation.match(/## 3\. Psychological Insights\s+([\s\S]*?)(?=##|$)/);
      const emotionalMatch = interpretation.match(/## 4\. Emotional Themes\s+([\s\S]*?)(?=##|$)/);
      const adviceMatch = interpretation.match(/## 5\. Actionable Advice\s+([\s\S]*?)(?=##|$)/);
      
      // Extract symbols as structured data
      const symbolsText = symbolsMatch ? symbolsMatch[1] : '';
      const symbolsRegex = /-\s+\*\*([^*]+)\*\*:\s+([^\n]+)/g;
      const symbols = [];
      let match;
      
      while ((match = symbolsRegex.exec(symbolsText)) !== null) {
        symbols.push({
          symbol: match[1].trim(),
          meaning: match[2].trim()
        });
      }
      
      // Create a new interpretation object
      const newInterpretation: DreamInterpretation = {
        id: `interp-${Date.now()}`,
        summary: summaryMatch ? summaryMatch[1].trim() : 'No summary available',
        symbols: symbols.length > 0 ? symbols : [
          { symbol: 'Dream Symbol', meaning: 'No symbols analysis available' }
        ],
        psychological: psychologicalMatch ? psychologicalMatch[1].trim() : 'No psychological analysis available',
        psychologicalAnalysis: psychologicalMatch ? psychologicalMatch[1].trim() : 'No psychological analysis available',
        emotional: emotionalMatch ? emotionalMatch[1].trim() : 'No emotional insights available',
        emotionalInsights: emotionalMatch ? emotionalMatch[1].trim() : 'No emotional insights available',
        advice: adviceMatch ? adviceMatch[1].trim() : 'No advice available',
        actionableAdvice: adviceMatch ? adviceMatch[1].trim() : 'No advice available',
        createdAt: new Date().toISOString()
      };
      
      // Update state with the new interpretation
      setInterpretation(newInterpretation);
      return newInterpretation;
      
    } catch (error) {
      console.error('Dream interpretation error:', error);
      setInterpretationError('Failed to interpret your dream. Please try again.');
      return null;
    } finally {
      setInterpretationLoading(false);
    }
  };
  
  // Dream Visualization function - using Hugging Face API directly
  const generateVisualizationAsync = async (dreamId: string, style: string) => {
    setVisualizationLoading(true);
    setVisualizationError(null);
    
    try {
      // Find the dream by ID
      const dream = dreamJournal.find(d => d.id.toString() === dreamId);
      
      if (!dream) {
        throw new Error('Dream not found');
      }
      
      console.log(`Generating visualization for dream:`, dream.title);
      
      // Call Hugging Face API directly
      const response = await fetch(
        'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            inputs: `A surreal digital artwork in ${style} style depicting: ${dream.description}` 
          }),
        }
      );
      
      // Handle non-OK responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error: ${response.status} - ${errorText}`);
        throw new Error(`Failed to generate image. Status: ${response.status}`);
      }
      
      // Get the image blob
      const blob = await response.blob();
      const imageObjectUrl = URL.createObjectURL(blob);
      
      // Create a new visualization object
      const newVisualization: DreamVisualization = {
        id: `vis-${Date.now()}`,
        title: `Dream Visualization (${style} style)`,
        description: `AI-generated visualization based on your dream about ${dream.title}`,
        imageUrl: imageObjectUrl,
        createdAt: new Date().toISOString()
      };
      
      // Update the dream entry with the visualization URL
      const updatedDream = {
        ...dream,
        visualizationUrl: newVisualization.imageUrl
      };
      
      // Update the dream in the journal
      await updateDreamEntryAsync(updatedDream);
      
      // Update state with the new visualization
      setVisualization(newVisualization);
      return newVisualization;
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to generate visualization';
      console.error('Dream visualization error:', error);
      setVisualizationError(errorMessage);
      return null;
    } finally {
      setVisualizationLoading(false);
    }
  };
  
  const addDreamEntryAsync = async (entry: NewDreamEntry) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a new dream entry with an ID
      const newEntry: DreamEntry = {
        ...entry,
        id: Date.now(),
        favorite: entry.favorite !== undefined ? entry.favorite : false,
        visualizationUrl: entry.visualizationUrl || '',
        tags: entry.tags || [],
        interpretation: entry.interpretation || '',
        visualization: entry.visualization || '',
        mood: entry.mood || ''
      };
      
      // Update state and localStorage
      const updatedJournal = [newEntry, ...dreamJournal];
      setDreamJournal(updatedJournal);
      localStorage.setItem('dreamJournal', JSON.stringify(updatedJournal));
      
      console.log('Added new dream entry:', newEntry.title);
      return newEntry;
    } catch (error) {
      console.error('Error adding dream entry:', error);
      return null;
    }
  };
  
  const updateDreamEntryAsync = async (entry: DreamEntry) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Find and update the entry
      const updatedJournal = dreamJournal.map(item => 
        item.id === entry.id ? entry : item
      );
      
      // Update state and localStorage
      setDreamJournal(updatedJournal);
      localStorage.setItem('dreamJournal', JSON.stringify(updatedJournal));
      
      console.log('Updated dream entry:', entry.title);
      return entry;
    } catch (error) {
      console.error('Error updating dream entry:', error);
      return null;
    }
  };
  
  const deleteDreamEntryAsync = async (id: number) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter out the entry to delete
      const updatedJournal = dreamJournal.filter(item => item.id !== id);
      
      // Update state and localStorage
      setDreamJournal(updatedJournal);
      localStorage.setItem('dreamJournal', JSON.stringify(updatedJournal));
      
      console.log('Deleted dream entry with ID:', id);
      return true;
    } catch (error) {
      console.error('Error deleting dream entry:', error);
      return false;
    }
  };
  
  // Context value
  const contextValue: DreamContextType = {
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
    deleteDreamEntryAsync
  };
  
  return (
    <DreamContext.Provider value={contextValue}>
      {children}
    </DreamContext.Provider>
  );
};
