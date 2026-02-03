"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QueryInputProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  size?: "default" | "large";
}

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function QueryInput({
  onSearch,
  isLoading = false,
  placeholder = "Ask anything about artillery operations, procedures, or equipment...",
  size = "default",
}: QueryInputProps) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        setSpeechSupported(true);
        const recognitionInstance = new SpeechRecognitionAPI();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "en-US";

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");

          setQuery(transcript);

          // If the result is final, we can optionally auto-search
          if (event.results[event.results.length - 1].isFinal) {
            // Keep the transcript in the input
          }
        };

        recognitionInstance.onerror = () => {
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        recognitionInstance.onstart = () => {
          setIsListening(true);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setQuery(""); // Clear previous query when starting new voice input
      recognition.start();
    }
  }, [recognition, isListening]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      if (isListening && recognition) {
        recognition.stop();
      }
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          "relative flex items-center rounded-lg border bg-card shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background",
          size === "large" ? "h-16" : "h-12",
          isListening && "ring-2 ring-red-500 ring-offset-2 ring-offset-background"
        )}
      >
        <div className="flex items-center pl-4">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <Search className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isListening ? "Listening... Speak now" : placeholder}
          disabled={isLoading}
          className={cn(
            "flex-1 bg-transparent px-4 text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            size === "large" ? "text-lg" : "text-sm",
            isListening && "placeholder:text-red-400"
          )}
        />
        <div className="flex items-center gap-2 pr-2">
          {speechSupported && (
            <Button
              type="button"
              variant={isListening ? "destructive" : "ghost"}
              size="icon"
              className={cn(
                "h-8 w-8 transition-all",
                isListening && "animate-pulse"
              )}
              disabled={isLoading}
              onClick={toggleListening}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={cn(size === "large" ? "h-10 px-6" : "h-8 px-4")}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      {/* Voice status indicator */}
      {isListening && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
          </span>
          Listening... Click the mic button or press Search when done
        </div>
      )}
    </form>
  );
}
