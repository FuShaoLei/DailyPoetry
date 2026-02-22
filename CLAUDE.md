# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DailyPoetry (每日诗词) is a Vue 3 application that displays daily Chinese poetry. This is a simple Vite-based project designed for deployment to GitHub Pages.

## Development Commands

```sh
# Install dependencies
npm install

# Development server with hot-reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Architecture

This is a minimal Vue 3 + Vite project:

- **Build tool**: Vite 7.x with Vue 3 plugin
- **Entry point**: `src/main.js` - creates and mounts the Vue app
- **Root component**: `src/App.vue` - main application component
- **Configuration**: `vite.config.js` - includes path alias (`@` → `src/`), Vue DevTools plugin, and environment-based base path for deployment

### Environment Configuration

The project uses `.env` for environment variables:
- `VITE_APP_TITLE` - Application title (displayed in HTML)
- `VITE_PUBLISH_PATH` - Base path for deployment (e.g., `/DailyPoetry/` for GitHub Pages)

### GitHub Pages Deployment

The `.github/workflows/fuck.yml` workflow automatically builds and deploys to GitHub Pages on push to the `master` branch.

**GitHub Pages Settings:**
- Settings → Pages → Source: "GitHub Actions" (not a branch)

**Deployment requirements:**
- Ensure `VITE_PUBLISH_PATH` in `.env` matches your repository name
- The workflow uses Node 20 and runs `npm ci`, `npm run build`, then deploys the `./dist` directory

## Project Structure

```
/
├── src/
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
├── public/              # Static assets
├── index.html           # HTML template (uses %VITE_APP_TITLE%)
├── vite.config.js       # Vite configuration
└── .env                 # Environment variables
```
