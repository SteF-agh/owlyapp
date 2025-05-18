// Interface for the text-to-speech configuration
export interface TTSConfig {
  text: string;
  rate: number;
  lang: string;
}

// Function to speak text using the Web Speech API
export function speakText({ text, rate = 1.0, lang = 'en-US' }: TTSConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      console.error('Text-to-speech not supported in this browser');
      reject(new Error('Text-to-speech not supported'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set the utterance properties
    utterance.rate = rate;
    utterance.lang = lang;

    // Event handlers
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

    // Start speaking
    window.speechSynthesis.speak(utterance);
  });
}

// Interface to store the speech recognition state and methods
export interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: (language?: string) => void;
  stopListening: () => void;
  clearTranscript: () => void;
  error?: string;
}

// Function to set up speech recognition
export function setupSpeechRecognition(
  onResult: (transcript: string) => void,
  onError: (error: string) => void
): SpeechRecognitionHook {
  let recognition: SpeechRecognition | null = null;
  let isListening = false;
  let transcript = '';

  // Check if speech recognition is supported
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    // Use the appropriate constructor
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
  } else {
    onError('Speech recognition not supported in this browser');
  }

  const startListening = (language = 'en-US') => {
    if (!recognition) {
      onError('Speech recognition not supported');
      return;
    }

    try {
      transcript = '';
      recognition.lang = language;
      recognition.start();
      isListening = true;

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        transcript = event.results[current][0].transcript;
        onResult(transcript);
      };

      recognition.onerror = (event) => {
        onError(`Speech recognition error: ${event.error}`);
        isListening = false;
      };

      recognition.onend = () => {
        isListening = false;
      };
    } catch (error) {
      onError(`Failed to start speech recognition: ${error}`);
      isListening = false;
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      isListening = false;
    }
  };

  const clearTranscript = () => {
    transcript = '';
    onResult('');
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
  };
}
