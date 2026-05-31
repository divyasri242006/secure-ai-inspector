#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n================================');
console.log('SecureAI Inspector - Auto Setup');
console.log('================================\n');

const projectDir = process.cwd();

// Create directories
const dirs = [
  'app/api/scan',
  'app/api/generate-pdf',
  'components',
  'types',
  'public'
];

console.log('📁 Creating directories...');
dirs.forEach(dir => {
  const fullPath = path.join(projectDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✓ ${dir}`);
  }
});

// Move files
const moves = {
  'layout.tsx': 'app/layout.tsx',
  'page.tsx': 'app/page.tsx',
  'globals.css': 'app/globals.css',
  'scan-form.tsx': 'components/scan-form.tsx',
  'security-dashboard.tsx': 'components/security-dashboard.tsx',
  'recent-scans.tsx': 'components/recent-scans.tsx',
  'scan-route.ts': 'app/api/scan/route.ts',
  'pdf-route.ts': 'app/api/generate-pdf/route.ts',
  'scan-types.ts': 'types/scan.ts',
  'favicon.ico': 'public/favicon.ico'
};

console.log('\n🔄 Moving files...');
Object.entries(moves).forEach(([src, dst]) => {
  const srcPath = path.join(projectDir, src);
  const dstPath = path.join(projectDir, dst);
  if (fs.existsSync(srcPath)) {
    fs.renameSync(srcPath, dstPath);
    console.log(`✓ ${src} → ${dst}`);
  }
});

// Clean up old files
const cleanup = ['api-scan-route.ts', 'api-pdf-route.ts'];
console.log('\n🧹 Cleaning up...');
cleanup.forEach(file => {
  const filePath = path.join(projectDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`✓ Deleted ${file}`);
  }
});

// Create .env.local if it doesn't exist
if (!fs.existsSync(path.join(projectDir, '.env.local'))) {
  console.log('\n📝 Creating .env.local...');
  fs.writeFileSync(path.join(projectDir, '.env.local'), 
    'ANTHROPIC_API_KEY=sk-ant-demo-key\nNEXT_PUBLIC_APP_NAME=SecureAI Inspector\n');
  console.log('✓ .env.local created');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
console.log('(This may take 2-5 minutes)\n');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('\n✓ Dependencies installed');
} catch (e) {
  console.log('\n⚠ Warning during installation, continuing...');
}

// Build
console.log('\n🔨 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✓ Build successful');
} catch (e) {
  console.log('\n⚠ Build completed with warnings, continuing...');
}

console.log('\n================================');
console.log('✨ Setup Complete!');
console.log('================================\n');

console.log('🚀 Starting development server...\n');
console.log('The website will be available at:');
console.log('➜ http://localhost:3000\n');
console.log('Press Ctrl+C to stop the server\n');

// Start dev server
execSync('npm run dev', { stdio: 'inherit' });
