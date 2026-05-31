# SecureAI Inspector

SecureAI Inspector is a production-ready full-stack web application that performs **passive website security analysis** and explains findings in beginner-friendly language using Claude.

## Project Overview

A user submits a public URL. The app validates and normalizes the URL, blocks local/private targets to prevent SSRF, runs non-intrusive security checks, computes a weighted score, generates AI explanations, and allows download of a PDF report.

This project never performs destructive actions, active exploitation, or penetration testing.

## Features

- Passive website security checks
- Strict URL validation and SSRF protection
- Weighted score engine (0-100)
- Beginner-friendly AI explanations via Anthropic Claude
- Security dashboard with charts and findings table
- Downloadable PDF report
- Local scan history with reopen support
- Friendly error handling for invalid URLs, timeouts, and API failures

## Security Checks Performed

- HTTPS enabled
- HTTP -> HTTPS redirect
- HSTS header
- Content-Security-Policy header
- X-Frame-Options header
- X-Content-Type-Options header
- Referrer-Policy header
- Permissions-Policy header
- Server header exposure
- Cookie security flags (Secure, HttpOnly, SameSite)
- robots.txt availability
- security.txt availability

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- Lucide icons
- Next.js API Routes
- Recharts
- pdf-lib
- Anthropic Claude API

## Project Structure

```text
secure-ai-inspector/
  app/
    api/
      scan/route.ts
      report/route.ts
      generate-pdf/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/
    ui/
    scan-form.tsx
    security-dashboard.tsx
    recent-scans.tsx
  hooks/
    use-scan-history.ts
  lib/
    ssrf.ts
    score.ts
    security-checks.ts
    utils.ts
  services/
    scanner-service.ts
    ai-explainer.ts
    report-service.ts
  api/
    client.ts
  types/
    scan.ts
  public/
  .env.example
  README.md
  package.json
  vercel.json
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create local environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

3. Add your Anthropic key in `.env.local`:

```env
ANTHROPIC_API_KEY=your_real_key_here
NEXT_PUBLIC_APP_NAME=SecureAI Inspector
```

4. Start development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Enter a public URL (http or https)
2. Click **Run Passive Audit**
3. Review:
   - security score and grade
   - pass/fail and severity charts
   - findings table
   - AI explanations
4. Download PDF report
5. Reopen earlier scans from recent history

## Environment Variables

Required:

- `ANTHROPIC_API_KEY`

Optional:

- `NEXT_PUBLIC_APP_NAME` (default: `SecureAI Inspector`)

## Build and Validation

```bash
npm run build
npm run typecheck
```

## Deployment (Vercel)

1. Push repository to GitHub
2. Import repo in Vercel
3. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_APP_NAME` (optional)
4. Deploy

## Screenshots

Add screenshots here after deployment:

- Landing page
- Scan results dashboard
- AI explanation panel
- Downloaded PDF report sample

## Future Enhancements

- Multi-page historical reports
- Team/shared scan history with database storage
- Auth and role-based access
- Scheduled scans and alerts
- Export to JSON/CSV in addition to PDF

## License

MIT