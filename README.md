# Lead-IQ — AI-Powered Lead Management & CRM Platform (India Edition)

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)

**Lead-IQ** is a modern, enterprise-grade AI-powered Lead Management and CRM platform designed primarily for high-growth businesses and sales teams in the Indian market. It provides role-isolated workspaces for **Admin**, **Manager**, and **Staff**, featuring speech intelligence via simulated OpenAI Whisper STT, Bayesian neural revenue forecasting (+90 days), multi-channel automation (Email & Telegram), and a persistent floating AI assistant.

---

## 🚀 Key Highlights & Architecture

### 1. Three-Tier Role-Based Security & Workspaces
- **Admin**: Dedicated identity management, user provisioning, role assignments, and system security.
- **Manager**: Complete CRM operations, executive revenue analytics (in `₹`), 90-day AI revenue growth predictions, team conversion leaderboards, and full lead dossiers.
- **Staff**: Opportunity prioritization, Smart Leads ranking, interactive Whisper Audio Call Studio, AI key takeaways, follow-up automations, and call archives.

### 2. Indian Market Localization
- **Currency & Formatting**: Indian Rupees (`₹`) formatted with standard Indian comma grouping (e.g. `₹24,50,000`, `₹5,80,000`, `₹4,50,000`) and chart axes denominated in Lakhs/Crores (`₹2L`, `₹4L`, `₹6L`, `₹24.5L`).
- **Indian Personas & Enterprises**: Realistic B2B accounts across Pune, Mumbai, Nashik, Bengaluru, Nagpur, Hyderabad, and Delhi NCR.
- **Date & Time Standards**: Indian date format (`10 Sep 2026`) and IST timestamps (`10 Sep 2026, 2:30 PM IST`).
- **Business Context**: GST-compliant quotations, official enterprise proposals, and AWS Mumbai data residency context.

### 3. Speech Intelligence & Call Studio
- **Audio Playback**: Simulated multi-frequency waveform visualizer and scrubber.
- **Whisper Speech-to-Text**: Real-time streaming transcription with confidence scoring.
- **AI Synthesis**: Automatic extraction of key takeaways, intent signals, predictive score recalculation, and contact info (including Telegram `@handles`).

### 4. Bayesian Neural Revenue Forecasting
- Multi-factor 90-day predictive curve modeled from closed-won velocity, call momentum, and Bayesian probability intervals with confidence bands.

### 5. Persistent Floating AI Copilot (Bottom-Right)
- Fixed floating assistant available globally across Manager and Staff pages.
- Role-scoped quick suggestion chips and live conversational query engine.
- Renders rich KPI summaries, ranked opportunity cards with `🔥 Hot Lead` tags, and structured data tables.

---

## 🛠️ Quick Demo Credentials

| Role | Name | Email | Default Password | Workspace Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Aditya Mehta | `admin@leadiq.in` | `LeadIQ@2026` | User Provisioning, Access Control, Audit Logs |
| **Manager** | Priya Deshmukh | `manager@leadiq.in` | `LeadIQ@2026` | Financial Analytics, 90-Day AI Forecast, Staff Quotas |
| **Staff** | Sneha Kulkarni | `staff@leadiq.in` | `LeadIQ@2026` | Smart Leads, Whisper Call Studio, Automations |

*(Demo accounts can also be authenticated using the 1-click quick-fill buttons on the login screen).*

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm / pnpm / yarn

### Installation & Local Run
```bash
# Clone the repository
git clone https://github.com/shravanmali/Lead-IQ.git

# Navigate into project directory
cd Lead-IQ

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The application will be live at `http://localhost:5173/`.

### Production Build
```bash
npm run build
```

---

## 🎨 Technology Stack
- **Frontend Framework**: React 19 (TypeScript)
- **Bundler & Tooling**: Vite, TypeScript, Oxlint
- **Icons**: Lucide React
- **Design System**: Vanilla CSS Variables, Glassmorphism, Dark/Light theme switching

---

## 📄 License
MIT License. Created for enterprise lead intelligence and sales operations.
