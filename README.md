# 🎤 MediVoice - Clinical Voice-to-Text Notes

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A highly secure Progressive Web App (PWA) designed to alleviate administrative burden on clinicians by capturing voice dictations and automatically structuring them into standard clinical formats (SOAP notes, consultation notes, etc.).

## 🏗️ Architecture
┌─────────────────┐ ┌──────────────┐ ┌─────────────┐
│ React PWA │────▶│ FastAPI │────▶│ STT Engine │
│ (Mobile/Web) │◀────│ Backend │◀────│ (Medical) │
└─────────────────┘ └──────────────┘ └─────────────┘
│
▼
┌──────────────┐
│ LLM Engine │
│ (GPT-4/etc) │
└──────────────┘

text

## ✨ Features (MVP)

- 🎙️ One-tap medical dictation recording
- 🏥 Medical-grade speech-to-text transcription
- 📋 Automatic SOAP note formatting
- 📱 Mobile-first Progressive Web App
- 🔒 Zero-retention data processing
- 📋 Smart copy-to-clipboard for EMRs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL (or Neon.tech account)
- STT API key (AWS/Google/OpenAI)
- LLM API key (Azure OpenAI/AWS Bedrock)

### Local Development

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/medivoice.git
cd medivoice

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys

# Backend setup
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements/dev.txt
uvicorn app.main:app --reload

# Frontend setup (new terminal)
cd client
npm install
npm run dev

# Visit http://localhost:5173
