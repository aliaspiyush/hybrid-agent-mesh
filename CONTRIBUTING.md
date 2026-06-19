# Contributing to Hybrid Agent Mesh

Thank you for your interest in contributing to Hybrid Agent Mesh! We welcome community contributions to make this platform even better.

## Project Architecture

Hybrid Agent Mesh is a Next.js 15 App Router project. State is managed entirely via Zustand, simulating live venue data through a deterministic "scenario clock" rather than relying on a backend.

### Gemini API Integration
This project now features real AI integration via the `@google/generative-ai` SDK.
We have an AI mode switch:
- **Mock Mode** (`NEXT_PUBLIC_AI_MODE=mock`): Uses the default deterministic logic from the original mock agents.
- **Live Mode** (`NEXT_PUBLIC_AI_MODE=live`): Calls our Next.js API routes which then communicate securely with the Gemini API to provide smart, context-aware insights.

**Important:** Never commit your `GEMINI_API_KEY`! Use `.env.local` for local development.

## Development Workflow

1. **Fork & Clone:** Fork the repository and clone it to your local machine.
2. **Install Dependencies:** Run `npm install` to install all necessary packages.
3. **Environment Setup:** 
   - Copy `.env.example` to `.env.local`.
   - Add your Gemini API key: `GEMINI_API_KEY=your_key_here`.
   - Set `NEXT_PUBLIC_AI_MODE=live` if you want to test the AI features.
4. **Run Dev Server:** `npm run dev` starts the application on `localhost:3000`.

## Code Style & Conventions

- **TypeScript:** We use strict TypeScript. Please ensure your code passes `npm run type-check` before opening a pull request.
- **Styling:** We use CSS Modules. Avoid introducing Tailwind CSS or other utility frameworks to keep the project consistent.
- **Linting:** Run `npm run lint` and fix any warnings or errors. `npm run lint:fix` can help resolve formatting issues automatically.

## Submitting a Pull Request

- Create a descriptive branch name (e.g. `feat/add-new-kpi`).
- Ensure all CI checks (linting, type-check, and build) pass.
- Write a clear PR description explaining what changes were made and why.
- If your change affects the AI integration, please mention it explicitly.

Thank you!
