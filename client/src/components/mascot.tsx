import React from 'react';

interface MascotProps {
  welcomeMessage?: {
    german: string;
    english: string;
  };
}

const Mascot: React.FC<MascotProps> = ({ 
  welcomeMessage = {
    german: 'Ich bin Owly, dein Englisch-Lernbegleiter!',
    english: 'I\'m Owly, your English learning buddy!'
  }
}) => {
  return (
    <div className="bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center">
        {/* SVG Owl mascot */}
        <svg 
          width="64" 
          height="64" 
          viewBox="0 0 64 64" 
          className="w-16 h-16 rounded-full mr-3 border-2 border-accent"
        >
          <circle cx="32" cy="32" r="32" fill="#FFF7E0" />
          <circle cx="20" cy="26" r="8" fill="white" />
          <circle cx="44" cy="26" r="8" fill="white" />
          <circle cx="20" cy="26" r="4" fill="#333" />
          <circle cx="44" cy="26" r="4" fill="#333" />
          <circle cx="32" cy="38" r="14" fill="#E9B657" />
          <path d="M26 38 A6 5 0 0 0 38 38" stroke="#333" fill="none" strokeWidth="2" />
          <path d="M32 36 L32 30 L25 20 M32 30 L39 20" stroke="#333" fill="none" strokeWidth="2" />
          <path d="M10 14 Q16 8 22 14" stroke="#E9B657" fill="none" strokeWidth="4" />
          <path d="M42 14 Q48 8 54 14" stroke="#E9B657" fill="none" strokeWidth="4" />
          <path d="M26 52 L38 52" stroke="#E9B657" fill="none" strokeWidth="4" />
        </svg>
        
        <div>
          <h2 className="font-nunito font-bold text-lg text-primary">
            <span className="text-gray-700">Hallo!</span> 
            <span className="ml-1 text-primary">Hello!</span>
          </h2>
          <p className="text-sm text-gray-600">
            <span className="block">{welcomeMessage.german}</span>
            <span className="block text-primary font-medium">{welcomeMessage.english}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mascot;
