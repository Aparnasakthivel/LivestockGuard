# LivestockGuard AI

A production-ready full-stack platform for Smart India Hackathon 2026.
LivestockGuard AI centralizes livestock monitoring for Antimicrobial Usage (AMU), Maximum Residue Limits (MRL), Withdrawal Period Compliance, Antimicrobial Resistance (AMR), veterinary prescriptions, blockchain traceability, and government monitoring.

## Tech Stack
- Frontend: React, TypeScript, Tailwind CSS, ShadCN-style components, React Router, Recharts, Framer Motion
- Backend: Node.js, Express.js, PostgreSQL
- AI: Python FastAPI, scikit-learn / TensorFlow placeholder
- Authentication: JWT, RBAC
- Storage: AWS S3 / Cloudinary integration placeholder
- Blockchain: Hyperledger Fabric integration stub
- Notifications: Firebase Cloud Messaging, SMS, WhatsApp API placeholders
- Deployment: Docker, AWS EC2, Nginx

## Project Layout
- `frontend/` — React + Tailwind UI
- `backend/` — Express API, JWT auth, PostgreSQL queries
- `ai-service/` — FastAPI microservice for risk prediction
- `db/` — schema and migration assets
- `docker-compose.yml` — local dev orchestration

## Quick Start
1. Copy `.env.example` to `.env` and set environment values.
2. Start PostgreSQL and services:
   ```bash
   docker-compose up --build
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Install backend dependencies:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
5. Start AI service:
   ```bash
   cd ai-service
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8001
   ```

## Notes
- The repository is scaffolded for a government-grade SaaS platform with role-based access for Farmers, Veterinarians, Government Authorities, and Consumers.
- The AI service includes a risk prediction endpoint.
- The backend includes API routes for auth, farms, animals, treatments, analytics, blockchain, reporting, notifications, and QR verification.
- The frontend includes landing page, dashboards, portals, and mobile-ready components.
# LivestockGuard
"# LivestockGuard" 
