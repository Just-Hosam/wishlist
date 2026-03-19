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

# Make sure local main matches remote main before deploying.
echo "🔄 Checking local main against origin/main..."
git fetch origin main --quiet

LOCAL_MAIN=$(git rev-parse main)
REMOTE_MAIN=$(git rev-parse origin/main)

if [ "$LOCAL_MAIN" != "$REMOTE_MAIN" ]; then
    echo "❌ Error: local main does not match origin/main."
    echo "Please sync main with origin/main before deploying."
    echo "Local main:  $LOCAL_MAIN"
    echo "origin/main: $REMOTE_MAIN"
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

# Ask up front which optional deploy steps to run later in the flow.
read -r -p "🔢 Do you want to bump the version? (y/n): " VERSION_BUMP
read -r -p "🔍 Do you want to update search data after deploy? (y/n): " UPDATE_SEARCH_DATA

if [[ "$UPDATE_SEARCH_DATA" =~ ^[Yy]$ ]] && [ -z "$CRON_SECRET" ]; then
    echo "❌ Error: CRON_SECRET not configured in .env!"
    echo "Please add CRON_SECRET before using the search update option."
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

    if [[ "$UPDATE_SEARCH_DATA" =~ ^[Yy]$ ]]; then
        echo ""
        echo "⏳ Waiting 90 seconds before updating recommended search data..."
        sleep 90
        echo "🔍 Updating recommended search data..."
        curl -fsS \
            -H "Authorization: Bearer $CRON_SECRET" \
            https://wishlist.samdahrooge.com/api/cron/update-recommended
        echo ""
        echo "✅ Recommended search data update triggered."
    fi
else
    echo "⚠️  Deployment may have been triggered, but response was unexpected:"
    echo "$RESPONSE"
fi
