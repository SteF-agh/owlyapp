import React, { useState, useEffect, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppHeader from '@/components/app-header';
import Mascot from '@/components/mascot';
import ChatInterface from '@/components/chat-interface';
import VoiceRecordingModal from '@/components/voice-recording-modal';
import SettingsModal from '@/components/settings-modal';
import { SettingsContext } from '../App';

const Home: React.FC = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { updateSettings } = useContext(SettingsContext);
  
  // Fetch settings from API
  const { data: settingsData } = useQuery({
    queryKey: ['/api/settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Update settings in context when received from API
      updateSettings({
        textToSpeechEnabled: data.textToSpeechEnabled,
        speechRate: data.speechRate,
        difficultyLevel: data.difficultyLevel,
      });
    }
  });

  // Handle voice recording completion
  const handleVoiceRecordingComplete = (transcript?: string) => {
    setIsVoiceModalOpen(false);
    
    if (transcript) {
      // Create a new message input event with the transcript
      const inputElement = document.getElementById('message-input') as HTMLTextAreaElement;
      if (inputElement) {
        // Set the value
        inputElement.value = transcript;
        
        // Trigger input event to update React state
        const event = new Event('input', { bubbles: true });
        inputElement.dispatchEvent(event);
        
        // Focus the input
        inputElement.focus();
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header component */}
      <AppHeader />
      
      {/* Mascot introduction */}
      <Mascot />
      
      {/* Chat interface */}
      <ChatInterface 
        onSpeakClick={() => setIsVoiceModalOpen(true)}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
      />
      
      {/* Voice recording modal */}
      <VoiceRecordingModal 
        isOpen={isVoiceModalOpen}
        onClose={handleVoiceRecordingComplete}
      />
      
      {/* Settings modal */}
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};

export default Home;
