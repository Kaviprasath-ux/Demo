"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Loader2,
  BookOpen,
  Target,
  Shield,
  Plane,
  HelpCircle,
  Lightbulb,
  ChevronRight,
  User,
  Bot,
  RefreshCw,
} from "lucide-react";
import { Button } from "@military/ui";
import { useAI } from "@/lib/ai/use-ai";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  citations?: string[];
}

const suggestedTopics = [
  {
    icon: Target,
    title: "CAS Procedures",
    description: "Close Air Support coordination",
    query: "Explain the CAS procedures for helicopter operations",
  },
  {
    icon: Plane,
    title: "Fire Adjustment",
    description: "Aerial observation techniques",
    query: "How do I conduct fire adjustment from a helicopter?",
  },
  {
    icon: Shield,
    title: "Airspace Deconfliction",
    description: "Safe operations near artillery",
    query: "What are the airspace deconfliction procedures with artillery?",
  },
  {
    icon: BookOpen,
    title: "Helicopter Systems",
    description: "Platform capabilities",
    query: "What are the weapon systems on HAL Rudra?",
  },
];

const quickQuestions = [
  "What is Type 1 terminal control?",
  "Explain the 9-line CAS brief format",
  "How to coordinate with JTAC?",
  "What are Helina missile specs?",
  "Explain ROZ vs NFZ",
];

export default function CadetAIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { chat, isLoading } = useAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Build messages array for the chat API
      const chatMessages = [
        ...messages.map((m) => ({ role: m.role as "user" | "assistant" | "system", content: m.content })),
        { role: "user" as const, content: messageText },
      ];

      const response = await chat(chatMessages);

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Training Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Ask questions about aviation doctrine, procedures & systems
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleClearChat}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages or Welcome */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <WelcomeScreen onSelectTopic={(query) => handleSend(query)} />
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Bot className="w-5 h-5" />
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Quick Questions */}
        {messages.length > 0 && messages.length < 4 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.slice(0, 3).map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1 bg-muted hover:bg-muted-foreground/10 rounded-full text-xs transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border bg-card p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about CAS, fire adjustment, helicopter systems..."
              className="flex-1 px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI responses are based on training doctrine. Always verify with official sources.
          </p>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ onSelectTopic }: { onSelectTopic: (query: string) => void }) {
  return (
    <div className="py-8 space-y-8">
      {/* Welcome Message */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Welcome, Cadet!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          I'm your AI training assistant. Ask me anything about aviation doctrine,
          CAS procedures, helicopter systems, and air-ground coordination.
        </p>
      </div>

      {/* Suggested Topics */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">
          Popular Topics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestedTopics.map((topic) => (
            <button
              key={topic.title}
              onClick={() => onSelectTopic(topic.query)}
              className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors text-left"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <topic.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{topic.title}</h4>
                <p className="text-sm text-muted-foreground">{topic.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Quick Questions */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">
          Quick Questions
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => onSelectTopic(q)}
              className="px-4 py-2 bg-muted hover:bg-muted-foreground/10 rounded-full text-sm transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-muted rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div>
            <h4 className="font-medium mb-1">Tips for Better Answers</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be specific about the helicopter type or mission context</li>
              <li>• Ask follow-up questions for clarification</li>
              <li>• Reference specific SOPs or doctrine if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? "bg-primary" : "bg-muted"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-primary" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Sources:</p>
            <div className="flex flex-wrap gap-1">
              {message.citations.map((citation, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                >
                  {citation}
                </span>
              ))}
            </div>
          </div>
        )}
        <p
          className={`text-xs mt-2 ${
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
