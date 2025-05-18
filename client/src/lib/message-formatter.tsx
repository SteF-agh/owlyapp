import React from 'react';

// Function to format the text for display (handling bullets, etc.)
export function formatMessageText(text: string): JSX.Element {
  // Split the text by newlines and convert to React elements
  const lines = text.split("\n");
  
  return (
    <>
      {lines.map((line, index) => {
        // Check if the line is a bullet point
        if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
          return <li key={index}>{line.trim().substring(2)}</li>;
        }
        
        // Regular line with a line break
        return (
          <span key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}