import React from 'react';

interface DualLabelProps {
  german: string;
  english: string;
  className?: string;
  germanClassName?: string;
  englishClassName?: string;
}

export const DualLabel: React.FC<DualLabelProps> = ({ 
  german, 
  english, 
  className = '', 
  germanClassName = '',
  englishClassName = ''
}) => {
  return (
    <div className={`flex flex-col items-center text-xs leading-tight ${className}`}>
      <span className={`text-gray-600 ${germanClassName}`}>{german}</span>
      <span className={`text-primary font-semibold ${englishClassName}`}>{english}</span>
    </div>
  );
};

export default DualLabel;
