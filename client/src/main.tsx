import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom styles for the chat bubbles and other app-specific styling
const styleElement = document.createElement("style");
styleElement.textContent = `
  .chat-bubble {
    position: relative;
    border-radius: 1.25rem;
    padding: 0.75rem 1rem;
    margin-bottom: 0.75rem;
    max-width: 85%;
  }
  .chat-bubble-user {
    background-color: #4A6FFF;
    color: white;
    border-bottom-right-radius: 0;
    margin-left: auto;
  }
  .chat-bubble-assistant {
    background-color: #F0F0F0;
    color: #333333;
    border-bottom-left-radius: 0;
    margin-right: auto;
  }
  
  body {
    background-color: #FAFAFA;
    font-family: 'Quicksand', sans-serif;
    color: #333333;
    overscroll-behavior: none;
  }
  
  /* Custom colors for the app */
  :root {
    --primary: 74 111 255; /* #4A6FFF */
    --secondary: 255 112 67; /* #FF7043 */
    --accent: 255 213 79; /* #FFD54F */
    --success: 102 187 106; /* #66BB6A */
    --background: 250 250 250; /* #FAFAFA */
    --foreground: 51 51 51; /* #333333 */
    --muted-foreground: 102 102 102; /* #666666 */
  }
  
  /* Font families */
  .font-nunito {
    font-family: 'Nunito', sans-serif;
  }
  
  .font-quicksand {
    font-family: 'Quicksand', sans-serif;
  }
`;

document.head.appendChild(styleElement);

createRoot(document.getElementById("root")!).render(<App />);
