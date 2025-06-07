import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDreamContext } from '../contexts/DreamContext';

// Define interfaces
interface DreamEntry {
  id: string | number;
  title?: string;
  description: string;
  date: string | Date;
  visualizationUrl?: string;
  favorite?: boolean;
}

interface DreamVisualization {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

const VisualizerPage: React.FC = () => {
  const { dreamJournal, updateDreamEntryAsync } = useDreamContext();
  
  // Store generated visualizations
  const [visualizations, setVisualizations] = useState<DreamVisualization[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDreamId, setSelectedDreamId] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>('');

  // Close modal when clicking outside the image
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isModalOpen && target.classList.contains('modal-overlay')) {
        closeModal();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  // Handle image generation
  const generateImage = async (): Promise<void> => {
    if (!prompt) {
      setStatus('❌ Please enter a prompt or select a dream');
      return;
    }

    setLoading(true);
    setStatus('Generating image...');

    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      ) as Response;

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const blob: Blob = await response.blob();
      const imageUrl: string = URL.createObjectURL(blob);
      
      const newVisualization: DreamVisualization = {
        id: Date.now().toString(),
        title: `Visualization: ${prompt.slice(0, 40)}${prompt.length > 40 ? '...' : ''}`,
        description: prompt,
        imageUrl,
        createdAt: new Date().toISOString()
      };

      setVisualizations((prev: DreamVisualization[]) => [newVisualization, ...prev]);
      setCurrentIndex(0);
      setStatus('✅ Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      setStatus('❌ Error generating image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Navigation between visualizations
  const nextVisualization = (): void => {
    setCurrentIndex((prevIndex: number) => (prevIndex + 1) % visualizations.length);
  };

  const prevVisualization = (): void => {
    setCurrentIndex((prevIndex: number) => 
      prevIndex === 0 ? visualizations.length - 1 : prevIndex - 1
    );
  };
  
  // Update prompt when dream is selected
  useEffect((): void => {
    if (selectedDreamId) {
      const selectedDream = dreamJournal.find((dream: DreamEntry) => 
        dream.id.toString() === selectedDreamId
      );
      if (selectedDream) {
        setPrompt(selectedDream.description);
      }
    }
  }, [selectedDreamId, dreamJournal]);

  // Handle saving to journal
  const handleSaveToJournal = (): void => {
    if (!selectedDreamId) {
      alert('Please select a dream from your journal first.');
      return;
    }
    
    const selectedDream = dreamJournal.find((dream: DreamEntry) => 
      dream.id.toString() === selectedDreamId
    ) as DreamEntry;
    
    if (selectedDream && visualizations[currentIndex]?.imageUrl) {
      const updatedDream: DreamEntry = {
        ...selectedDream,
        visualizationUrl: visualizations[currentIndex].imageUrl
      };
      
      updateDreamEntryAsync(updatedDream as any)
        .then((): void => {
          alert('Visualization saved to your dream journal!');
        })
        .catch((err: Error): void => {
          console.error('Error saving visualization:', err);
          alert('Failed to save visualization. Please try again.');
        });
    } else {
      alert('No visualization to save. Please generate an image first.');
    }
  };

  // Handle image click to open modal
  const handleImageClick = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vivid-blue to-teal-400 mb-4">
            Dream Visualizer
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Transform your dreams into stunning visual representations
          </p>
        </div>

        {/* Controls Section */}
        <div className="glassmorphism rounded-xl p-6 mb-8 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Dream Selection */}
            <div className="space-y-2">
              <label htmlFor="dream-select" className="block text-sm font-medium text-gray-300">
                Select a Dream
              </label>
              <select
                id="dream-select"
                value={selectedDreamId}
                onChange={(e) => setSelectedDreamId(e.target.value)}
                className="w-full px-4 py-3 bg-dark-bg/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-vivid-blue focus:border-transparent"
              >
                <option value="">Choose a dream...</option>
                {dreamJournal.map((dream: DreamEntry) => (
                  <option key={dream.id.toString()} value={dream.id.toString()}>
                    {dream.title || `Dream from ${new Date(dream.date).toLocaleDateString()}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
                Or enter a prompt
              </label>
              <input
                type="text"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="w-full px-4 py-3 bg-dark-bg/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-vivid-blue focus:border-transparent"
              />
            </div>

            {/* Generate Button */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={generateImage}
                disabled={loading || (!prompt && !selectedDreamId)}
                className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                  loading || (!prompt && !selectedDreamId)
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-vivid-blue to-teal-500 hover:from-vivid-blue/90 hover:to-teal-500/90'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Image'
                )}
              </button>
              {status && (
                <p className={`text-sm ${status.startsWith('❌') ? 'text-red-400' : 'text-green-400'}`}>
                  {status}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="glassmorphism rounded-2xl overflow-hidden border border-white/10">
          {visualizations.length > 0 ? (
            <div className="relative">
              {/* Main Image */}
              <div className="aspect-video bg-dark-bg/50 flex items-center justify-center">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-t-4 border-vivid-blue border-solid rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-300">Generating your visualization...</p>
                  </div>
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center cursor-zoom-in"
                    onClick={() => handleImageClick(visualizations[currentIndex].imageUrl)}
                  >
                    <img 
                      src={visualizations[currentIndex].imageUrl}
                      alt={visualizations[currentIndex].title}
                      className="max-w-full max-h-[70vh] object-contain p-4"
                      onError={(e) => {
                        console.error('Image failed to load');
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/800x600?text=Dream+Visualization`;
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Image Info */}
              <div className="p-6 bg-gradient-to-t from-dark-bg/90 to-transparent">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {visualizations[currentIndex].title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {visualizations[currentIndex].description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Navigation Buttons */}
                    {visualizations.length > 1 && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={prevVisualization}
                          className="p-2 bg-dark-bg/50 rounded-lg hover:bg-dark-bg/80 transition-colors"
                          aria-label="Previous visualization"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button 
                          onClick={nextVisualization}
                          className="p-2 bg-dark-bg/50 rounded-lg hover:bg-dark-bg/80 transition-colors"
                          aria-label="Next visualization"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                    
                    {/* Save to Journal Button */}
                    <button
                      onClick={handleSaveToJournal}
                      disabled={!selectedDreamId || !visualizations[currentIndex]?.imageUrl}
                      className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                        !selectedDreamId || !visualizations[currentIndex]?.imageUrl
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-vivid-blue hover:bg-vivid-blue/90'
                      }`}
                    >
                      Save to Journal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-6 p-6 bg-dark-bg/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-vivid-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Visualizations Yet</h3>
              <p className="text-gray-400 max-w-md">
                Select a dream from your journal or enter a custom prompt above to generate your first visualization.
              </p>
            </div>
          )}
        </div>

        {/* Status Message */}
        {status && !visualizations.length && (
          <div className="mt-6 p-4 rounded-lg text-center">
            <p className={`text-sm ${status.startsWith('❌') ? 'text-red-400' : 'text-green-400'}`}>
              {status}
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 modal-overlay">
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl max-h-[90vh] overflow-auto">
            <img 
              src={currentImage} 
              alt="Full size visualization" 
              className="max-w-full max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizerPage;
