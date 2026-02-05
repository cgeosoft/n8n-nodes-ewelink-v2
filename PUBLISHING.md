# Publishing Guide

This guide explains how to manually publish @cgeosoft/n8n-nodes-ewelink to GitHub and npm from your local PC.

## Prerequisites

1. **GitHub Account**: Access to the repository
2. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
3. **npm Authentication**: You must be logged in to npm locally
4. **Git**: Installed and configured

## Initial Setup

### 1. Set Up npm Account

```bash
# Login to npm (first time only)
npm login

# Verify you're logged in
npm whoami
```

### 2. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit"
```

### 3. Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `n8n-nodes-ewelink`
3. Do NOT initialize with README (we already have one)

### 4. Link Local Repository to GitHub

```bash
git remote add origin https://github.com/cgeosoft/n8n-nodes-ewelink.git
git branch -M main
git push -u origin main
```

## Publishing a New Version

### Manual Release Process

```bash
### Manual Release Process

Follow these steps every time you want to publish a new version:

#### Step 1: Pre-publish Checks

```bash
# Make sure you're on main branch
git checkout main

# Pull latest changes
git pull

# Run linting (optional, use biome check)
bun run check

# Build the project
bun run build

# Verify build succeeded
ls -la dist/
```

#### Step 2: Update Version and CHANGELOG

1. **Update CHANGELOG.md** manually with your changes following [Keep a Changelog](https://keepachangelog.com/) format

2. **Bump version** in package.json:
   ```bash
   # For bug fixes
   npm version patch
   
   # For new features
   npm version minor
   
   # For breaking changes
   npm version major
   ```
   
   This automatically:
   - Updates version in package.json
   - Creates a git commit
   - Creates a git tag

#### Step 3: Push to GitHub

```bash
# Push commits and tags to GitHub
git push origin main --tags
```

#### Step 4: Publish to npm

```bash
# Make sure you're logged in to npm
npm whoami

# Publish to npm
npm publish --access public
```

#### Step 5: Create GitHub Release (Optional)

1. Go to https://github.com/cgeosoft/n8n-nodes-ewelink/releases
2. Click "Draft a new release"
3. Select the tag you just created
4. Title: `v0.1.0` (or your version)
5. Description: Copy from CHANGELOG.md
6. Click "Publish release"

### Quick Release Command Sequence

```bash
# 1. Update CHANGELOG.md manually first, then run:
bun run check
bun run build
npm version patch  # or minor/major
git push origin main --tags
npm publish --access public
```

## Version Numbers

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible

## Pre-publish Checklist

Before publishing:

- [ ] Code quality check passes: `bun run check`
- [ ] Build succeeds: `bun run build`
- [ ] CHANGELOG.md is updated with new changes
- [ ] README.md is current
- [ ] All changes are committed to git
- [ ] Logged in to npm: `npm whoami`

## First Time Publishing

For the initial v0.1.0 release:

1. Make sure all files are committed:
   ```bash
   git add .
   git commit -m "chore: prepare for initial release"
   ```

2. Ensure version in package.json is `0.1.0`

3. Build and publish:
   ```bash
   bun run build
   npm publish --access public
   ```

4. Tag and push:
   ```bash
   git tag v0.1.0
   git push origin main --tags
   ```

## Troubleshooting

### npm publish fails

- **Not logged in**: Run `npm login`
- **Package name taken**: Check on npmjs.com, you may need to use a scoped package
- **Authentication error**: Run `npm logout` then `npm login` again
- **Permission denied**: Make sure you have publishing rights

### Version already exists

- You can't republish the same version
- Bump the version and try again: `npm version patch`

### Build errors

- Delete `dist/` and `node_modules/`, then run:
  ```bash
  bun install
  bun run build
  ```

## Post-publish

After successful publish:

1. Verify package on npm: https://www.npmjs.com/package/@cgeosoft/n8n-nodes-ewelink
2. Test installation in a new directory:
   ```bash
   mkdir test-install && cd test-install
   npm install @cgeosoft/n8n-nodes-ewelink
   ```
3. Create GitHub release with release notes
4. Announce on relevant channels (if applicable)

## Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [npm CLI Documentation](https://docs.npmjs.com/cli/)
