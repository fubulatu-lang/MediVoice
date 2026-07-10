
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
Deployment
bash
# Deploy frontend to Vercel
vercel --prod

# Deploy backend (Docker)
docker build -t medivoice-api ./server
docker run -p 8000:8000 medivoice-api
📁 Project Structure
text
medivoice/
├── client/          # React PWA Frontend
├── server/          # FastAPI Backend  
├── docs/            # Documentation
└── scripts/         # Utility scripts
🔒 Security & HIPAA Compliance
Zero persistent storage of patient data

End-to-end TLS 1.3 encryption

Automatic session timeouts (10 min)

Volatile memory processing only

PHI detection and scrubbing

Audit logging for compliance

🗺️ Roadmap
Phase 1: MVP (Current)
Basic recording and transcription

SOAP note formatting

Simple copy-to-clipboard

Email/password auth

Phase 2: Enhanced
Multiple clinical templates

Offline recording support

Background recording

Confidence highlighting

Phase 3: Enterprise
HL7 FHIR integration

EMR webhooks

Team collaboration

Custom templates

🤝 Contributing
See CONTRIBUTING.md for guidelines.

📄 License
This project is licensed under the MIT License - see LICENSE file.

⚠️ Disclaimer
This software is provided as-is. Ensure compliance with local healthcare regulations (HIPAA, GDPR, etc.) before using in production with real patient data.

🙏 Acknowledgments
Material Design 3 for the UI framework

OpenAI/AWS/Google for STT and LLM capabilities

The medical community for inspiration
