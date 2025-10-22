#!/bin/bash

# Increment version in package.json
npm version patch --no-git-tag-version

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")

# Stage and commit the change
git add package.json
git commit -m "chore: Bump version to $NEW_VERSION"

# Push to remote
git push

echo "✅ Version bumped to $NEW_VERSION and pushed to repository"
