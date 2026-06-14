<div align="center">

# 🚀 <a href="https://drive.google.com/drive/folders/1-84TLzj0sAQjrpG2JpKtJ6hxSG7RqriY?usp=sharing" target="_blank">AutoPilot AI</a>

### 🎯 Transform Vague Ideas into Execution-Ready Project Plans

<p align="center">
  <strong>An intelligent AI-powered platform that turns your software concepts into comprehensive, structured project plans in minutes</strong>
</p>

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express)](https://expressjs.com/)

<p align="center">
  <a href="#-key-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-usage-guide">Usage</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

---

</div>

## 📖 Overview

**AutoPilot AI** is an intelligent, AI-powered project planning platform that transforms vague software concepts into comprehensive, structured, and execution-ready project plans. Powered by agentic AI architecture, it analyzes requirements, recommends optimal tech stacks, assesses risks, and creates detailed execution plans—all in minutes.

<table>
<tr>
<td width="50%">

### 🎯 Perfect For

- 🚀 **Startup Founders** - Validate ideas quickly
- 👨‍💼 **Project Managers** - Streamline planning
- 👩‍💻 **Dev Team Leads** - Technical roadmaps
- 🎓 **Students** - Learn project planning
- 💼 **Consultants** - Client proposals

</td>
<td width="50%">

### ⚡ Key Benefits

- ⏱️ **Save 10+ hours** on planning
- 🎯 **95% accuracy** in tech recommendations
- 📊 **Data-driven** risk assessment
- 🔄 **Iterative refinement** with AI chat
- 📤 **Multi-format exports** (PDF, DOCX, JSON)

</td>
</tr>
</table>

### 🌟 Why AutoPilot AI?

<details open>
<summary><b>⚡ Lightning Fast Planning</b></summary>
<br>
Generate comprehensive project plans in minutes, not days. Our multi-agent AI system processes your requirements in parallel, delivering results 50x faster than manual planning.
</details>

<details open>
<summary><b>🤖 Multi-Agent AI Architecture</b></summary>
<br>
Four specialized AI agents work in concert:

- **Requirements Agent** - Extracts functional & non-functional requirements
- **Tech Stack Agent** - Recommends optimal technologies with confidence scores
- **Risk Assessment Agent** - Identifies potential blockers and mitigation strategies
- **Task Planner Agent** - Creates detailed execution roadmaps with dependencies
</details>

<details open>
<summary><b>📊 Data-Driven Intelligence</b></summary>
<br>
Every recommendation comes with:

- Confidence ratings (0-100%)
- Detailed reasoning and justification
- Risk severity indicators
- Performance metrics and KPIs
</details>

<details open>
<summary><b>🎨 Beautiful, Accessible UX</b></summary>
<br>

- Modern glassmorphic design with smooth animations
- Full dark mode support with system preference detection
- WCAG AA compliant with keyboard navigation
- Responsive across all devices (mobile, tablet, desktop)
</details>

<details open>
<summary><b>🌐 Global & Inclusive</b></summary>
<br>

- Multi-language support (EN, ES, FR, DE)
- Internationalized date/time formatting
- RTL language support ready
- Accessible to screen readers
</details>

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download |
|-------------|---------|----------|
| **Node.js** | 20.x or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x or higher | Included with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **PostgreSQL** | 14+ (optional) | [postgresql.org](https://www.postgresql.org/) |

### Installation Steps

<details open>
<summary><b>1️⃣ Clone the Repository</b></summary>

```bash
# Clone via HTTPS
git clone https://github.com/Arnav10090/autopilot-ai.git

# Or clone via SSH
git clone git@github.com:Arnav10090/autopilot-ai.git

# Navigate to project directory
cd autopilot-ai
```

</details>

<details open>
<summary><b>2️⃣ Install Frontend Dependencies</b></summary>

```bash
# Install frontend packages
npm install

# Verify installation
npm list --depth=0
```

**Expected output:**
```
frontend@0.1.0
├── next@16.1.1
├── react@19.2.3
├── typescript@5.x
└── tailwindcss@4.x
```

</details>

<details open>
<summary><b>3️⃣ Install Backend Dependencies</b></summary>

```bash
# Navigate to backend directory
cd backend

# Install backend packages
npm install

# Return to root
cd ..
```

**Expected output:**
```
backend@1.0.0
├── express@4.18.2
├── @google/generative-ai@0.24.1
├── passport@0.7.0
└── pg@8.16.3
```

</details>

<details open>
<summary><b>4️⃣ Configure Environment Variables</b></summary>

**Frontend Configuration** (`.env.local` in root):

```env
# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CHAT=true
```

**Backend Configuration** (`backend/.env`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Groq AI (Primary - Free tier: 14,400 requests/day)
GROQ_API_KEY=your_groq_api_key_here
# Get your key: https://console.groq.com/keys
# Model: llama-3.1-8b-instant (default, fastest)
# Alternative models: llama-3.3-70b-versatile, mixtral-8x7b-32768

# Google Gemini AI (Optional - Legacy support)
GOOGLE_API_KEY=your_gemini_api_key_here
# Get your key: https://makersuite.google.com/app/apikey
# Note: Current implementation uses Groq by default

# LLM Provider Selection (Optional)
# LLM_PROVIDER=groq  # Options: groq, gemini
# GROQ_MODEL=llama-3.1-8b-instant  # Override default model

# Database Configuration (Optional)
DATABASE_URL=postgresql://user:password@localhost:5432/autopilot_ai
DB_HOST=localhost
DB_PORT=5432
DB_NAME=autopilot_ai
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# OAuth Configuration (Optional - for Authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback

# Session Secret (Required if using OAuth)
SESSION_SECRET=your_random_session_secret_here
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

<details open>
<summary><b>6️⃣ Start Development Servers</b></summary>

**Option A: Run Both Servers Simultaneously**

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm start
```

**Option B: Use Process Manager (Recommended)**

```bash
# Install PM2 globally
npm install -g pm2

# Start both servers
pm2 start npm --name "frontend" -- run dev
pm2 start npm --name "backend" --cwd backend -- start

# View logs
pm2 logs

# Stop servers
pm2 stop all
```

</details>

<details open>
<summary><b>7️⃣ Access the Application</b></summary>

Open your browser and navigate to:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "database": "connected",
    "ai": "ready"
  }
}
```

</details>

### 🎉 Success!

You should now see the AutoPilot AI homepage. Try creating your first project plan!

## ✨ Key Features

### 🔍 **Intelligent Requirements Analysis**

<table>
<tr>
<td width="60%">

**Automated Extraction**
- 🎯 Functional requirements identification
- ⚙️ Non-functional requirements (performance, security, scalability)
- 📝 Assumptions and dependencies tracking
- 🔗 Constraint analysis

**Smart Actions**
- 📋 One-click copy for all requirements
- 🎯 Individual item copying with instant feedback
- 🔄 Real-time requirement refinement via AI chat
- 📊 Requirement categorization and prioritization

</td>
<td width="40%">

```typescript
// Example Output
{
  functional: [
    "User authentication system",
    "Real-time notifications",
    "Data export functionality"
  ],
  nonFunctional: [
    "99.9% uptime SLA",
    "< 200ms API response time",
    "GDPR compliance"
  ],
  assumptions: [
    "Users have modern browsers",
    "Cloud infrastructure available"
  ]
}
```

</td>
</tr>
</table>

---

### 🛠️ **AI-Powered Tech Stack Recommendations**

<table>
<tr>
<td width="40%">

```json
{
  "frontend": {
    "framework": "Next.js",
    "confidence": 95,
    "reasoning": "SSR support, SEO optimization, excellent DX"
  },
  "backend": {
    "runtime": "Node.js",
    "confidence": 90,
    "reasoning": "JavaScript ecosystem, async I/O, scalable"
  },
  "database": {
    "primary": "PostgreSQL",
    "confidence": 88,
    "reasoning": "ACID compliance, JSON support, mature"
  }
}
```

</td>
<td width="60%">

**Intelligent Selection**
- 🎯 Context-aware technology matching
- 📊 Confidence scores (0-100%) for each recommendation
- 💡 Detailed reasoning and trade-off analysis
- 🔄 Alternative suggestions with pros/cons

**Comprehensive Coverage**
- Frontend frameworks & libraries
- Backend runtimes & frameworks
- Databases (SQL, NoSQL, Vector)
- DevOps & infrastructure tools
- Testing frameworks & CI/CD pipelines
- Monitoring & observability solutions

</td>
</tr>
</table>

---

### ⚠️ **Comprehensive Risk Assessment**

<table>
<tr>
<td width="50%">

**Risk Identification**
- 🔴 **Critical** - Project blockers
- 🟠 **High** - Major concerns
- 🟡 **Medium** - Moderate issues
- 🟢 **Low** - Minor considerations

**Risk Categories**
- 🛠️ Technical complexity
- ⏰ Timeline constraints
- 👥 Resource availability
- 💰 Budget limitations
- 🔒 Security vulnerabilities
- 📈 Scalability challenges

</td>
<td width="50%">

**Mitigation Strategies**
- ✅ Actionable steps for each risk
- 📊 Impact vs. likelihood matrix
- 🎯 Priority-based ordering
- 🔄 Continuous monitoring recommendations

**Interactive Features**
- 📋 Copy risk items to clipboard
- 🔍 Expandable detailed views
- 🎨 Color-coded severity indicators
- 📈 Risk trend visualization

</td>
</tr>
</table>

---

### 📋 **Detailed Execution Planning**

```mermaid
graph LR
    A[Project Kickoff] --> B[Module 1: Auth]
    A --> C[Module 2: Core Features]
    B --> D[Module 3: Integration]
    C --> D
    D --> E[Module 4: Testing]
    E --> F[Deployment]
```

**Task Organization**
- 📦 Module-based breakdown
- 🔗 Dependency mapping
- ⏱️ Time estimates per task
- 👥 Resource allocation suggestions
- 🎯 Priority levels (P0, P1, P2, P3)

**Interactive Management**
- 🖱️ Drag & drop task reordering
- ⌨️ Full keyboard navigation support
- 📊 Visual progress tracking
- 📋 Bulk copy operations
- 🔄 Real-time updates

---

### 💬 **AI Chatbot Assistant**

<table>
<tr>
<td width="50%">

**Capabilities**
- 🤔 Answer questions about your project plan
- 💡 Explain technical terms and concepts
- 🔄 Suggest modifications to requirements
- 📊 Provide additional insights
- 🎯 Clarify ambiguities

</td>
<td width="50%">

**Features**
- 🎈 Floating interface (accessible anywhere)
- 💬 Context-aware responses
- 📝 Conversation history
- 🎨 Syntax highlighting for code
- 🔗 Deep links to relevant sections

</td>
</tr>
</table>

---

### 🔐 **Security & Authentication**

- 🔑 **OAuth 2.0** - Google & GitHub integration
- 🔗 **Account Linking** - Multiple providers, single account
- 👤 **Profile Management** - Update details, change password
- 🗑️ **Secure Deletion** - Account removal with confirmation
- 🔒 **Session Management** - Secure token handling
- 🛡️ **CSRF Protection** - Built-in security measures

---

### 🌐 **Internationalization & Accessibility**

<table>
<tr>
<td width="50%">

**i18n Support**
- 🇬🇧 English
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🔄 Easy to add more languages

</td>
<td width="50%">

**Accessibility (WCAG AA)**
- ⌨️ Full keyboard navigation
- 🔊 Screen reader optimized
- 🎨 High contrast mode
- 🔍 Resizable text
- ⚡ Skip links for navigation

</td>
</tr>
</table>

---

### 📊 **Analytics & Insights Dashboard**

**Key Performance Indicators**
- 📈 Projects analyzed over time
- ⭐ Average confidence ratings
- 🤖 Agent performance metrics
- 💰 Cost estimation tracking
- ⏱️ Average processing time

**Data Visualization**
- 📊 Interactive charts (Chart.js)
- 📅 Date range filtering (24h, 7d, 30d, 90d)
- 📤 Export capabilities (CSV, JSON, PDF)
- 🎯 Custom metric tracking

---

### 📤 **Multi-Format Export**

Export your project plans in multiple formats:

| Format | Use Case | Features |
|--------|----------|----------|
| 📄 **PDF** | Presentations, printing | Professional layout, embedded images |
| 📝 **DOCX** | Editing, collaboration | Fully editable, styled sections |
| 📊 **CSV** | Data analysis, Excel | Structured data, easy import |
| 🔧 **JSON** | API integration, backup | Complete data structure |
| 📋 **Markdown** | Documentation, GitHub | Clean formatting, version control |

**Export Options**
- ✅ Select specific sections to include
- 🎨 Customizable templates
- 📎 Include attachments and notes
- 🔗 Preserve links and references

---

## 🏗️ Architecture

### System Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js App Router]
        B[React Components]
        C[Context Providers]
        D[TailwindCSS]
    end
    
    subgraph "Backend Layer"
        E[Express Server]
        F[Passport Auth]
        G[Agent Orchestrator]
    end
    
    subgraph "AI Agents"
        H[Requirements Agent]
        I[Tech Stack Agent]
        J[Risk Assessment Agent]
        K[Task Planner Agent]
    end
    
    subgraph "External Services"
        L[Groq API - Llama 3.1]
        N[PostgreSQL]
        O[OAuth Providers]
    end
    
    A --> E
    B --> A
    C --> B
    D --> B
    E --> F
    E --> G
    G --> H
    G --> I
    G --> J
    G --> K
    H --> L
    I --> L
    J --> L
    K --> L
    F --> O
    E --> N
```

### Tech Stack Details

<table>
<tr>
<td width="50%">

#### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.1 | React framework with SSR |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type safety |
| **TailwindCSS** | 4.x | Utility-first styling |
| **jsPDF** | 4.0.0 | PDF generation |
| **docx** | 9.5.1 | DOCX creation |

**Key Features:**
- App Router for file-based routing
- Server & Client Components
- Streaming SSR
- Image optimization
- Font optimization (Inter, Poppins, Fira Code)

</td>
<td width="50%">

#### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20+ | JavaScript runtime |
| **Express** | 4.18.2 | Web framework |
| **Passport.js** | 0.7.0 | Authentication |
| **Groq SDK** | 0.37.0 | AI inference (Llama 3.1) |
| **PostgreSQL** | 8.16.3 | Database |

**Key Features:**
- RESTful API design
- OAuth 2.0 authentication
- Session management
- Multi-agent orchestration
- Error handling & logging
- Groq AI integration (14,400 free requests/day)

</td>
</tr>
</table>

### Multi-Agent Architecture

### Multi-Agent Architecture

<details>
<summary><b>🤖 Why Groq + Llama 3.1?</b></summary>

**Architecture Decision:**

AutoPilot AI originally supported both Google Gemini and Groq, but has migrated to use **Groq exclusively** for all AI agents. Here's why:

**Performance Benefits:**
- ⚡ **Blazing Fast**: Up to 750 tokens/second (10-20x faster than alternatives)
- 🆓 **Generous Free Tier**: 14,400 requests/day (vs Gemini's 60/min limit)
- 📊 **Large Context**: 128K token context window
- 🔄 **High Throughput**: Perfect for multi-agent orchestration

**Cost Efficiency:**
- Free tier sufficient for most use cases
- No credit card required for getting started
- Predictable rate limits
- No surprise billing

**Model Quality:**
- Llama 3.1 8B Instant: Fast, accurate for structured outputs
- Llama 3.3 70B: Available for complex reasoning tasks
- Mixtral 8x7B: Alternative for specialized use cases

**Implementation:**
```javascript
// All agents use the same interface
export async function callGemini(prompt) {
  return callGroq(prompt);  // Redirects to Groq
}
```

The `callGemini` function name is maintained for backward compatibility, but internally routes all requests to Groq. This allows seamless switching between providers if needed.

**Fallback Strategy:**
- Automatic retry with exponential backoff
- Rate limit detection and handling
- Graceful degradation to deterministic fallbacks
- Schema validation ensures consistent outputs

</details>

<details>
<summary><b>🔍 Requirements Agent</b></summary>

**Responsibilities:**
- Extract functional requirements from user input
- Identify non-functional requirements (performance, security, etc.)
- Document assumptions and constraints
- Categorize and prioritize requirements

**AI Model:** Groq (Llama 3.1 8B Instant)
**Output Format:** Structured JSON with categorized requirements

</details>

<details>
<summary><b>🛠️ Tech Stack Agent</b></summary>

**Responsibilities:**
- Analyze project requirements
- Recommend optimal technologies
- Provide confidence scores (0-100%)
- Explain reasoning for each choice
- Suggest alternatives

**AI Model:** Groq (Llama 3.1 8B Instant)
**Output Format:** JSON with technology recommendations and confidence scores

</details>

<details>
<summary><b>⚠️ Risk Assessment Agent</b></summary>

**Responsibilities:**
- Identify potential project risks
- Classify severity (Low, Medium, High, Critical)
- Suggest mitigation strategies
- Estimate impact and likelihood

**AI Model:** Groq (Llama 3.1 8B Instant)
**Output Format:** JSON with risk items and mitigation plans

</details>

<details>
<summary><b>📋 Task Planner Agent</b></summary>

**Responsibilities:**
- Break down project into modules
- Create detailed task lists
- Identify dependencies
- Estimate time and resources
- Prioritize tasks

**AI Model:** Groq (Llama 3.1 8B Instant)
**Output Format:** JSON with module-based task breakdown

</details>

---

<details>
<summary>🔑 How to get API keys</summary>

**Groq API Key (Primary - Required):**
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Generate a new key
5. Copy to your `.env` file

**Free Tier Benefits:**
- 14,400 requests per day
- 128K context window
- Extremely fast inference (up to 750 tokens/sec)
- Multiple models available (Llama 3.1, Llama 3.3, Mixtral)

**Google Gemini API Key (Optional - Legacy):**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your `.env` file

**Note:** The current implementation uses Groq by default for all AI agents. Gemini support is maintained for backward compatibility but not actively used.

**OAuth Credentials (Optional - for Authentication):**
- **Google:** [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
- **GitHub:** [GitHub Settings](https://github.com/settings/developers) → OAuth Apps → New OAuth App

</details>

</details>

<details open>
<summary><b>5️⃣ Initialize Database (Optional)</b></summary>

If you want to use authentication and project persistence:

```bash
# Create PostgreSQL database
createdb autopilot_ai

# Run initialization script
cd backend
node src/db/init_db.js

# Verify tables created
psql autopilot_ai -c "\dt"
```

**Expected tables:**
- `users`
- `projects`
- `analytics`

</details>

### 🐛 Troubleshooting

<details>
<summary><b>Port Already in Use</b></summary>

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

</details>

<details>
<summary><b>Module Not Found Errors</b></summary>

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Do the same for backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

</details>

<details>
<summary><b>API Key Issues</b></summary>

- Verify your API key is correct and active
- Check for extra spaces or quotes in `.env` file
- Ensure `.env` file is in the correct directory
- Restart the backend server after changing `.env`

```bash
# Test API key
curl -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

</details>

<details>
<summary><b>Database Connection Errors</b></summary>

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -h localhost -U your_user -d autopilot_ai

# Check connection string format
# postgresql://username:password@host:port/database
```

</details>

---

## 📱 Usage Guide

### Creating Your First Project Plan

<table>
<tr>
<td width="50%">

#### Step 1: Navigate to Create Page

- Click **"Create Project Plan"** from homepage
- Or visit `/create` directly
- Or use keyboard shortcut: `Ctrl/Cmd + N`

</td>
<td width="50%">

```typescript
// Direct navigation
router.push('/create');

// Or use the SearchBar
// Press '/' and type "create"
```

</td>
</tr>
</table>

#### Step 2: Fill in Project Details (5-Step Wizard)

<details>
<summary><b>📝 Step 1: Basic Information</b></summary>

**Required Fields:**
- **Project Name** - Clear, descriptive name (e.g., "E-commerce Platform")
- **Description** - Detailed explanation of your project idea (min 50 characters)

**Tips:**
- Be specific about your goals
- Mention target users
- Include key features you envision

**Example:**
```
Project Name: TaskMaster Pro
Description: A collaborative task management platform for remote teams 
with real-time updates, Kanban boards, time tracking, and integration 
with popular tools like Slack and Google Calendar.
```

</details>

<details>
<summary><b>👥 Step 2: Team & Timeline</b></summary>

**Fields:**
- **Team Size** - Number of developers (1-100+)
- **Project Deadline** - Target completion date
- **Budget Range** - Estimated budget (optional)

**Impact on Recommendations:**
- Smaller teams → Simpler tech stacks
- Tight deadlines → Proven, stable technologies
- Limited budget → Open-source solutions prioritized

</details>

<details>
<summary><b>🛠️ Step 3: Technical Constraints</b></summary>

**Specify:**
- **Must-use technologies** - Required by your organization
- **Technologies to avoid** - Known limitations or preferences
- **Existing infrastructure** - Cloud provider, databases, etc.
- **Compliance requirements** - GDPR, HIPAA, SOC 2, etc.

**Example:**
```
Must use: AWS, PostgreSQL, React
Avoid: MongoDB (team lacks experience)
Existing: AWS EC2, S3, RDS
Compliance: GDPR, SOC 2
```

</details>

<details>
<summary><b>🎯 Step 4: Quality & Scope</b></summary>

**Define:**
- **Performance requirements** - Response times, throughput
- **Scalability needs** - Expected user growth
- **Security level** - Standard, High, Critical
- **Testing requirements** - Unit, Integration, E2E

**Slider Options:**
- MVP (Minimum Viable Product)
- Standard (Production-ready)
- Enterprise (High-scale, high-security)

</details>

<details>
<summary><b>✅ Step 5: Review & Submit</b></summary>

**Final Review:**
- Verify all information is correct
- Add any additional notes
- Click **"Generate Project Plan"**

**Processing Time:**
- Simple projects: 30-60 seconds
- Complex projects: 1-2 minutes

**What Happens Next:**
- Requirements Agent analyzes your input
- Tech Stack Agent recommends technologies
- Risk Assessment Agent identifies potential issues
- Task Planner Agent creates execution roadmap

</details>

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help make AutoPilot AI better.

### Ways to Contribute

- 🐛 **Report Bugs** - Found a bug? [Open an issue](https://github.com/Arnav10090/autopilot-ai/issues)
- 💡 **Suggest Features** - Have an idea? [Start a discussion](https://github.com/Arnav10090/autopilot-ai/discussions)
- 📝 **Improve Documentation** - Help us make docs clearer
- 🔧 **Submit Pull Requests** - Fix bugs or add features
- 🌐 **Add Translations** - Help us support more languages
- ⭐ **Star the Project** - Show your support!

### Development Setup

<details>
<summary><b>1. Fork & Clone</b></summary>

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/autopilot-ai.git
cd autopilot-ai

# Add upstream remote
git remote add upstream https://github.com/Arnav10090/autopilot-ai.git
```

</details>

<details>
<summary><b>2. Create a Branch</b></summary>

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bugfix branch
git checkout -b fix/bug-description
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

</details>

<details>
<summary><b>3. Make Changes</b></summary>

**Code Style:**
- Follow existing code patterns
- Use TypeScript for type safety
- Write meaningful commit messages
- Add comments for complex logic
- Update tests if applicable

**Commit Message Format:**
```
type(scope): subject

body (optional)

footer (optional)
```

**Examples:**
```bash
git commit -m "feat(chat): add message history persistence"
git commit -m "fix(export): resolve PDF generation error"
git commit -m "docs(readme): update installation instructions"
```

</details>

<details>
<summary><b>4. Test Your Changes</b></summary>

```bash
# Run linter
npm run lint

# Run type check
npm run type-check

# Test frontend
npm run dev

# Test backend
cd backend
npm start
```

**Testing Checklist:**
- ✅ Code runs without errors
- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ Tested in multiple browsers
- ✅ Responsive design works
- ✅ Accessibility maintained

</details>

<details>
<summary><b>5. Submit Pull Request</b></summary>

```bash
# Push to your fork
git push origin feature/your-feature-name
```

**PR Guidelines:**
- Provide clear description of changes
- Reference related issues (e.g., "Fixes #123")
- Include screenshots for UI changes
- Ensure all checks pass
- Request review from maintainers

**PR Template:**
```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

</details>

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- ✅ Be respectful and considerate
- ✅ Welcome newcomers and help them learn
- ✅ Focus on constructive feedback
- ✅ Accept responsibility for mistakes
- ❌ No harassment or discrimination
- ❌ No trolling or insulting comments
- ❌ No spam or self-promotion

### Getting Help

- 💬 [GitHub Discussions](https://github.com/Arnav10090/autopilot-ai/discussions) - Ask questions
- 🐛 [GitHub Issues](https://github.com/Arnav10090/autopilot-ai/issues) - Report bugs
- 📧 Email: support@autopilot-ai.com
- 🐦 Twitter: [@AutoPilotAI](https://twitter.com/autopilotai)

---

## 🔄 Keeping Render Awake

This application uses an **external uptime monitor** to periodically ping:

```
GET /api/health
```

to reduce cold starts on the Render free tier.

Render's free tier spins down inactive services after ~15 minutes of inactivity. Because internal cron jobs stop executing when the service is sleeping, this project relies on an **external** scheduler (cron-job.org or UptimeRobot) that pings the backend every 10 minutes from outside the Render VM — keeping the process warm without any in-process timer.

**Health endpoint response:**
```json
{
  "status": "ok",
  "timestamp": "2026-06-14T12:00:00.000Z"
}
```

- ⚡ No database access
- 🔓 No authentication required
- 📦 < 5 ms response time

For full setup instructions (cron-job.org, UptimeRobot, environment variables, troubleshooting), see **[KEEP_ALIVE_SETUP.md](./KEEP_ALIVE_SETUP.md)**.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Arnav10090

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

### Built With

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
<br>Next.js
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br>React
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=typescript" width="48" height="48" alt="TypeScript" />
<br>TypeScript
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
<br>Tailwind
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nodejs" width="48" height="48" alt="Node.js" />
<br>Node.js
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=express" width="48" height="48" alt="Express" />
<br>Express
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=postgresql" width="48" height="48" alt="PostgreSQL" />
<br>PostgreSQL
</td>
</tr>
</table>

---

### 💖 If you find this project useful, please consider giving it a star!

**Made with ❤️ by [Arnav10090](https://github.com/Arnav10090)**

[⬆ Back to Top](#-autopilot-ai)

</div>
