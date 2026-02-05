#!/bin/bash

set -e

# Get version bump type from argument (default: minor)
VERSION_TYPE="${1:-minor}"

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo "❌ Invalid version type: $VERSION_TYPE"
  echo "Usage: $0 [patch|minor|major]"
  echo "Example: $0 patch"
  exit 1
fi

echo "🚀 Publishing n8n-nodes-ewelink-v2 to npm"
echo "📌 Version bump: $VERSION_TYPE"
echo ""

# Check if we're on main branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "⚠️  Warning: You are not on the main branch (current: $BRANCH)"
  read -p "Continue anyway? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted"
    exit 1
  fi
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "⚠️  Warning: You have uncommitted changes"
  read -p "Continue anyway? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted"
    exit 1
  fi
fi

# Check if logged in to npm
if ! npm whoami &>/dev/null; then
  echo "❌ You are not logged in to npm"
  echo "Please run: npm login"
  exit 1
fi

echo ""
echo "⬆️  Bumping version ($VERSION_TYPE)..."
npm version $VERSION_TYPE --no-git-tag-version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "📦 New version: $NEW_VERSION"

echo ""
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🔍 Running lint..."
pnpm run lint

echo ""
echo "🔨 Building..."
pnpm run build

echo ""
echo "📤 Publishing to npm..."
npm publish --access public

echo ""
echo "✅ Successfully published v$NEW_VERSION to npm!"
echo ""
echo "📌 Don't forget to:"
echo "   1. Commit the version change: git add package.json && git commit -m 'chore: release v$NEW_VERSION'"
echo "   2. Create a git tag: git tag v$NEW_VERSION"
echo "   3. Push changes and tag: git push && git push origin v$NEW_VERSION"
