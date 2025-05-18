import React, { useState, useEffect } from 'react';
import { setupSpeechRecognition } from '@/lib/speech';
import DualLabel from './dual-label';

interface VoiceRecordingModalProps {
  isOpen: boolean;
  onClose: (transcript?: string) => void;
}

const VoiceRecordingModal: React.FC<VoiceRecordingModalProps> = ({ isOpen, onClose }) => {
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Setup speech recognition
  const speechRecognition = setupSpeechRecognition(
    (newTranscript) => setTranscript(newTranscript),
    (error) => setError(error)
  );

  // Start listening when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        speechRecognition.startListening('en-US');
        setIsListening(true);
        setError(null);
      } catch (err) {
        setError('Could not start speech recognition');
        console.error(err);
      }
    } else {
      speechRecognition.stopListening();
      setIsListening(false);
      setTranscript('');
    }

    return () => {
      speechRecognition.stopListening();
    };
  }, [isOpen]);

  // Handle close with transcript
  const handleDone = () => {
    speechRecognition.stopListening();
    onClose(transcript);
  };

  // Handle cancel
  const handleCancel = () => {
    speechRecognition.stopListening();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-xs">
        <div className="text-center mb-4">
          <h3 className="font-nunito font-bold text-lg text-primary">
            <span className="block text-gray-700">Sprachaufnahme</span>
            <span className="block text-primary">Voice Recording</span>
          </h3>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <div className={`w-16 h-16 rounded-full bg-primary flex items-center justify-center ${isListening ? 'animate-pulse' : ''}`}>
                  <span className="material-icons text-white text-3xl">mic</span>
                </div>
              </div>
            </div>
            {isListening && (
              <span className="absolute bottom-0 right-0 bg-red-500 w-4 h-4 rounded-full"></span>
            )}
          </div>
        </div>
        
        {error ? (
          <p className="text-center text-sm text-red-500 mb-6">
            {error}
          </p>
        ) : (
          <>
            <p className="text-center text-sm mb-3">
              <span className="block text-gray-600">Ich höre zu... Sprich klar und deutlich.</span>
              <span className="block text-primary font-medium">I'm listening... Speak clearly.</span>
            </p>
            
            {transcript && (
              <div className="bg-gray-100 p-3 rounded-xl mb-4 text-sm">
                <p className="font-medium">{transcript}</p>
              </div>
            )}
          </>
        )}
        
        <div className="flex justify-center space-x-4">
          <button 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-full flex items-center"
            onClick={handleCancel}
          >
            <span className="material-icons mr-1">close</span>
            <DualLabel 
              german="Abbrechen" 
              english="Cancel" 
              germanClassName="text-gray-600"
              englishClassName="text-gray-700"
            />
          </button>
          
          <button 
            className="bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-full flex items-center"
            onClick={handleDone}
          >
            <span className="material-icons mr-1">check</span>
            <DualLabel 
              german="Fertig" 
              english="Done" 
              germanClassName="text-white/90"
              englishClassName="text-white"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecordingModal;
