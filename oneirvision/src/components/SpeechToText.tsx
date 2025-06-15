import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Pause } from 'lucide-react';

interface SpeechToTextProps {
  onTextUpdate: (text: string) => void;
  className?: string;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTextUpdate, className = '' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configure speech recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          onTextUpdate(transcript + finalTranscript);
        }
        setInterimTranscript(interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access to use speech-to-text.');
        }
        setIsRecording(false);
        setIsPaused(false);
      };

      recognitionRef.current.onend = () => {
        if (isRecording && !isPaused) {
          // Restart recognition if it stops unexpectedly
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTextUpdate, transcript, isRecording, isPaused]);

  const startRecording = () => {
    if (!isSupported || !recognitionRef.current) return;

    try {
      setIsRecording(true);
      setIsPaused(false);
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsRecording(false);
    }
  };

  const pauseRecording = () => {
    if (!recognitionRef.current) return;

    setIsPaused(true);
    recognitionRef.current.stop();
  };

  const resumeRecording = () => {
    if (!recognitionRef.current) return;

    setIsPaused(false);
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;

    setIsRecording(false);
    setIsPaused(false);
    recognitionRef.current.stop();
    
    // Final update with complete transcript
    if (transcript || interimTranscript) {
      onTextUpdate(transcript + interimTranscript);
    }
  };

  if (!isSupported) {
    return null; // Don't render if speech recognition is not supported
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Microphone Button */}
      <motion.button
        type="button"
        onClick={isRecording ? (isPaused ? resumeRecording : pauseRecording) : startRecording}
        className={`p-2 rounded-full transition-all duration-300 ${
          isRecording 
            ? isPaused 
              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={
          isRecording 
            ? isPaused 
              ? 'Resume recording' 
              : 'Pause recording'
            : 'Start voice recording'
        }
      >
        {isRecording ? (
          isPaused ? (
            <Play className="h-6 w-6" />
          ) : (
            <Pause className="h-6 w-6" />
          )
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </motion.button>

      {/* Stop Button (only show when recording) */}
      <AnimatePresence>
        {isRecording && (
          <motion.button
            type="button"
            onClick={stopRecording}
            className="p-2 rounded-full bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Stop recording"
          >
            <Square className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <motion.div
              className={`w-2 h-2 rounded-full ${
                isPaused ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              animate={isPaused ? {} : { opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-sm text-gray-400">
              {isPaused ? 'Paused' : 'Recording...'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Transcript Preview */}
      <AnimatePresence>
        {(isRecording && interimTranscript) && (
          <motion.div
            className="absolute top-full left-0 mt-2 p-3 bg-gray-800/90 backdrop-blur-sm border border-white/10 rounded-lg max-w-md z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-sm text-gray-300">
              <span className="text-gray-500">Live: </span>
              {interimTranscript}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpeechToText;