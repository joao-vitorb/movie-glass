export function getOllamaBaseUrl() {
  return process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
}

export function getOllamaModel() {
  return process.env.OLLAMA_MODEL || "qwen2.5:3b";
}