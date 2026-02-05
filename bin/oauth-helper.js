#!/usr/bin/env node

/**
 * eWeLink OAuth2 Helper Tool
 * Helps users generate OAuth tokens for n8n-nodes-ewelink-v2
 */

const { OAuthHelper } = require('../dist/lib/oauth-helper');
const readline = require('node:readline');

// Parse command line arguments
const args = process.argv.slice(2);
const config = {
  appId: null,
  appSecret: null,
  redirectUri: 'http://localhost:5000',
  region: 'us', // default region
};

// Debug: log args if DEBUG env var is set
if (process.env.DEBUG) {
  console.log('Raw args:', args);
}

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--id=')) {
    config.appId = arg.split('=')[1];
  } else if (arg === '--id' && args[i + 1] && !args[i + 1].startsWith('--')) {
    config.appId = args[++i];
  } else if (arg.startsWith('--secret=')) {
    config.appSecret = arg.split('=')[1];
  } else if (arg === '--secret' && args[i + 1] && !args[i + 1].startsWith('--')) {
    config.appSecret = args[++i];
  } else if (arg.startsWith('--redirect=')) {
    config.redirectUri = arg.split('=')[1];
  } else if (arg === '--redirect' && args[i + 1] && !args[i + 1].startsWith('--')) {
    config.redirectUri = args[++i];
  } else if (arg.startsWith('--region=')) {
    config.region = arg.split('=')[1];
  } else if (arg === '--region' && args[i + 1] && !args[i + 1].startsWith('--')) {
    config.region = args[++i];
  } else if (arg === '--help' || arg === '-h') {
    showHelp();
    process.exit(0);
  }
}

// Debug: log config if DEBUG env var is set
if (process.env.DEBUG) {
  console.log('Parsed config:', config);
}

function showHelp() {
  console.log(`
eWeLink OAuth2 Helper Tool
===========================

Usage:
  npx n8n-nodes-ewelink-v2 --id <APPID> --secret <APPSECRET> [options]

Required Arguments:
  --id <APPID>           Your eWeLink App ID
  --secret <APPSECRET>   Your eWeLink App Secret

Optional Arguments:
  --redirect <URL>       Redirect URI (default: http://localhost:5000)
  --region <REGION>      eWeLink region: us, eu, cn, as (default: us)
  --help, -h            Show this help message

Example:
  npx n8n-nodes-ewelink-v2 --id YOUR_APP_ID --secret YOUR_APP_SECRET

Before running this tool:
  1. Go to https://dev.ewelink.cc
  2. Create a new OAuth2.0 application
  3. Set the redirect URL to match the --redirect argument (default: http://localhost:5000)
  4. Copy the App ID and App Secret

For more information, visit: https://github.com/cgeosoft/n8n-nodes-ewelink-v2
`);
}

// Validate required arguments
if (!config.appId || !config.appSecret) {
  console.error('❌ Error: Both --id and --secret are required.\n');
  showHelp();
  process.exit(1);
}

// Display instructions and ask for confirmation
async function confirmStart() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                     eWeLink OAuth2 Token Generator                        ║
╚═══════════════════════════════════════════════════════════════════════════╝

📋 Before proceeding, please ensure you have:

   1. ✅ Created an OAuth2.0 application at https://dev.ewelink.cc
   2. ✅ Set the redirect URL to: ${config.redirectUri}
   3. ✅ Copied your App ID and App Secret

📝 Configuration:
   App ID:        ${config.appId}
   App Secret:    ${config.appSecret.substring(0, 10)}...
   Redirect URI:  ${config.redirectUri}
   Region:        ${config.region}

⚠️  Important:
   - The redirect URL in your eWeLink app MUST match exactly: ${config.redirectUri}
   - A browser window will open for you to login
   - After authorization, the tokens will be displayed here
`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Ready to continue? (yes/no): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

// Main execution
(async () => {
  try {
    const confirmed = await confirmStart();

    if (!confirmed) {
      console.log('\n❌ Operation cancelled by user.\n');
      process.exit(0);
    }

    console.log('\n🚀 Starting OAuth server...\n');

    const helper = new OAuthHelper(config);
    const result = await helper.start();

    console.log('\n╔═══════════════════════════════════════════════════════════════════════════╗');
    console.log('║                        ✅ Authentication Successful!                       ║');
    console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');

    // Prepare credentials JSON
    const credentials = {
      appId: config.appId,
      appSecret: config.appSecret,
      region: result.region,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      atExpiry: result.atExpiredTime,
      rtExpiry: result.rtExpiredTime,
    };

    console.log('📋 Your eWeLink Credentials (JSON format):\n');
    console.log('');
    console.log(JSON.stringify(credentials, null, 2));
    console.log('');

    console.log('📝 Instructions:');
    console.log('  1. Copy the entire JSON above (including the curly braces)');
    console.log('  2. In n8n, create new eWeLink API credentials');
    console.log('  3. Paste the JSON into the credentials field');
    console.log('\n✨ Done! You can now close this window.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPlease check:');
    console.error('  - Your App ID and App Secret are correct');
    console.error('  - The redirect URI matches your eWeLink app configuration');
    console.error('  - You have internet connectivity');
    console.error('  - The port is not already in use\n');
    process.exit(1);
  }
})();
