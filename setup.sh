#!/bin/bash
# SecureAI Inspector - Project Setup Script

echo "🔧 Setting up SecureAI Inspector project structure..."

# Create app directory structure
mkdir -p app/api/scan
mkdir -p app/api/generate-pdf
mkdir -p components
mkdir -p lib
mkdir -p types
mkdir -p hooks
mkdir -p services
mkdir -p public

# Move layout and page files
mv layout.tsx app/ 2>/dev/null || echo "Layout file handling..."
mv page.tsx app/ 2>/dev/null || echo "Page file handling..."
mv globals.css app/ 2>/dev/null || echo "Globals CSS handling..."

# Move components
mv scan-form.tsx components/ 2>/dev/null || echo "Scan form handling..."
mv security-dashboard.tsx components/ 2>/dev/null || echo "Dashboard handling..."
mv recent-scans.tsx components/ 2>/dev/null || echo "Recent scans handling..."

# Move API routes
mv api-scan-route.ts app/api/scan/route.ts 2>/dev/null || echo "Scan route handling..."
mv api-pdf-route.ts app/api/generate-pdf/route.ts 2>/dev/null || echo "PDF route handling..."

# Move types
mv scan-types.ts types/scan.ts 2>/dev/null || echo "Types handling..."

# Move public assets
mv favicon.ico public/ 2>/dev/null || echo "Favicon handling..."

echo "✅ Project structure created!"
echo "📦 Installing dependencies..."
npm install

echo "🔨 Building project..."
npm run build

echo "✨ Setup complete!"
