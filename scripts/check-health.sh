#!/usr/bin/env bash
# =============================================================================
# scripts/check-health.sh
#
# Verifies that the AutoPilot AI backend health endpoint is responding
# correctly. Exits with a non-zero code on any failure so the script is
# safe to use in CI pipelines.
#
# Usage:
#   bash scripts/check-health.sh
#
# Environment variables (optional – override the built-in default):
#   NEXT_PUBLIC_API_URL   The base URL of the backend, e.g.
#                         https://autopilot-ai-backend.onrender.com
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BACKEND_URL="${NEXT_PUBLIC_API_URL:-http://localhost:5000}"
HEALTH_URL="${BACKEND_URL%/}/api/health"   # strip trailing slash, append path
TIMEOUT_SECONDS=10

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
log()  { echo "[health-check] $*"; }
ok()   { echo "[health-check] ✅ $*"; }
fail() { echo "[health-check] ❌ $*" >&2; exit 1; }

# ---------------------------------------------------------------------------
# Dependency check
# ---------------------------------------------------------------------------
if ! command -v curl &>/dev/null; then
  fail "curl is required but not installed. Install it and try again."
fi

# ---------------------------------------------------------------------------
# Request
# ---------------------------------------------------------------------------
log "Pinging → ${HEALTH_URL}"

HTTP_RESPONSE=$(
  curl \
    --silent \
    --show-error \
    --max-time "${TIMEOUT_SECONDS}" \
    --write-out "\n%{http_code}" \
    "${HEALTH_URL}" 2>&1
) || fail "curl failed. Is the backend reachable at ${HEALTH_URL}?"

# Split body and status code (last line is the code)
HTTP_BODY=$(echo "${HTTP_RESPONSE}" | head -n -1)
HTTP_STATUS=$(echo "${HTTP_RESPONSE}" | tail -n 1)

# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------
log "HTTP status : ${HTTP_STATUS}"
log "Response    : ${HTTP_BODY}"

if [ "${HTTP_STATUS}" -ne 200 ]; then
  fail "Expected HTTP 200 but received HTTP ${HTTP_STATUS}."
fi

# Optionally validate the JSON body contains "status":"ok"
if command -v grep &>/dev/null; then
  if ! echo "${HTTP_BODY}" | grep -q '"status"'; then
    fail "Response body did not contain a 'status' field. Got: ${HTTP_BODY}"
  fi
fi

ok "Backend is healthy. All checks passed."
exit 0
