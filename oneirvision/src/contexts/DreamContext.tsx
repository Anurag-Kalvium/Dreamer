import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '../config';

// Dream interpretation model
export interface DreamInterpretation {
  id: string;
  summary: string;
  symbols: Array<{symbol: string; meaning: string}>;
  psychological: string;
  psychologicalAnalysis: string;
  emotional: string;
  emotionalInsights: string;
  advice: string;
  actionableAdvice: string;
  createdAt: string;
}

// Dream visualization model
export interface DreamVisualization {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  style?: string;
  createdAt: string;
}

// Sequential dream visualization model
export interface SequentialDreamVisualization {
  id: string;
  dream: string;
  prompts: {
    prompt1: string;
    prompt2: string;
  };
  images: {
    image1: string;
    image2: string;
  };
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

type NewDreamEntry = Omit<DreamEntry, 'id'> & {
  favorite?: boolean;
  interpretation?: string;
  visualization?: string;
  visualizationUrl?: string;
};

interface DreamContextType {
  // Interpretation
  interpretation: DreamInterpretation | null;
  interpretationLoading: boolean;
  interpretationError: string | null;
  interpretDreamAsync: (dreamData: { description: string; date?: string; mood?: string[] }) => Promise<DreamInterpretation | null>;
  
  // Visualization
  visualization: DreamVisualization | null;
  visualizationHistory: DreamVisualization[];
  visualizationLoading: boolean;
  visualizationError: string | null;
  generateVisualizationAsync: (dreamDescription: string, style?: string) => Promise<DreamVisualization | null>;
  downloadVisualization: (imageUrl: string, filename: string) => void;
  
  // Sequential Visualization
  sequentialVisualization: SequentialDreamVisualization | null;
  sequentialVisualizationLoading: boolean;
  sequentialVisualizationError: string | null;
  generateSequentialVisualizationAsync: (dreamDescription: string) => Promise<SequentialDreamVisualization | null>;
  
  // Journal
  dreamJournal: DreamEntry[];
  journalLoading: boolean;
  journalError: string | null;
  fetchDreamJournal: () => Promise<void>;
  addDreamEntryAsync: (entry: NewDreamEntry) => Promise<DreamEntry | null>;
  updateDreamEntryAsync: (entry: DreamEntry) => Promise<DreamEntry | null>;
  deleteDreamEntryAsync: (id: number) => Promise<boolean>;
  
  // Reset functions
  resetInterpretation: () => void;
  resetVisualization: () => void;
  resetSequentialVisualization: () => void;
}

const DreamContext = createContext<DreamContextType | undefined>(undefined);

export const useDreamContext = () => {
  const context = useContext(DreamContext);
  if (!context) {
    throw new Error('useDreamContext must be used within a DreamProvider');
  }
  return context;
};

interface DreamProviderProps {
  children: ReactNode;
}

export const DreamProvider: React.FC<DreamProviderProps> = ({ children }) => {
  // State for interpretation
  const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
  const [interpretationLoading, setInterpretationLoading] = useState(false);
  const [interpretationError, setInterpretationError] = useState<string | null>(null);

  // State for visualization
  const [visualization, setVisualization] = useState<DreamVisualization | null>(null);
  const [visualizationHistory, setVisualizationHistory] = useState<DreamVisualization[]>([]);
  const [visualizationLoading, setVisualizationLoading] = useState(false);
  const [visualizationError, setVisualizationError] = useState<string | null>(null);

  // State for sequential visualization
  const [sequentialVisualization, setSequentialVisualization] = useState<SequentialDreamVisualization | null>(null);
  const [sequentialVisualizationLoading, setSequentialVisualizationLoading] = useState(false);
  const [sequentialVisualizationError, setSequentialVisualizationError] = useState<string | null>(null);

  // State for journal
  const [dreamJournal, setDreamJournal] = useState<DreamEntry[]>([]);
  const [journalLoading, setJournalLoading] = useState(false);
  const [journalError, setJournalError] = useState<string | null>(null);

  // Load saved journal entries on mount
  useEffect(() => {
    fetchDreamJournal();
  }, []);

  // Reset functions
  const resetInterpretation = () => {
    setInterpretation(null);
    setInterpretationError(null);
  };

  const resetVisualization = () => {
    setVisualization(null);
    setVisualizationError(null);
  };

  const resetSequentialVisualization = () => {
    setSequentialVisualization(null);
    setSequentialVisualizationError(null);
  };

  // Dream interpretation function - uses your deployed backend
  const interpretDreamAsync = async (dreamData: { description: string; date?: string; mood?: string[] }) => {
    setInterpretationLoading(true);
    setInterpretationError(null);

    try {
      console.log('Interpreting dream:', dreamData);
      
      // Call your deployed backend API for dream interpretation
      const response = await fetch(`${API_BASE_URL}/api/interpret`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dream: dreamData.description
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to interpret dream';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, try to get the text response (likely HTML error page)
          try {
            const textResponse = await response.text();
            errorMessage = `Server error (${response.status}): ${textResponse.substring(0, 100)}...`;
          } catch (textError) {
            errorMessage = `Server error (${response.status}): Unable to parse error response`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Format the response to match our DreamInterpretation interface
      const interpretation: DreamInterpretation = {
        id: `int-${Date.now()}`,
        summary: data.interpretation || 'No interpretation available',
        symbols: Array.isArray(data.symbols) ? data.symbols : [],
        psychological: data.interpretation || 'No psychological analysis available',
        emotional: data.emotions || 'No emotional analysis available',
        advice: data.advice || 'No advice available',
        psychologicalAnalysis: data.interpretation || 'No detailed analysis available',
        emotionalInsights: data.emotions || 'No emotional insights available',
        actionableAdvice: data.advice || 'No specific advice available',
        createdAt: new Date().toISOString(),
      };
      
      console.log('Formatted interpretation:', interpretation);

      setInterpretation(interpretation);
      return interpretation;
    } catch (error) {
      console.error('Dream interpretation failed:', error instanceof Error ? error.message : 'Unknown error');
      setInterpretationError('Failed to interpret your dream. Please try again.');
      return null;
    } finally {
      setInterpretationLoading(false);
    }
  };

  // Generate visualization using backend API
  const generateVisualizationAsync = async (dreamDescription: string, style: string = 'dreamlike'): Promise<DreamVisualization | null> => {
    setVisualizationLoading(true);
    setVisualizationError(null);
    
    try {
      console.log('Generating visualization with description:', dreamDescription);
      
      // Call the backend API for image generation
      const response = await fetch(`${API_BASE_URL}/api/visualize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dream: dreamDescription,
          style: style
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to generate visualization';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, try to get the text response (likely HTML error page)
          try {
            const textResponse = await response.text();
            errorMessage = `Server error (${response.status}): ${textResponse.substring(0, 100)}...`;
          } catch (textError) {
            errorMessage = `Server error (${response.status}): Unable to parse error response`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Generate a unique ID for this visualization
      const visualizationId = `vis_${Date.now()}`;
      
      console.log('Successfully generated visualization');
      
      // Create the visualization object
      const newVisualization: DreamVisualization = {
        id: visualizationId,
        title: `Dream Visualization - ${new Date().toLocaleDateString()}`,
        description: dreamDescription,
        imageUrl: data.imageUrl,
        style,
        createdAt: new Date().toISOString(),
      };
      
      // Add to history (keep only last 10)
      setVisualizationHistory(prev => [newVisualization, ...prev].slice(0, 10));
      setVisualization(newVisualization);
      
      return newVisualization;
    } catch (error) {
      console.error('Error generating visualization:', error);
      setVisualizationError('Failed to generate visualization. Please try again.');
      return null;
    } finally {
      setVisualizationLoading(false);
    }
  };

  // Generate sequential visualization using backend API
  const generateSequentialVisualizationAsync = async (dreamDescription: string): Promise<SequentialDreamVisualization | null> => {
    setSequentialVisualizationLoading(true);
    setSequentialVisualizationError(null);
    
    try {
      console.log('Generating sequential visualization with description:', dreamDescription);
      
      // Call the backend API for sequential visualization
      const response = await fetch(`${API_BASE_URL}/api/sequential-visualize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dream: dreamDescription
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to generate sequential visualization';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, try to get the text response (likely HTML error page)
          try {
            const textResponse = await response.text();
            errorMessage = `Server error (${response.status}): ${textResponse.substring(0, 100)}...`;
          } catch (textError) {
            errorMessage = `Server error (${response.status}): Unable to parse error response`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Generate a unique ID for this sequential visualization
      const sequentialVisualizationId = `seq_vis_${Date.now()}`;
      
      console.log('Successfully generated sequential visualization');
      
      // Create the sequential visualization object
      const newSequentialVisualization: SequentialDreamVisualization = {
        id: sequentialVisualizationId,
        dream: dreamDescription,
        prompts: data.prompts,
        images: data.images,
        createdAt: new Date().toISOString(),
      };
      
      setSequentialVisualization(newSequentialVisualization);
      
      return newSequentialVisualization;
    } catch (error) {
      console.error('Error generating sequential visualization:', error);
      setSequentialVisualizationError('Failed to generate sequential visualization. Please try again.');
      return null;
    } finally {
      setSequentialVisualizationLoading(false);
    }
  };

  // Download visualization
  const downloadVisualization = (imageUrl: string, filename: string) => {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename || 'dream-visualization.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading visualization:', error);
    }
  };

  // Journal functions
  const fetchDreamJournal = async () => {
    setJournalLoading(true);
    setJournalError(null);

    try {
      const savedEntries = localStorage.getItem('dreamJournal');
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries) as DreamEntry[];
        setDreamJournal(parsedEntries);
      }
    } catch (error) {
      console.error('Error fetching dream journal:', error);
      setJournalError('Failed to load your dream journal.');
    } finally {
      setJournalLoading(false);
    }
  };

  const addDreamEntryAsync = async (entry: NewDreamEntry): Promise<DreamEntry | null> => {
    setJournalLoading(true);
    setJournalError(null);

    try {
      const newEntry: DreamEntry = {
        ...entry,
        id: Date.now(),
        favorite: entry.favorite || false,
        interpretation: entry.interpretation || '',
        visualization: entry.visualization || '',
        visualizationUrl: entry.visualizationUrl || '',
        mood: entry.mood || 'neutral',
        date: entry.date || new Date().toISOString(),
        tags: entry.tags || [],
      };

      const updatedJournal = [newEntry, ...dreamJournal];
      setDreamJournal(updatedJournal);
      localStorage.setItem('dreamJournal', JSON.stringify(updatedJournal));
      
      return newEntry;
    } catch (error) {
      console.error('Error adding dream entry:', error);
      setJournalError('Failed to add dream entry. Please try again.');
      return null;
    } finally {
      setJournalLoading(false);
    }
  };

  const updateDreamEntryAsync = async (entry: DreamEntry): Promise<DreamEntry | null> => {
    setJournalLoading(true);
    setJournalError(null);

    try {
      const updatedJournal = dreamJournal.map(item => 
        item.id === entry.id ? { ...entry } : item
      );
      
      setDreamJournal(updatedJournal);
      localStorage.setItem('dreamJournal', JSON.stringify(updatedJournal));
      return entry;
    } catch (error) {
      console.error('Error updating dream entry:', error);
      setJournalError('Failed to update dream entry. Please try again.');
      return null;
    } finally {
      setJournalLoading(false);
    }
  };

  const deleteDreamEntryAsync = async (id: number): Promise<boolean> => {
    setJournalLoading(true);
    setJournalError(null);

    try {
      const updatedJournal = dreamJournal.filter(entry => entry.id !== id);
      setDreamJournal(updatedJournal);
      localStorage.setItem('dreamJournal', JSON.stringify(updatedJournal));
      return true;
    } catch (error) {
      console.error('Error deleting dream entry:', error);
      setJournalError('Failed to delete dream entry. Please try again.');
      return false;
    } finally {
      setJournalLoading(false);
    }
  };

  // Context value
  const contextValue: DreamContextType = {
    // Interpretation
    interpretation,
    interpretationLoading,
    interpretationError,
    interpretDreamAsync,
    
    // Visualization
    visualization,
    visualizationHistory,
    visualizationLoading,
    visualizationError,
    generateVisualizationAsync,
    downloadVisualization,
    
    // Sequential Visualization
    sequentialVisualization,
    sequentialVisualizationLoading,
    sequentialVisualizationError,
    generateSequentialVisualizationAsync,
    
    // Journal
    dreamJournal,
    journalLoading,
    journalError,
    fetchDreamJournal,
    addDreamEntryAsync,
    updateDreamEntryAsync,
    deleteDreamEntryAsync,
    
    // Reset functions
    resetInterpretation,
    resetVisualization,
    resetSequentialVisualization,
  };

  return (
    <DreamContext.Provider value={contextValue}>
      {children}
    </DreamContext.Provider>
  );
};

export default DreamContext;