# SecureAI Inspector - Quick Reference

## 🚀 Getting Started (2 minutes)

### Windows
```powershell
cd "c:\Users\ADMIN\OneDrive\mini project\mini project\ciphersense"
.\SETUP.bat
```

### macOS / Linux
```bash
cd path/to/secure-ai-inspector
chmod +x SETUP.sh
./SETUP.sh
```

### Manual Setup
```bash
npm install
npm run build
```

## 🔑 Environment Setup

Create `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-your-key
NEXT_PUBLIC_APP_NAME=SecureAI Inspector
```

Get API key: https://console.anthropic.com/account/keys

## 📦 NPM Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Type checking |

## 📁 Project Structure After Setup

```
app/
├── api/
│   ├── scan/route.ts
│   └── generate-pdf/route.ts
├── page.tsx
├── layout.tsx
└── globals.css

components/
├── scan-form.tsx
├── security-dashboard.tsx
└── recent-scans.tsx

types/
└── scan.ts

public/
└── favicon.ico
```

## 🔍 Security Checks

- HTTPS enabled
- HSTS header
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Server header exposure
- Secure cookies
- Security.txt

## 📊 Scoring System

| Score | Rating | Color |
|-------|--------|-------|
| 80-100 | Excellent | Green |
| 60-79 | Good | Yellow |
| 40-59 | Fair | Orange |
| 0-39 | Poor | Red |

## 🌐 API Endpoints

### Scan Website
```
POST /api/scan
Content-Type: application/json

{
  "url": "https://example.com"
}
```

### Generate PDF
```
POST /api/generate-pdf
Content-Type: application/json

{
  "id": "...",
  "url": "...",
  "score": 85,
  ...
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy (automatic)

### Docker
```bash
docker build -t secure-ai-inspector .
docker run -e ANTHROPIC_API_KEY=sk-ant-... -p 3000:3000 secure-ai-inspector
```

### Self-Hosted
1. Install Node.js 18+
2. Install dependencies
3. Build: `npm run build`
4. Start: `npm start`
5. Setup reverse proxy (Nginx)

## 🔗 Key Links

- 📖 [README.md](README.md) - Full documentation
- 🛠️ [INSTALLATION.md](INSTALLATION.md) - Setup guide
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment options
- 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) - Contributing guide
- 📋 [CHECKLIST.md](CHECKLIST.md) - Completion checklist

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies |
| `tsconfig.json` | TypeScript |
| `tailwind.config.js` | Styling |
| `next.config.ts` | Next.js |
| `vercel.json` | Vercel |
| `.env.example` | Environment template |

## 📱 Responsive Breakpoints

- 📱 Mobile: 0-640px
- 📱 Tablet: 641-1024px
- 🖥️ Desktop: 1025px+

## 🎨 Theme Colors

| Use | Color | Value |
|-----|-------|-------|
| Primary | Cyan | #00d4ff |
| Secondary | Purple | #a855f7 |
| Success | Green | #00ff41 |
| Warning | Yellow | #eab308 |
| Error | Red | #dc2626 |
| Background | Dark | #0f172a |

## 🔒 Security Features

✅ SSRF Prevention  
✅ Input Sanitization  
✅ URL Validation  
✅ No Hardcoded Secrets  
✅ Safe Error Messages  
✅ HTTPS Recommended  

## 📊 Performance Targets

- Build Time: 30-60 sec
- API Response: <5 sec
- First Paint: <1 sec
- Lighthouse: 90+

## 🐛 Troubleshooting

### npm not found
Install Node.js: https://nodejs.org

### API key error
Check `.env.local` has `ANTHROPIC_API_KEY`

### Port 3000 in use
```bash
PORT=3001 npm run dev
```

### Build fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Documentation

- **README.md** - Main overview
- **INSTALLATION.md** - Setup steps
- **DEPLOYMENT.md** - Hosting guide
- **CONTRIBUTING.md** - Contribution guidelines
- **CHANGELOG.md** - Version history
- **CHECKLIST.md** - Completion status
- **PROJECT-SUMMARY.md** - Project details

## ⏱️ Typical Timings

| Task | Time |
|------|------|
| Setup | 2-5 min |
| First build | 30-60 sec |
| Dev server start | 5 sec |
| Scan | <5 sec |
| PDF generation | <2 sec |
| Deploy | 5-10 min |

## 🎯 Next Steps

1. ✅ Run setup script
2. ✅ Create `.env.local`
3. ✅ Start dev server (`npm run dev`)
4. ✅ Open http://localhost:3000
5. ✅ Test scan with example URL
6. ✅ Generate PDF report
7. ✅ Review scan history
8. 🚀 Deploy to production

## 💡 Tips

- Use example URLs for testing
- Check browser console for errors
- Monitor API responses in Network tab
- Test on mobile devices
- Review security headers in DevTools
- Keep API key secure
- Rotate API keys regularly
- Monitor error rates after deployment

## 🆘 Getting Help

1. Check README.md
2. Search GitHub issues
3. Create GitHub discussion
4. Review documentation
5. Check error logs

## 📞 Support

- GitHub Issues: Bug reports
- GitHub Discussions: Questions
- Email: [Add support email]
- Twitter: [Add Twitter]

---

**Version**: 1.0.0  
**Status**: Production Ready  
**Last Updated**: 2024  
**License**: MIT  

📖 See full documentation in README.md
