
import React from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';

interface LearningTipProps {
  germanTip: string;
  englishTip: string;
}

const LearningTip: React.FC<LearningTipProps> = ({ germanTip, englishTip }) => {
  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors">
        <span className="material-icons text-accent">lightbulb</span>
        <h3 className="font-nunito font-bold">
          <span className="text-gray-700">Lerntipp</span> | <span className="text-primary">Learning Tip</span>
        </h3>
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-accent/10 p-3 rounded-lg mt-2">
        <p className="text-xs text-gray-600">
          <span className="block">{germanTip}</span>
          <span className="block text-primary font-medium">{englishTip}</span>
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default LearningTip;
