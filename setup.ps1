# SecureAI Inspector - Windows Setup Script

Write-Host "🔧 Setting up SecureAI Inspector project structure..." -ForegroundColor Cyan

# Create directories
$dirs = @(
    "app/api/scan",
    "app/api/generate-pdf", 
    "components",
    "lib",
    "types",
    "hooks",
    "services",
    "public"
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created: $dir" -ForegroundColor Green
    }
}

# Move files to correct locations
$moves = @{
    "layout.tsx" = "app/layout.tsx"
    "page.tsx" = "app/page.tsx"
    "globals.css" = "app/globals.css"
    "scan-form.tsx" = "components/scan-form.tsx"
    "security-dashboard.tsx" = "components/security-dashboard.tsx"
    "recent-scans.tsx" = "components/recent-scans.tsx"
    "api-scan-route.ts" = "app/api/scan/route.ts"
    "api-pdf-route.ts" = "app/api/generate-pdf/route.ts"
    "scan-types.ts" = "types/scan.ts"
    "favicon.ico" = "public/favicon.ico"
}

foreach ($src in $moves.Keys) {
    $dst = $moves[$src]
    if (Test-Path $src) {
        Move-Item -Path $src -Destination $dst -Force
        Write-Host "Moved: $src -> $dst" -ForegroundColor Green
    }
}

Write-Host "`n✅ Project structure created!" -ForegroundColor Green
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan

npm install

Write-Host "`n🔨 Building project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✨ Setup complete!" -ForegroundColor Green
    Write-Host "`nTo start development server, run: npm run dev" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Build failed. Check the output above." -ForegroundColor Red
}
