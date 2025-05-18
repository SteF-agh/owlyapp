import React, { useState, useRef, useEffect, useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Message, sendMessage, getMessageHistory } from '@/lib/gemini';
import { formatMessageText } from '@/lib/message-formatter';
import { speakText } from '@/lib/speech';
import LearningTip from './learning-tip';
import { SettingsContext } from '../App';

interface ChatInterfaceProps {
  onSpeakClick: () => void;
  onSettingsClick: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSpeakClick, onSettingsClick }) => {
  const [messageInput, setMessageInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { settings } = useContext(SettingsContext);

  // Fetch message history
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/messages'],
    queryFn: async () => {
      return await getMessageHistory(6);
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return await sendMessage(content, settings.difficultyLevel);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    }
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() === '') return;

    sendMessageMutation.mutate(messageInput);
    setMessageInput('');
  };

  // Play text-to-speech for a message
  const handlePlayAudio = async (text: string) => {
    if (settings.textToSpeechEnabled) {
      try {
        // Extract only the English parts for speech
        const englishRegex = /<span class="en[^>]*>(.*?)<\/span>|<span class="font-medium">(.*?)<\/span>/g;
        let englishText = text.replace(englishRegex, '$1$2');

        // If no English text found, just use the original text
        if (englishText.trim() === '') {
          englishText = text;
        }

        // Remove HTML tags
        englishText = englishText.replace(/<[^>]*>/g, '');

        await speakText({
          text: englishText,
          rate: parseFloat(settings.speechRate),
          lang: 'en-US'
        });
      } catch (error) {
        console.error('Text-to-speech error:', error);
      }
    }
  };

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Learning tip content
  const tips = [
    {
      german: 'Versuche, einfache Fragen auf Englisch zu stellen. Zum Beispiel: "What is your name?" (Wie heißt du?)',
      english: 'Try asking simple questions in English. For example: "What is your name?"'
    },
    {
      german: 'Übe täglich für 10-15 Minuten, um dein Englisch zu verbessern.',
      english: 'Practice for 10-15 minutes daily to improve your English.'
    },
    {
      german: 'Wiederhole die Wörter laut, um deine Aussprache zu verbessern.',
      english: 'Repeat the words out loud to improve your pronunciation.'
    }
  ];

  // Select a random tip
  const randomTipIndex = Math.floor(Math.random() * tips.length);
  const currentTip = tips[randomTipIndex];

  return (
    <>
      {/* Topic suggestions */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <button 
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm transition-colors"
            onClick={() => setMessageInput("Ich möchte über Tennis sprechen / I want to talk about tennis")}
          >
            <div className="flex flex-col items-center">
              <span>🎾</span>
              <span className="text-gray-600">Tennis</span>
              <span className="text-primary font-medium">Tennis</span>
            </div>
          </button>
          <button 
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm transition-colors"
            onClick={() => setMessageInput("Lass uns über Minecraft reden / Let's talk about Minecraft")}
          >
            <div className="flex flex-col items-center">
              <span>🎮</span>
              <span className="text-gray-600">Minecraft</span>
              <span className="text-primary font-medium">Minecraft</span>
            </div>
          </button>
          <button 
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm transition-colors"
            onClick={() => setMessageInput("Wie ist das Wetter heute? / How is the weather today?")}
          >
            <div className="flex flex-col items-center">
              <span>☀️</span>
              <span className="text-gray-600">Wetter</span>
              <span className="text-primary font-medium">Weather</span>
            </div>
          </button>
          <button 
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm transition-colors"
            onClick={() => setMessageInput("Lass uns über Essen sprechen / Let's talk about food")}
          >
            <div className="flex flex-col items-center">
              <span>🍕</span>
              <span className="text-gray-600">Essen</span>
              <span className="text-primary font-medium">Food</span>
            </div>
          </button>
        </div>
      </div>

      {/* Chat messages container */}
      <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
        {messages.length === 0 ? (
          // Initial welcome message if no messages
          <div className="chat-bubble chat-bubble-assistant">
            <p className="mb-1">
              {messageInput.includes("Tennis") ? (
                <>
                  <span className="de block">Lass uns über Tennis sprechen! Spielst du gerne Tennis?</span>
                  <span className="en block font-medium">Let's talk about tennis! Do you like playing tennis?</span>
                </>
              ) : messageInput.includes("Minecraft") ? (
                <>
                  <span className="de block">Minecraft ist ein spannendes Spiel! Was baust du am liebsten?</span>
                  <span className="en block font-medium">Minecraft is an exciting game! What do you like to build?</span>
                </>
              ) : messageInput.includes("Wetter") ? (
                <>
                  <span className="de block">Das Wetter ist ein interessantes Thema! Wie ist es heute bei dir?</span>
                  <span className="en block font-medium">Weather is an interesting topic! How is it where you are today?</span>
                </>
              ) : messageInput.includes("Essen") ? (
                <>
                  <span className="de block">Lass uns über Essen sprechen! Was ist dein Lieblingsessen?</span>
                  <span className="en block font-medium">Let's talk about food! What's your favorite food?</span>
                </>
              ) : (
                <>
                  <span className="de block">Worüber möchtest du heute sprechen?</span>
                  <span className="en block font-medium">What would you like to talk about today?</span>
                </>
              )}
            </p>
            <p className="text-xs text-right text-gray-600">
              <button 
                className="text-primary underline"
                onClick={() => handlePlayAudio(messageInput ? "Let's talk about that!" : "What would you like to talk about today?")}
              >
                <span className="material-icons text-sm align-text-bottom">volume_up</span>
                <span className="de">Anhören</span> | <span className="en">Listen</span>
              </button>
            </p>
          </div>
        ) : (
          // Render all messages
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
            >
              {message.role === 'user' ? (
                <p>{message.content}</p>
              ) : (
                <>
                  <p className="mb-1">
                    {formatMessageText(message.content)}
                  </p>
                  <p className="text-xs text-right text-gray-600">
                    <button 
                      className="text-primary underline"
                      onClick={() => handlePlayAudio(message.content)}
                    >
                      <span className="material-icons text-sm align-text-bottom">volume_up</span>
                      <span className="de">Anhören</span> | <span className="en">Listen</span>
                    </button>
                  </p>
                </>
              )}
            </div>
          ))
        )}

        {/* Loading indicator */}
        {sendMessageMutation.isPending && (
          <div className="chat-bubble chat-bubble-assistant">
            <div className="flex space-x-2 justify-center items-center h-6">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Input section */}
      <div className="bg-white border-t border-gray-200 p-4">
        {/* Learning tip component */}
        <LearningTip germanTip={currentTip.german} englishTip={currentTip.english} />

        {/* Message input form */}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="relative mb-2">
            <textarea
              id="message-input"
              className="w-full border border-gray-300 rounded-2xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-900"
              placeholder="Deine Nachricht... | Your message..."
              rows={2}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              disabled={sendMessageMutation.isPending}
            ></textarea>
            <button 
              type="submit" 
              className="absolute bottom-2 right-2 bg-primary text-white rounded-full p-2"
              aria-label="Send message"
              disabled={sendMessageMutation.isPending || messageInput.trim() === ''}
            >
              <span className="material-icons">send</span>
            </button>
          </div>

          {/* Voice input controls */}
          <div className="flex justify-center space-x-4">
            {/* Voice input button */}
            <button 
              type="button" 
              className="flex flex-col items-center bg-white border border-gray-300 hover:bg-gray-50 rounded-2xl py-2 px-4"
              onClick={onSpeakClick}
            >
              <span className="material-icons text-secondary text-2xl">mic</span>
              <div className="flex flex-col items-center text-xs">
                <span className="text-gray-600">Sprechen</span>
                <span className="text-primary font-semibold">Speak</span>
              </div>
            </button>

            {/* Audio settings button */}
            <button 
              type="button" 
              className="flex flex-col items-center bg-white border border-gray-300 hover:bg-gray-50 rounded-2xl py-2 px-4"
              onClick={onSettingsClick}
            >
              <span className="material-icons text-secondary text-2xl">settings_voice</span>
              <div className="flex flex-col items-center text-xs">
                <span className="text-gray-600">Einstellungen</span>
                <span className="text-primary font-semibold">Settings</span>
              </div>
            </button>
          </div>
        </form>
      </div>

      {/* Progress indicators at the bottom */}
      <div className="bg-white border-t border-gray-200 p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="material-icons text-sm text-success mr-1">stars</span>
            <div className="flex flex-col items-center text-xs">
              <span className="text-gray-600">Fortschritt</span>
              <span className="text-primary font-semibold">Progress</span>
            </div>
          </div>

          <div className="bg-gray-100 h-2 flex-1 mx-3 rounded-full overflow-hidden">
            <div 
              className="bg-success h-full rounded-full" 
              style={{ width: `${Math.min(5 + messages.length * 5, 100)}%` }}
            ></div>
          </div>

          <div className="text-xs font-medium text-success">
            {Math.min(5 + messages.length * 5, 100)}%
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;