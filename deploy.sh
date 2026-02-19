#!/bin/bash

# O2Z Landing Page Deployment Script
# Deploys the landing page to o2z-prod server

set -e

echo "🚀 Deploying O2Z Landing Page to o2z-prod..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist/ directory not found"
    echo "   Please run this script from the o2z-landing directory"
    exit 1
fi

# Confirm deployment
echo -e "${BLUE}This will deploy to: /home/omri/o2z-landing/ on o2z-prod${NC}"
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Deploy files
echo "📦 Packaging files..."
cd dist
tar czf - . | ssh-o2zprod "cd ~/o2z-landing && tar xzf -"
cd ..

echo -e "${GREEN}✅ Files deployed successfully!${NC}"

# Verify deployment
echo "🔍 Verifying deployment..."
ssh-o2zprod "ls -lh ~/o2z-landing/index.html ~/o2z-landing/styles.css ~/o2z-landing/script.js 2>/dev/null || echo '❌ Some files missing'"

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "🌐 Your site should be live at:"
echo "   - https://o2z.tech"
echo "   - https://www.o2z.tech"
echo ""
echo "📊 Check logs with:"
echo "   ssh-o2zprod 'sudo tail -f /var/log/caddy/o2z-landing.log'"
