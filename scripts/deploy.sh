#!/bin/bash

# Exit on error
set -e

# Check if we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: Not on main branch!"
    echo "Current branch: $CURRENT_BRANCH"
    echo "Please switch to main branch before deploying: git checkout main"
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env and add your VERCEL_DEPLOY_HOOK URL"
    exit 1
fi

# Load environment variables
source .env

# Check if deploy hook is configured
if [ -z "$VERCEL_DEPLOY_HOOK" ] || [ "$VERCEL_DEPLOY_HOOK" = "https://api.vercel.com/v1/integrations/deploy/prj_xxx/yyy" ]; then
    echo "❌ Error: VERCEL_DEPLOY_HOOK not configured in .env!"
    echo ""
    echo "To set up:"
    echo "1. Go to Vercel Dashboard → Your Project → Settings → Git → Deploy Hooks"
    echo "2. Create a new deploy hook for the 'main' branch"
    echo "3. Copy the URL and paste it in .env as VERCEL_DEPLOY_HOOK"
    exit 1
fi

# Run build check to catch errors before deploying
echo "🔨 Running production build check..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi

echo "📦 Starting deployment process..."
echo ""

# Ask whether to bump version
read -r -p "🔢 Do you want to bump the version? (y/n): " VERSION_BUMP
if [[ "$VERSION_BUMP" =~ ^[Yy]$ ]]; then
    echo "🔢 Incrementing version..."
    ./scripts/version-increment.sh
else
    echo "⏭️  Skipping version bump."
fi

echo ""
echo "🚀 Triggering Vercel deployment..."

# Trigger Vercel deployment via webhook
RESPONSE=$(curl -s -X POST "$VERCEL_DEPLOY_HOOK")

# Check if deployment was triggered successfully
if echo "$RESPONSE" | grep -q "job"; then
    echo "✅ Deployment triggered successfully!"
    echo ""
    echo "📊 Check deployment status at: https://vercel.com/just-hosams-projects/wishlist/deployments"
else
    echo "⚠️  Deployment may have been triggered, but response was unexpected:"
    echo "$RESPONSE"
fi
