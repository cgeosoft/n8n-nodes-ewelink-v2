# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within n8n-nodes-ewelink-v2, please send an email to christos@cgeosoft.com. All security vulnerabilities will be promptly addressed.

Please do not open public issues for security vulnerabilities.

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Time

- We aim to respond to security reports within 48 hours
- We will provide regular updates on the progress
- Once fixed, we will credit you in the release notes (unless you prefer to remain anonymous)

## Security Best Practices

When using this package:

1. **Protect Your Credentials**: Never commit eWeLink API credentials to version control
2. **Use Environment Variables**: Store sensitive data in environment variables
3. **Keep Updated**: Regularly update to the latest version
4. **Monitor Access**: Review who has access to your n8n instance
5. **Secure OAuth Tokens**: Store OAuth tokens securely and rotate them regularly

## Third-Party Dependencies

This package relies on:
- `ewelink-api-next` - Official eWeLink API client
- `open` - For opening browser windows

We regularly monitor these dependencies for security vulnerabilities and update them as needed.
