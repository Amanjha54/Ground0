# Ground0 Deployment Guide (Vercel & Render)

This project contains two primary services:
1. **Web Frontend (`apps/web`)**: Next.js 14 App Router, Three.js, MapLibre GL, Tailwind CSS.
2. **AI Service (`apps/ai-service`)**: Python 3.11 FastAPI service powering multimodal verification and computer vision.

---

## Option A: Deploy on Vercel (Recommended for Web Frontend)

Vercel is the optimal host for the **Next.js frontend** (`apps/web`).

### Step-by-Step Vercel Setup:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** → **"Project"**.
2. Select your `Ground0` GitHub repository.
3. Configure the **Project Settings**:
   * **Root Directory**: Click **Edit** and set to `apps/web`.
   * **Include source files outside of Root Directory**: Keep **CHECKED** (required for monorepo workspace packages `@ground0/types` and `@ground0/config`).
   * **Framework Preset**: **Next.js** *(auto-detected)*.
   * **Build and Output Settings**: Leave all toggles **OFF** (Vercel uses defaults: `next build` & `.next`).
4. **Environment Variables**:
   Add the following in the Vercel Environment Variables section:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   * `SUPABASE_URL`
   * `SUPABASE_SECRET_KEY`
   * `GEMINI_API_KEY`
   * `NEXT_PUBLIC_MAPTILER_KEY`
   * `AI_SERVICE_URL` *(URL of your deployed AI service, or keep empty if running mock)*
   * `NEXT_PUBLIC_APP_URL` *(e.g. `https://ground0.vercel.app`)*
5. Click **Deploy**.

---

## Option B: Deploy on Render (1-Click Blueprint for Full Stack)

Render can run both the **Next.js Web frontend** AND the **Python AI backend** together.

### Method 1: Using the Render Blueprint (`render.yaml`)
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **"New +"** → **"Blueprint"**.
3. Connect your `Ground0` repository.
4. Render will read [`render.yaml`](../render.yaml) and automatically create:
   * `ground0-ai-service` (Python FastAPI service)
   * `ground0-web` (Next.js web service)
5. Fill in the requested secret keys (`GEMINI_API_KEY`, Supabase keys) and click **Apply**.

---

### Method 2: Manual Service Creation on Render

#### 1. Python AI Service (`apps/ai-service`)
* **Service Type**: Web Service
* **Runtime**: Python 3
* **Root Directory**: `apps/ai-service`
* **Build Command**: `pip install -r requirements.txt`
* **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
* **Health Check Path**: `/health`
* **Environment Variables**:
  * `GEMINI_API_KEY`
  * `SUPABASE_URL`
  * `SUPABASE_SECRET_KEY`

#### 2. Next.js Web App (`apps/web`)
* **Service Type**: Web Service
* **Runtime**: Node
* **Root Directory**: Leave blank (root `.`)
* **Build Command**: `npm install && npm run build --workspace=@ground0/web`
* **Start Command**: `npm run start --workspace=@ground0/web`
* **Health Check Path**: `/`
* **Environment Variables**:
  * `NEXT_PUBLIC_SUPABASE_URL`
  * `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  * `NEXT_PUBLIC_MAPTILER_KEY`
  * `GEMINI_API_KEY`
  * `AI_SERVICE_URL` *(set to the URL of the AI service above)*
