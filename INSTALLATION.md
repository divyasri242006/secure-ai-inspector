# SecureAI Inspector - Installation & Setup Guide

## Prerequisites

- **Node.js 18+** - Download from https://nodejs.org
- **npm 9+** - Comes with Node.js
- **Git** - For version control
- **Anthropic API Key** - Get from https://console.anthropic.com

## Quick Start (Automated)

### Windows Users

1. **Navigate to project directory**
```powershell
cd path\to\secure-ai-inspector
```

2. **Run setup script**
```powershell
.\SETUP.bat
```

3. **Create .env.local file**
```powershell
Copy-Item .env.example .env.local
```

4. **Edit .env.local** and add your API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

5. **Start development server**
```powershell
npm run dev
```

### macOS / Linux Users

1. **Navigate to project directory**
```bash
cd path/to/secure-ai-inspector
```

2. **Make setup script executable**
```bash
chmod +x SETUP.sh
```

3. **Run setup script**
```bash
./SETUP.sh
```

4. **Create .env.local file**
```bash
cp .env.example .env.local
```

5. **Edit .env.local** and add your API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

6. **Start development server**
```bash
npm run dev
```

## Manual Setup (If Automated Setup Fails)

### Step 1: Create Project Structure

```bash
mkdir -p app/api/scan
mkdir -p app/api/generate-pdf
mkdir -p components
mkdir -p lib
mkdir -p public
mkdir -p types
```

### Step 2: Organize Files

Move the created files to their correct locations:

```
layout.tsx → app/layout.tsx
page.tsx → app/page.tsx
globals.css → app/globals.css
scan-form.tsx → components/scan-form.tsx
security-dashboard.tsx → components/security-dashboard.tsx
recent-scans.tsx → components/recent-scans.tsx
scan-route.ts → app/api/scan/route.ts
pdf-route.ts → app/api/generate-pdf/route.ts
scan-types.ts → types/scan.ts
favicon.ico → public/favicon.ico
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment

Create `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
NEXT_PUBLIC_APP_NAME=SecureAI Inspector
```

### Step 5: Verify Installation

```bash
npm run type-check
npm run lint
```

### Step 6: Build Project

```bash
npm run build
```

If the build succeeds, you're ready!

## Development

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Type check with TypeScript
```

## Troubleshooting

### Issue: "npm: command not found"

**Solution:** Install Node.js from https://nodejs.org

```bash
# Verify installation
node --version
npm --version
```

### Issue: "ANTHROPIC_API_KEY not found"

**Solution:** Create and configure .env.local

```bash
# Create from template
cp .env.example .env.local

# Add your API key
# Open .env.local and set:
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your API key from: https://console.anthropic.com

### Issue: "Build fails with TypeScript errors"

**Solution:** Check TypeScript configuration

```bash
# Type check
npm run type-check

# Fix common issues
npm install --save-dev @types/node @types/react @types/react-dom

# Rebuild
npm run build
```

### Issue: "Port 3000 already in use"

**Solution:** Use a different port

```bash
# macOS / Linux
PORT=3001 npm run dev

# Windows (PowerShell)
$env:PORT=3001; npm run dev

# Windows (Command Prompt)
set PORT=3001& npm run dev
```

Then visit http://localhost:3001

### Issue: "Module not found" errors

**Solution:** Reinstall dependencies

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: "PDF generation fails"

**Solution:** Ensure pdf-lib is installed

```bash
npm install pdf-lib --save
npm run build
```

### Issue: "Scan timeout or network error"

**Possible causes:**
- Target website is down
- Network connectivity issue
- Firewall blocking requests

**Solution:**
- Try a different website
- Check internet connection
- Allow outbound HTTPS requests in firewall

## Project Structure After Setup

```
secure-ai-inspector/
├── app/
│   ├── api/
│   │   ├── scan/
│   │   │   └── route.ts          # Scan API endpoint
│   │   └── generate-pdf/
│   │       └── route.ts          # PDF generation endpoint
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── scan-form.tsx             # URL input form
│   ├── security-dashboard.tsx    # Results dashboard
│   └── recent-scans.tsx          # Scan history
├── types/
│   └── scan.ts                   # TypeScript types
├── public/
│   └── favicon.ico               # App icon
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind CSS config
├── next.config.ts                # Next.js config
├── .env.example                  # Environment template
├── .env.local                    # Your configuration (NOT IN GIT)
├── .gitignore                    # Git ignore rules
├── README.md                     # Project documentation
└── SETUP.bat / SETUP.sh          # Setup scripts
```

## Environment Variables

### Required

```
ANTHROPIC_API_KEY=sk-ant-v0-...
```

Generate a key at: https://console.anthropic.com/account/keys

### Optional

```
NEXT_PUBLIC_APP_NAME=SecureAI Inspector
```

## Next Steps

1. ✅ Installation complete
2. 📝 Start development server: `npm run dev`
3. 🌐 Open http://localhost:3000
4. 🔍 Try scanning a website
5. 🚀 Deploy to Vercel (see DEPLOYMENT.md)

## Getting Help

- Check the README.md for features and usage
- Review the troubleshooting section above
- Open an issue on GitHub
- Consult Next.js documentation: https://nextjs.org/docs

## Notes

- `.env.local` is gitignored - never commit API keys
- First build may take 30-60 seconds
- Development server auto-reloads on file changes
- Check the browser console for client-side errors
- Check terminal output for server errors

Happy scanning! 🔒
