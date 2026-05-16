const DEFAULT_API_URL = "http://localhost:5000";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getApiBaseUrl() {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL);
}

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
