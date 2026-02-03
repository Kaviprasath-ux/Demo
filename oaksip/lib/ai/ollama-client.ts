// Ollama Client - SOW Section 8.1: Own Embedded LLM

import {
  LLMConfig,
  LLMRequest,
  LLMResponse,
  LLMError,
  LLMHealthStatus
} from "./types";
import { defaultOllamaConfig } from "./config";

export class OllamaClient {
  private config: LLMConfig;

  constructor(config: Partial<LLMConfig> = {}) {
    this.config = { ...defaultOllamaConfig, ...config };
  }

  // Check if Ollama is available
  async checkHealth(): Promise<LLMHealthStatus> {
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.config.baseUrl}/api/tags`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          available: false,
          provider: "ollama",
          model: this.config.model,
          error: `Server responded with ${response.status}`,
        };
      }

      const data = await response.json();
      const models = data.models || [];
      const modelExists = models.some((m: { name: string }) =>
        m.name === this.config.model || m.name.startsWith(this.config.model)
      );

      return {
        available: modelExists,
        provider: "ollama",
        model: this.config.model,
        latencyMs: Date.now() - startTime,
        error: modelExists ? undefined : `Model ${this.config.model} not found`,
      };
    } catch (error) {
      return {
        available: false,
        provider: "ollama",
        model: this.config.model,
        error: error instanceof Error ? error.message : "Connection failed",
      };
    }
  }

  // Generate completion
  async generate(request: LLMRequest): Promise<LLMResponse> {
    const { messages, temperature = 0.7, maxTokens = 2048 } = request;

    // Convert messages to Ollama format
    const prompt = this.formatMessages(messages);

    let lastError: LLMError | null = null;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(`${this.config.baseUrl}/api/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: this.config.model,
            prompt,
            stream: false,
            options: {
              temperature,
              num_predict: maxTokens,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Ollama error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        return {
          content: data.response || "",
          model: data.model || this.config.model,
          totalTokens: data.eval_count,
          finishReason: data.done ? "stop" : "length",
        };
      } catch (error) {
        lastError = this.parseError(error);

        // Don't retry on certain errors
        if (lastError.code === "MODEL_NOT_FOUND" || lastError.code === "INVALID_REQUEST") {
          break;
        }

        // Wait before retry
        if (attempt < this.config.maxRetries) {
          await this.delay(1000 * (attempt + 1));
        }
      }
    }

    throw lastError || { code: "UNKNOWN", message: "Unknown error" };
  }

  // Chat completion (Ollama chat API)
  async chat(request: LLMRequest): Promise<LLMResponse> {
    const { messages, temperature = 0.7, maxTokens = 2048 } = request;

    let lastError: LLMError | null = null;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(`${this.config.baseUrl}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: this.config.model,
            messages: messages.map(m => ({
              role: m.role,
              content: m.content,
            })),
            stream: false,
            options: {
              temperature,
              num_predict: maxTokens,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Ollama error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        return {
          content: data.message?.content || "",
          model: data.model || this.config.model,
          totalTokens: data.eval_count,
          finishReason: data.done ? "stop" : "length",
        };
      } catch (error) {
        lastError = this.parseError(error);

        if (lastError.code === "MODEL_NOT_FOUND" || lastError.code === "INVALID_REQUEST") {
          break;
        }

        if (attempt < this.config.maxRetries) {
          await this.delay(1000 * (attempt + 1));
        }
      }
    }

    throw lastError || { code: "UNKNOWN", message: "Unknown error" };
  }

  // Format messages for Ollama generate endpoint
  private formatMessages(messages: LLMRequest["messages"]): string {
    return messages
      .map((m) => {
        switch (m.role) {
          case "system":
            return `System: ${m.content}`;
          case "user":
            return `User: ${m.content}`;
          case "assistant":
            return `Assistant: ${m.content}`;
        }
      })
      .join("\n\n");
  }

  // Parse error into standard format
  private parseError(error: unknown): LLMError {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (error.name === "AbortError" || message.includes("timeout")) {
        return { code: "TIMEOUT", message: "Request timed out" };
      }

      if (message.includes("econnrefused") || message.includes("fetch failed")) {
        return { code: "CONNECTION_ERROR", message: "Cannot connect to Ollama server" };
      }

      if (message.includes("model") && message.includes("not found")) {
        return { code: "MODEL_NOT_FOUND", message: `Model ${this.config.model} not found` };
      }

      return { code: "UNKNOWN", message: error.message };
    }

    return { code: "UNKNOWN", message: "Unknown error occurred" };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
let ollamaClientInstance: OllamaClient | null = null;

export function getOllamaClient(): OllamaClient {
  if (!ollamaClientInstance) {
    ollamaClientInstance = new OllamaClient();
  }
  return ollamaClientInstance;
}
