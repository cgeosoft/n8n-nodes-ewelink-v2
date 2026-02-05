import * as crypto from 'node:crypto';
import * as http from 'node:http';
import { URL } from 'node:url';
import eWeLink from 'ewelink-api-next';
import open from 'open';

interface OAuthConfig {
  appId: string;
  appSecret: string;
  redirectUri: string;
  region: string;
}

interface OAuthResult {
  accessToken: string;
  refreshToken: string;
  atExpiredTime: number;
  rtExpiredTime: number;
  region: string;
}

export class OAuthHelper {
  private config: OAuthConfig;
  private server: http.Server | null = null;
  private state: string;
  private client: InstanceType<typeof eWeLink.WebAPI>;

  constructor(config: OAuthConfig) {
    this.config = config;
    this.state = this.generateRandomString(32);
    this.client = new eWeLink.WebAPI({
      appId: config.appId,
      appSecret: config.appSecret,
      region: config.region,
    });
  }

  private generateRandomString(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }

  private getPort(): number {
    const url = new URL(this.config.redirectUri);
    return parseInt(url.port, 10) || 80;
  }

  private getAuthUrl(): string {
    return this.client.oauth.createLoginUrl({
      redirectUrl: this.config.redirectUri,
      state: this.state,
    });
  }

  private async exchangeCodeForToken(code: string, region: string): Promise<OAuthResult> {
    const result = await this.client.oauth.getToken({
      region: region,
      redirectUrl: this.config.redirectUri,
      code: code,
    });

    if (result.error !== 0) {
      throw new Error(`OAuth error: ${result.msg || 'Unknown error'}`);
    }

    return {
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      atExpiredTime: result.data.atExpiredTime,
      rtExpiredTime: result.data.rtExpiredTime,
      region: region,
    };
  }

  private createCallbackPage(success: boolean, message: string): string {
    if (success) {
      return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Authentication Successful</title>
	<style>
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 100vh;
			margin: 0;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		}
		.container {
			background: white;
			padding: 3rem;
			border-radius: 1rem;
			box-shadow: 0 20px 60px rgba(0,0,0,0.3);
			text-align: center;
			max-width: 500px;
		}
		.success-icon {
			font-size: 4rem;
			margin-bottom: 1rem;
		}
		h1 {
			color: #2d3748;
			margin-bottom: 1rem;
		}
		p {
			color: #718096;
			line-height: 1.6;
		}
		.closing {
			margin-top: 2rem;
			font-size: 0.9rem;
			color: #a0aec0;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="success-icon">✅</div>
		<h1>Authentication Successful!</h1>
		<p>${message}</p>
		<p class="closing">This window will close automatically in 3 seconds...</p>
	</div>
	<script>
		setTimeout(() => {
			window.close();
		}, 3000);
	</script>
</body>
</html>`;
    } else {
      return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Authentication Failed</title>
	<style>
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 100vh;
			margin: 0;
			background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		}
		.container {
			background: white;
			padding: 3rem;
			border-radius: 1rem;
			box-shadow: 0 20px 60px rgba(0,0,0,0.3);
			text-align: center;
			max-width: 500px;
		}
		.error-icon {
			font-size: 4rem;
			margin-bottom: 1rem;
		}
		h1 {
			color: #2d3748;
			margin-bottom: 1rem;
		}
		p {
			color: #718096;
			line-height: 1.6;
		}
		.closing {
			margin-top: 2rem;
			font-size: 0.9rem;
			color: #a0aec0;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="error-icon">❌</div>
		<h1>Authentication Failed</h1>
		<p>${message}</p>
		<p class="closing">This window will close automatically in 5 seconds...</p>
	</div>
	<script>
		setTimeout(() => {
			window.close();
		}, 5000);
	</script>
</body>
</html>`;
    }
  }

  public async start(): Promise<OAuthResult> {
    return new Promise((resolve, reject) => {
      const port = this.getPort();

      this.server = http.createServer(async (req, res) => {
        const url = new URL(req.url ?? '/', `http://localhost:${port}`);

        if (url.pathname === '/') {
          try {
            const code = url.searchParams.get('code');
            const state = url.searchParams.get('state');
            const region = url.searchParams.get('region');
            const error = url.searchParams.get('error');

            if (error) {
              const errorDescription = url.searchParams.get('error_description') || 'Unknown error';
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(this.createCallbackPage(false, `OAuth Error: ${errorDescription}`));
              this.server?.close();
              return reject(new Error(`OAuth error: ${errorDescription}`));
            }

            if (state !== this.state) {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(
                this.createCallbackPage(false, 'Invalid state parameter. Possible CSRF attack.'),
              );
              this.server?.close();
              return reject(new Error('Invalid state parameter'));
            }

            if (!code) {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(this.createCallbackPage(false, 'No authorization code received.'));
              this.server?.close();
              return reject(new Error('No authorization code received'));
            }

            if (!region) {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(this.createCallbackPage(false, 'No region parameter received.'));
              this.server?.close();
              return reject(new Error('No region parameter received'));
            }

            // Exchange code for token
            const tokenData = await this.exchangeCodeForToken(code, region);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(
              this.createCallbackPage(
                true,
                'Your OAuth tokens have been generated successfully. Check your terminal for the credentials.',
              ),
            );

            // Close server after a short delay to ensure response is sent
            setTimeout(() => {
              this.server?.close();
              resolve(tokenData);
            }, 500);
          } catch (error) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(
              this.createCallbackPage(
                false,
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              ),
            );
            this.server?.close();
            reject(error);
          }
        } else {
          res.writeHead(404);
          res.end('Not found');
        }
      });

      this.server.listen(port, () => {
        const authUrl = this.getAuthUrl();
        console.log(`🌐 OAuth server started on ${this.config.redirectUri}`);
        console.log('\n📱 Please open the following URL in your browser to authorize:\n');
        console.log(`   ${authUrl}\n`);
        console.log('⏳ Waiting for authorization...\n');

        // Try to open browser automatically
        open(authUrl).catch(() => {
          console.log(
            '⚠️  Could not open browser automatically. Please copy and paste the URL above.\n',
          );
        });
      });

      this.server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          reject(
            new Error(
              `Port ${port} is already in use. Please close the application using this port or use a different redirect URI.`,
            ),
          );
        } else {
          reject(error);
        }
      });
    });
  }
}
