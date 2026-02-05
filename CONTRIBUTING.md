# Contributing to @cgeosoft/n8n-nodes-ewelink

Thank you for your interest in contributing to @cgeosoft/n8n-nodes-ewelink! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/n8n-nodes-ewelink.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `bun install`

## Development Workflow

### Building the Project

```bash
bun run build
```

### Running in Development Mode

```bash
bun run dev
```

This will watch for changes and rebuild automatically.

### Linting

```bash
bun run lint
```

To automatically fix linting issues:

```bash
bun run lint:fix
```

### Formatting

We use Biome for code formatting:

```bash
bun run format
```

### Testing the OAuth Helper

```bash
node bin/oauth-helper.js --id YOUR_APP_ID --secret YOUR_APP_SECRET
```

## Code Standards

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure all linting checks pass
- Format code with Biome before committing

## Commit Messages

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests

Example: `feat: add support for device brightness control`

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Ensure all tests pass and linting is clean
3. Update the CHANGELOG.md following [Keep a Changelog](https://keepachangelog.com/) format
4. Request review from maintainers
5. Wait for approval and merge

## Testing

Before submitting a PR:

1. Test your changes with a local n8n instance
2. Verify the OAuth helper tool works correctly
3. Test all affected device operations
4. Check for any breaking changes

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase

## Code of Conduct

Please be respectful and constructive in all interactions. We're all here to make this project better!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
