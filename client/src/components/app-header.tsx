import React from 'react';
import DualLabel from './dual-label';

const AppHeader: React.FC = () => {
  return (
    <header className="bg-primary text-white p-4 flex items-center justify-center shadow-md relative">
      <div className="absolute left-4">
        <DualLabel
          german="Menü"
          english="Menu"
          className="mb-1"
          germanClassName="text-white/80"
          englishClassName="text-white"
        />
        <button className="text-white" aria-label="Menu">
          <span className="material-icons">menu</span>
        </button>
      </div>
      
      <div className="text-center">
        <h1 className="font-nunito font-bold text-xl">OwlyApp</h1>
        <p className="text-xs font-quicksand">
          <span className="text-white/80">Englisch Lernen</span> • 
          <span className="text-white">Learn English</span>
        </p>
      </div>
      
      <div className="absolute right-4">
        <DualLabel
          german="Hilfe"
          english="Help"
          className="mb-1"
          germanClassName="text-white/80"
          englishClassName="text-white"
        />
        <button className="text-white" aria-label="Help">
          <span className="material-icons">help_outline</span>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
