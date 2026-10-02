<div align="center">

# 🛡️ CypherLog

### Multi-Branch Security Monitoring & AI Incident Response

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A real-time SOC (Security Operations Center) dashboard for monitoring security events across multiple branch offices. Features AI-powered incident analysis, blockchain-anchored log verification, and cross-branch threat correlation.

</div>

---

## ✨ Features

- **🗺️ Live Branch Network Map** — Interactive map of India showing all branch offices with real-time status indicators and log flow visualization
- **🤖 AI-Powered Analysis** — Claude AI integration for automated incident triage, risk assessment, and plain-English briefings
- **🔗 Blockchain Log Verification** — Every log write and action is anchored on a private blockchain for tamper-evident audit trails
- **📊 Smart Incident Grouping** — Raw log lines are automatically grouped into actionable incidents with ML-generated risk scores
- **🔍 Cross-Branch Correlation** — Detects similar attack patterns appearing across multiple branches simultaneously
- **⏱️ SLA Countdown Timers** — Real-time countdown showing remaining time for first response on each incident
- **👥 Role-Based Access** — Three roles (Analyst, Admin, Read-only Auditor) with appropriate permissions
- **🌗 Dark/Light Theme** — Toggle between dark and light modes
- **📋 Compliance Reports** — One-click export of chain-of-custody compliance reports
- **📂 Log Explorer** — Full-text search and filter across the raw log stream
- **🗓️ Incident Heatmap** — 30-day visual heatmap of incident density
- **🔄 Branch Comparison** — Side-by-side comparison of any two branches

---

## 📸 Overview

| Feature | Description |
|---------|-------------|
| **Dashboard** | Real-time KPIs, branch map, live log feed, and grouped incidents |
| **Incident Drawer** | Deep-dive into any incident with behavior chain, evidence, AI analysis, and response actions |
| **Log Explorer** | Filter and search raw logs by branch, severity, and keyword |
| **Blockchain Ledger** | View recent blocks, transaction counts, and verification timestamps |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (v9 or later)
- An [Anthropic API key](https://console.anthropic.com/) (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/navaneethakrishnan-web/CypherLog.git
   cd CypherLog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Anthropic API key:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

---

## 🏗️ Project Structure

```
CypherLog/
├── public/                  # Static assets
├── src/
│   ├── main.jsx            # React entry point
│   └── App.jsx             # Main dashboard component
├── .env.example            # Environment variable template
├── .gitignore              # Git ignore rules
├── .firebaserc             # Firebase project config
├── firebase.json           # Firebase hosting config
├── index.html              # HTML entry point
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_ANTHROPIC_API_KEY` | Yes (for AI) | Anthropic API key for Claude-powered incident analysis and briefings |
| `VITE_FIREBASE_API_KEY` | No | Firebase API key (only for deployment) |
| `VITE_FIREBASE_PROJECT_ID` | No | Firebase project ID (only for deployment) |

> **⚠️ Important:** Never commit your `.env` file. Use `.env.example` as a template.

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on `localhost:5173` |
| `npm run build` | Build for production to `dist/` |
| `npm run preview` | Preview production build locally |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 with Hooks
- **Build Tool:** Vite 5
- **Charts:** Recharts
- **Icons:** Lucide React
- **AI:** Anthropic Claude API
- **Hosting:** Firebase Hosting
- **Fonts:** Inter, JetBrains Mono, Manrope (Google Fonts)

---

## 🔐 Security Notes

- This is a **prototype/demonstration** interface with mock data
- The blockchain verification and IPFS references are simulated for demo purposes
- In production, API calls to Anthropic should be proxied through a backend to protect API keys
- Role-based access control is client-side only in this demo

---

## 🚀 Deployment

### Firebase Hosting

```bash
npm run build
npx firebase deploy --only hosting
```

### Other Platforms

The `dist/` folder after `npm run build` can be deployed to any static hosting provider (Vercel, Netlify, etc.)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for security operations teams**

</div>
