import "server-only";

export function getOllamaBaseUrl() {
  return process.env.OLLAMA_BASE_URL?.trim() || "http://127.0.0.1:11434";
}

export function getOllamaModel() {
  return process.env.OLLAMA_MODEL?.trim() || "qwen2.5:3b";
}
