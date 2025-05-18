import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../App';
import { apiRequest } from '@/lib/queryClient';
import DualLabel from './dual-label';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useContext(SettingsContext);
  
  // Local state for the form
  const [localSettings, setLocalSettings] = useState({
    textToSpeechEnabled: settings.textToSpeechEnabled,
    speechRate: settings.speechRate,
    difficultyLevel: settings.difficultyLevel,
  });

  // Update local settings when context settings change
  useEffect(() => {
    setLocalSettings({
      textToSpeechEnabled: settings.textToSpeechEnabled,
      speechRate: settings.speechRate,
      difficultyLevel: settings.difficultyLevel,
    });
  }, [settings]);

  // Handle save settings
  const handleSaveSettings = async () => {
    try {
      // Update settings in API
      await apiRequest('POST', '/api/settings', localSettings);
      
      // Update settings in context
      updateSettings(localSettings);
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // Handle difficulty selection
  const handleDifficultySelect = (level: string) => {
    setLocalSettings({
      ...localSettings,
      difficultyLevel: level,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-xs">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-nunito font-bold text-lg text-primary">
            <span className="block text-gray-700">Einstellungen</span>
            <span className="block text-primary">Settings</span>
          </h3>
          <button className="text-gray-500" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">
            <span className="block text-gray-700">Spracheinstellungen</span>
            <span className="block text-primary">Voice Settings</span>
          </h4>
          
          <div className="border border-gray-200 rounded-xl p-3 mb-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-left text-sm">
                <span className="block text-gray-600">Sprachausgabe aktivieren</span>
                <span className="block text-primary font-medium">Enable text-to-speech</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localSettings.textToSpeechEnabled} 
                  className="sr-only peer"
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    textToSpeechEnabled: e.target.checked,
                  })}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-xl p-3">
            <div className="mb-2">
              <div className="text-left text-sm mb-1">
                <span className="block text-gray-600">Sprachgeschwindigkeit</span>
                <span className="block text-primary font-medium">Speech rate</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={localSettings.speechRate} 
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  speechRate: e.target.value,
                })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5x</span>
                <span>1.0x</span>
                <span>2.0x</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">
            <span className="block text-gray-700">Schwierigkeitsgrad</span>
            <span className="block text-primary">Difficulty Level</span>
          </h4>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button 
              className={`py-2 px-3 rounded-xl text-sm font-medium ${
                localSettings.difficultyLevel === 'easy' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleDifficultySelect('easy')}
            >
              <div className={`flex flex-col items-center text-xs ${
                localSettings.difficultyLevel === 'easy' ? 'text-white' : ''
              }`}>
                <span className={localSettings.difficultyLevel === 'easy' ? 'text-white/90' : 'text-gray-600'}>Leicht</span>
                <span className={localSettings.difficultyLevel === 'easy' ? 'text-white' : 'text-primary font-semibold'}>Easy</span>
              </div>
            </button>
            <button 
              className={`py-2 px-3 rounded-xl text-sm font-medium ${
                localSettings.difficultyLevel === 'medium' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleDifficultySelect('medium')}
            >
              <div className={`flex flex-col items-center text-xs ${
                localSettings.difficultyLevel === 'medium' ? 'text-white' : ''
              }`}>
                <span className={localSettings.difficultyLevel === 'medium' ? 'text-white/90' : 'text-gray-600'}>Mittel</span>
                <span className={localSettings.difficultyLevel === 'medium' ? 'text-white' : 'text-primary font-semibold'}>Medium</span>
              </div>
            </button>
            <button 
              className={`py-2 px-3 rounded-xl text-sm font-medium ${
                localSettings.difficultyLevel === 'hard' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleDifficultySelect('hard')}
            >
              <div className={`flex flex-col items-center text-xs ${
                localSettings.difficultyLevel === 'hard' ? 'text-white' : ''
              }`}>
                <span className={localSettings.difficultyLevel === 'hard' ? 'text-white/90' : 'text-gray-600'}>Schwer</span>
                <span className={localSettings.difficultyLevel === 'hard' ? 'text-white' : 'text-primary font-semibold'}>Hard</span>
              </div>
            </button>
          </div>
        </div>
        
        <button 
          className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-full font-medium"
          onClick={handleSaveSettings}
        >
          <div className="flex flex-col items-center text-white text-sm">
            <span className="text-white/90">Speichern</span>
            <span className="text-white">Save</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
