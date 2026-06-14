# AutoPilot AI — Keep-Alive Setup

> **Why this matters:** Render's free tier spins down web services after ~15 minutes of inactivity.
> The next request after a cold start can take **30–60 seconds** to respond, creating a poor
> user experience. An **external** scheduler — running entirely outside the Render VM — pings the
> backend every 10 minutes so it never goes to sleep.

---

## Architecture Overview

```
[cron-job.org / UptimeRobot]
         │
         │  GET /api/health  (every 10 min)
         ▼
[Render Web Service — autopilot-ai-backend]
         │  HTTP 200  { "status": "ok", "timestamp": "…" }
         └─ response logged, service stays warm
```

No code runs inside the sleeping Render service. The external scheduler
is always running independently.

---

## Service URLs

| Item | Value |
|---|---|
| **Backend base URL** | `https://autopilot-ai-backend.onrender.com` (set via `BACKEND_PUBLIC_URL`) |
| **Health endpoint** | `https://autopilot-ai-backend.onrender.com/api/health` |
| **Frontend base URL** | `https://<your-app>.vercel.app` (set via `NEXT_PUBLIC_API_URL`) |

> Replace the placeholders above with your actual Render service URL.
> Find it in **Render Dashboard → your service → Settings → URL**.

---

## Environment Variables

### Frontend (Vercel)

| Variable | Purpose | Example Value |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL used by Next.js client code | `https://autopilot-ai-backend.onrender.com` |

Set this in **Vercel Dashboard → Project → Settings → Environment Variables**.

### Backend (Render)

| Variable | Purpose | Example Value |
|---|---|---|
| `BACKEND_PUBLIC_URL` | Render service's own public URL | `https://autopilot-ai-backend.onrender.com` |
| `FRONTEND_URL` | Allowed CORS origin | `https://<your-app>.vercel.app` |
| `FRONTEND_URLS` | Additional CORS origins (comma-separated) | _(optional)_ |

Set these in **Render Dashboard → your service → Environment**.

---

## Option A — cron-job.org (Preferred · Free)

**cron-job.org** is a free, no-login-required cron scheduler that runs jobs
from external infrastructure. Perfect for keeping Render awake.

### Step-by-step Setup

1. Go to [https://cron-job.org](https://cron-job.org) and create a **free account**.
2. Click **"CREATE CRONJOB"**.
3. Fill in the form:

| Field | Value |
|---|---|
| **Title** | `AutoPilot AI — Keep Alive` |
| **URL** | `https://autopilot-ai-backend.onrender.com/api/health` |
| **Execution schedule** | Custom → every **10 minutes** |
| **Request method** | `GET` |
| **Expected HTTP status** | `200` |
| **Notifications on failure** | ✅ Enable (enter your email) |

4. **Custom schedule** — click "Custom" and set:
   - Every: **10 minutes**
   - Hours: `*` (all)
   - Days/Months/Weekdays: `*` (all)

   Equivalent cron expression: `*/10 * * * *`

5. Click **"CREATE"** → the job is now active.

### Verification

- After creation, wait ~10 minutes and click **"Job logs"**.
- You should see HTTP `200` responses with a sub-100 ms execution time.
- The job history shows the response body — confirm it includes `"status":"ok"`.

---

## Option B — UptimeRobot (Free)

UptimeRobot offers a free tier with 5-minute check intervals.

### Step-by-step Setup

1. Go to [https://uptimerobot.com](https://uptimerobot.com) and sign up for a **free account**.
2. Click **"+ Add New Monitor"**.
3. Fill in the form:

| Field | Value |
|---|---|
| **Monitor Type** | `HTTP(s)` |
| **Friendly Name** | `AutoPilot AI Backend` |
| **URL** | `https://autopilot-ai-backend.onrender.com/api/health` |
| **Monitoring Interval** | `5 minutes` |
| **Alert contacts** | Add your email |

4. Click **"Create Monitor"**.

### Verification

- The dashboard shows a green "UP" badge when the first check succeeds.
- Check the **"Response Time"** chart — a spike every ~5 minutes means the
  service is cold-starting; after a few hours it should flatten out.

---

## Health Endpoint Reference

```http
GET /api/health HTTP/1.1
Host: autopilot-ai-backend.onrender.com
```

**Success response (`200 OK`):**
```json
{
  "status": "ok",
  "timestamp": "2026-06-14T12:00:00.000Z"
}
```

- No authentication required.
- No database access.
- Responds in < 5 ms under normal conditions.

---

## Local Verification Script

Use `scripts/check-health.sh` to verify the endpoint manually:

```bash
# Test production backend
NEXT_PUBLIC_API_URL=https://autopilot-ai-backend.onrender.com \
  bash scripts/check-health.sh

# Test local backend (default)
bash scripts/check-health.sh
```

**Expected output:**
```
[health-check] Pinging → https://autopilot-ai-backend.onrender.com/api/health
[health-check] HTTP status : 200
[health-check] Response    : {"status":"ok","timestamp":"2026-06-14T12:00:00.000Z"}
[health-check] ✅ Backend is healthy. All checks passed.
```

**Failure output (exits 1):**
```
[health-check] Pinging → https://autopilot-ai-backend.onrender.com/api/health
[health-check] ❌ Expected HTTP 200 but received HTTP 503.
```

---

## Deployment Checklist

- [ ] Render service is deployed and accessible via its public URL
- [ ] `BACKEND_PUBLIC_URL` environment variable set on Render
- [ ] `NEXT_PUBLIC_API_URL` environment variable set on Vercel
- [ ] `bash scripts/check-health.sh` returns exit code `0` in production
- [ ] cron-job.org job created with URL pointing to `/api/health`
- [ ] First cron-job.org log entry shows HTTP `200`
- [ ] (Optional) UptimeRobot monitor created as a secondary check

---

## Troubleshooting

### ❌ HTTP 503 from cron-job.org

The service may be in the middle of a cold start on the first ping.
- Wait 60 seconds and check the next log entry — it should be `200`.
- If consistently `503`, verify the Render deployment is not in a crash-restart loop.

### ❌ HTTP 404 from cron-job.org

The URL is wrong. Double-check:
1. The path is exactly `/api/health` (not `/health`).
2. There is no trailing slash.
3. The Render service URL matches `BACKEND_PUBLIC_URL`.

### ❌ `curl: (6) Could not resolve host`

DNS resolution failure. Confirm the Render service URL in the dashboard and
that the service is not suspended due to non-payment / free-tier expiry.

### ❌ check-health.sh exits non-zero locally

The backend is not running. Start it with:
```bash
cd backend && npm run dev
```

---

## Why Not Internal Keep-Alive?

Render's free tier **stops the Node.js process** when idle. This means:
- `setInterval`, `node-cron`, background loops — **all stop** when the service sleeps.
- The only reliable solution is an **external** service that makes an inbound HTTP
  request, which forces Render to wake the service.

cron-job.org and UptimeRobot both run on their own always-on infrastructure,
so they can reliably wake a sleeping Render service.
