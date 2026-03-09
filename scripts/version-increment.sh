#!/bin/bash

# Increment version in package.json
npm version patch --no-git-tag-version

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")

# Keep the service worker cache version aligned with the deploy version so
# boot-shell caches rotate automatically on every release.
node -e '
const fs = require("fs")
const filePath = "public/sw.js"
const fileContents = fs.readFileSync(filePath, "utf8")
const updatedContents = fileContents.replace(
  /const SW_VERSION = "[^"]+"/,
  `const SW_VERSION = "${process.argv[1]}"`
)

if (fileContents === updatedContents) {
  throw new Error("Failed to update SW_VERSION in public/sw.js")
}

fs.writeFileSync(filePath, updatedContents)
' "$NEW_VERSION"

# Stage and commit the change
git add package.json package-lock.json public/sw.js
git commit -m "chore: Bump version to $NEW_VERSION"

# Push to remote
git push

echo "✅ Version bumped to $NEW_VERSION and pushed to repository"
