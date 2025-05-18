import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

// Create settings context
import { createContext } from "react";

export interface AppSettings {
  textToSpeechEnabled: boolean;
  speechRate: string;
  difficultyLevel: string;
}

export const SettingsContext = createContext<{
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}>({
  settings: {
    textToSpeechEnabled: true,
    speechRate: "1.0",
    difficultyLevel: "easy",
  },
  updateSettings: () => {},
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [settings, setSettings] = useState<AppSettings>({
    textToSpeechEnabled: true,
    speechRate: "1.0",
    difficultyLevel: "easy",
  });

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsContext.Provider value={{ settings, updateSettings }}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </SettingsContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
