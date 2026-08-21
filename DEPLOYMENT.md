# AI Customer Support Coaching Assistant - Cloud & Render Deployment Guide

This guide details step-by-step instructions to deploy the **AI Customer Support Coaching Assistant** on **Render** and other cloud platforms.

---

## 🚀 Recommended: 1-Service Unified Deployment on Render

In unified deployment mode, Render builds the React frontend into `frontend/dist` and runs the Flask backend via Gunicorn on a single URL (`https://your-app.onrender.com`). This serves the entire Single Page Application (SPA) alongside all Multi-Agent APIs on one port with **zero CORS issues**.

### Step 1: Push Code to GitHub
Ensure all changes are committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Prepare AI Customer Support Assistant for Render deployment"
git push origin main
```
> [!NOTE]
> `.gitignore` is already configured so `.env` and sensitive API keys will **never** be uploaded.

---

### Step 2: Create Web Service on Render

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub repository.
4. Fill in the exact settings below:

| Setting Field | Value |
| :--- | :--- |
| **Name** | `ai-customer-support-assistant` (or your preferred name) |
| **Language / Environment** | **Python** |
| **Region** | Oregon (US West) or closest region |
| **Branch** | `main` |
| **Root Directory** | *(Leave blank - uses project root)* |
| **Build Command** | `npm --prefix frontend install && npm --prefix frontend run build && pip install -r requirements.txt` |
| **Start Command** | `gunicorn --chdir backend app:app --workers 1 --threads 4 --timeout 120 --bind 0.0.0.0:$PORT` |
| **Instance Type** | **Free** (or Starter) |

---

### Step 3: Add Environment Variables on Render

Under the **Environment Variables** section in Render, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `PYTHON_VERSION` | `3.11.9` | Ensures Python 3.11 runtime |
| `OPENROUTER_API_KEY` | `sk-or-v1-xxxxxxxx...` | Your OpenRouter API key |
| `MODEL_NAME` | `nvidia/nemotron-3-nano-30b-a3b:free` | Primary LLM model for agents |

5. Click **Create Web Service**.
6. Render will automatically build the React frontend, install Python dependencies, and launch Gunicorn. Your app will be live at `https://<your-app-name>.onrender.com`!

---

## ⚡ Option 2: Render Blueprint (Infrastructure as Code)

If you prefer 1-click infrastructure deployment:
1. In Render, click **New +** $\rightarrow$ **Blueprint**.
2. Select your repository.
3. Render will read [`render.yaml`](file:///C:/Users/HP/Documents/AI_Customer_Support_Coaching_Assistant/render.yaml) automatically.
4. Input your `OPENROUTER_API_KEY` when prompted and click **Apply**.

---

## 🌐 Option 3: Separated Deployment (Static Site + Web Service API)

If you prefer hosting the Frontend and Backend as two separate Render services:

### 1. Backend Service (Render Web Service)
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app --workers 1 --threads 4 --timeout 120 --bind 0.0.0.0:$PORT`
- **Environment Variables**:
  - `PYTHON_VERSION`: `3.11.9`
  - `OPENROUTER_API_KEY`: `your_openrouter_api_key`
  - `MODEL_NAME`: `nvidia/nemotron-3-nano-30b-a3b:free`
- Note your backend URL (e.g., `https://my-backend-api.onrender.com`).

### 2. Frontend Service (Render Static Site)
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: `https://my-backend-api.onrender.com`

---

## 💻 Local Testing & Verification

### Run Unified Production Server Locally
```powershell
# 1. Build frontend bundle
cd C:\Users\HP\Documents\AI_Customer_Support_Coaching_Assistant\frontend
npm run build

# 2. Start unified server
cd C:\Users\HP\Documents\AI_Customer_Support_Coaching_Assistant\backend
.\.venv\Scripts\Activate.ps1
python app.py
```
> Open **`http://localhost:5000`** in your browser. All pages (Dashboard, Live Coaching Copilot, Knowledge Base Explorer, Audit Reports, Real-Time Analytics, Platform Settings) are completely functional.

---

## 📁 Key Deployment Files Reference

- [`.gitignore`](file:///C:/Users/HP/Documents/AI_Customer_Support_Coaching_Assistant/.gitignore) - Comprehensive exclusion of secrets, `.env`, `.venv`, and temporary files.
- [`render.yaml`](file:///C:/Users/HP/Documents/AI_Customer_Support_Coaching_Assistant/render.yaml) - Infrastructure-as-code configuration for Render Blueprints.
- [`Procfile`](file:///C:/Users/HP/Documents/AI_Customer_Support_Coaching_Assistant/Procfile) - Cloud process specification for Gunicorn.
- [`requirements.txt`](file:///C:/Users/HP/Documents/AI_Customer_Support_Coaching_Assistant/requirements.txt) - Root dependencies including Gunicorn, Flask, and ChromaDB/RAG packages.
- [`backend/requirements.txt`](file:///C:/Users/HP/Documents/AI_Customer_Support_Coaching_Assistant/backend/requirements.txt) - Backend requirements file.
- [`backend/.env.example`](file:///C:/Users/HP/Documents/AI_Customer_Support_Coaching_Assistant/backend/.env.example) - Template for required environment variables.
- [`frontend/src/services/api.js`](file:///C:/Users/HP/Documents/AI_Customer_Support_Coaching_Assistant/frontend/src/services/api.js) - Dynamic API URL handler supporting both relative single-port routing and `VITE_API_BASE_URL`.
