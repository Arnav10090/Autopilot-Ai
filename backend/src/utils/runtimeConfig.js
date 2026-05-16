const LOCAL_FRONTEND_URL = "http://localhost:3000";
const LOCAL_BACKEND_URL = "http://localhost:5000";

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

function splitUrls(value) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => trimTrailingSlash(entry.trim()))
    .filter(Boolean);
}

export function getFrontendUrls() {
  const urls = new Set([
    ...splitUrls(process.env.FRONTEND_URLS),
    ...splitUrls(process.env.FRONTEND_URL),
  ]);

  if (process.env.NODE_ENV !== "production") {
    urls.add(LOCAL_FRONTEND_URL);
  }

  return [...urls];
}

export function getPrimaryFrontendUrl() {
  return getFrontendUrls()[0] || LOCAL_FRONTEND_URL;
}

export function getBackendPublicUrl() {
  const configuredUrl =
    process.env.BACKEND_PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || LOCAL_BACKEND_URL;

  return trimTrailingSlash(configuredUrl);
}

export function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = trimTrailingSlash(origin);
  const allowedOrigins = new Set(getFrontendUrls());

  if (allowedOrigins.has(normalizedOrigin)) {
    return true;
  }

  if (
    process.env.ALLOW_VERCEL_PREVIEWS === "true" &&
    /^https:\/\/[a-z0-9-]+(?:-[a-z0-9-]+)*\.vercel\.app$/i.test(normalizedOrigin)
  ) {
    return true;
  }

  return false;
}
