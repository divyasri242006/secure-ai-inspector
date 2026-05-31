# SecureAI Inspector - Deployment Guide

## Vercel Deployment (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Prerequisites

- GitHub account
- Vercel account (free)
- Project pushed to GitHub

### Step 1: Push Project to GitHub

```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SecureAI Inspector"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/secure-ai-inspector.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Visit Vercel**
   - Go to https://vercel.com/new
   - Click "Continue with GitHub"

2. **Select Repository**
   - Find `secure-ai-inspector`
   - Click "Import"

3. **Configure Project**
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Set Environment Variables**
   - Add `ANTHROPIC_API_KEY` from your Anthropic account
   - Add `NEXT_PUBLIC_APP_NAME=SecureAI Inspector` (optional)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Step 3: Access Your App

Your app will be available at: `https://secure-ai-inspector-[random].vercel.app`

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as shown in Vercel

## Docker Deployment

### Build Docker Image

```bash
# Create Dockerfile
# (Dockerfile content below)

# Build image
docker build -t secure-ai-inspector:latest .

# Run container
docker run -e ANTHROPIC_API_KEY=sk-ant-... -p 3000:3000 secure-ai-inspector:latest
```

### Dockerfile Template

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build app
COPY . .
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
```

### Push to Docker Hub

```bash
# Tag image
docker tag secure-ai-inspector:latest USERNAME/secure-ai-inspector:latest

# Login to Docker
docker login

# Push image
docker push USERNAME/secure-ai-inspector:latest
```

### Run on Other Services

- **AWS ECS**: Push to ECR, create task definition
- **Google Cloud Run**: `gcloud run deploy secure-ai-inspector --image gcr.io/...`
- **Azure Container Instances**: Use Azure CLI or portal
- **DigitalOcean App Platform**: Connect GitHub repository

## Self-Hosted (VPS/Server)

### Prerequisites

- Node.js 18+ installed
- PM2 (process manager): `npm install -g pm2`
- Nginx or Apache (reverse proxy)
- SSL certificate (Let's Encrypt)

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/secure-ai-inspector.git
cd secure-ai-inspector

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "secure-ai" -- start

# Save PM2 config
pm2 save

# Start on reboot
pm2 startup
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Get SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

## Environment Variables for Production

### Vercel / Hosted Services

Set these in your deployment platform's environment variables section:

```
ANTHROPIC_API_KEY=sk-ant-your-key
NEXT_PUBLIC_APP_NAME=SecureAI Inspector
NODE_ENV=production
```

### Self-Hosted

Create `.env.production.local`:

```
ANTHROPIC_API_KEY=sk-ant-your-key
NEXT_PUBLIC_APP_NAME=SecureAI Inspector
NODE_ENV=production
```

**Never commit this file to Git!**

## Performance Optimization

### Build Optimization

```bash
# Production build
npm run build

# Check bundle size
npm install -g @next/bundle-analyzer

# Analyze
ANALYZE=true npm run build
```

### Deployment Checklist

- [ ] Set environment variables
- [ ] Run production build locally
- [ ] Test all features
- [ ] Check security headers
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test error pages
- [ ] Verify API connectivity
- [ ] Load test

## Monitoring & Maintenance

### Vercel Monitoring

- Analytics Dashboard in Vercel console
- Edge Function performance
- Build history

### Self-Hosted Monitoring

```bash
# Monitor with PM2
pm2 monit

# View logs
pm2 logs secure-ai

# Check status
pm2 status
```

### Uptime Monitoring

- UptimeRobot (free)
- Statuspages.io
- Better Uptime

### Error Tracking

- Sentry (error tracking)
- LogRocket (session replay)
- Datadog (monitoring)

## Scaling

### Vercel (Automatic)

- Auto-scaling with global CDN
- Unlimited deployments
- No configuration needed

### Self-Hosted Scaling

1. **Horizontal Scaling**
   - Run multiple instances
   - Use load balancer (Nginx, HAProxy)
   - Share data via database

2. **Caching**
   - Use Redis for scan results
   - CDN for static assets
   - Browser caching

3. **Database** (If needed)
   - PostgreSQL for scan history
   - MongoDB for scan reports

## Security Best Practices

1. **API Keys**
   - Use environment variables
   - Rotate keys regularly
   - Use restricted API keys

2. **HTTPS**
   - Always enable SSL/TLS
   - Use strong certificates
   - Set HSTS headers

3. **Headers**
   - Content-Security-Policy
   - X-Frame-Options
   - X-Content-Type-Options

4. **Rate Limiting**
   - Limit API requests per IP
   - Implement request throttling

5. **Logging**
   - Monitor access logs
   - Track errors
   - Audit changes

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Build again
npm run build
```

### App Won't Start

```bash
# Check errors
npm run dev

# Verify environment variables
echo $ANTHROPIC_API_KEY

# Check port
lsof -i :3000
```

### Slow Performance

```bash
# Analyze bundle
ANALYZE=true npm run build

# Check API response times
# Look for slow endpoints in logs
```

## Rollback / Downgrade

### Vercel

1. Go to Deployments
2. Click three dots on a previous deployment
3. Select "Promote to Production"

### Self-Hosted

```bash
# Stop current version
pm2 stop secure-ai

# Checkout previous version
git checkout previous-commit-hash

# Rebuild and start
npm install
npm run build
pm2 start secure-ai
```

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Docker Docs**: https://docs.docker.com

---

**Deployment Type Comparison**

| Feature | Vercel | Docker | Self-Hosted |
|---------|--------|--------|-------------|
| Setup Time | <5 min | ~15 min | ~30 min |
| Cost | Free tier available | Container registry cost | VPS cost |
| Scaling | Automatic | Manual | Manual |
| Maintenance | None | Minimal | Full |
| Performance | Excellent | Good | Varies |
| Global CDN | Yes | Optional | Optional |

**Recommendation**: Start with Vercel for quick deployment, then migrate to self-hosted if needed.
