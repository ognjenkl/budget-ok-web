// In development, we use Vite's proxy to avoid CORS issues
// The proxy is configured in vite.config.ts to forward /api to the backend
// In production, the API is served from the same origin

export default function buildApiPrefix(): string {
  return "/api";
}