import eWeLink from 'ewelink-api-next';
import type { ICredentialDataDecryptedObject, IExecuteFunctions } from 'n8n-workflow';

export interface EwelinkCredentials {
  appId: string;
  appSecret: string;
  region: string;
  accessToken: string;
  refreshToken: string;
  atExpiry: number;
  rtExpiry: number;
}

export interface EwelinkClient {
  client: InstanceType<typeof eWeLink.WebAPI>;
  credentials: EwelinkCredentials;
}

/**
 * Create an authenticated eWeLink WebAPI client
 */
export async function getEwelinkClient(context: IExecuteFunctions): Promise<EwelinkClient> {
  const credentials = (await context.getCredentials(
    'ewelinkApi',
  )) as ICredentialDataDecryptedObject;

  // Parse the credentials JSON
  const credentialsData =
    typeof credentials.credentialsJson === 'string'
      ? JSON.parse(credentials.credentialsJson)
      : credentials.credentialsJson;

  const ewelinkCredentials: EwelinkCredentials = {
    appId: credentialsData.appId as string,
    appSecret: credentialsData.appSecret as string,
    region: credentialsData.region as string,
    accessToken: credentialsData.accessToken as string,
    refreshToken: credentialsData.refreshToken as string,
    atExpiry: (credentialsData.atExpiry as number) || 0,
    rtExpiry: (credentialsData.rtExpiry as number) || 0,
  };

  const client = new eWeLink.WebAPI({
    appId: ewelinkCredentials.appId,
    appSecret: ewelinkCredentials.appSecret,
    region: ewelinkCredentials.region,
  });

  // Set the access token
  client.at = ewelinkCredentials.accessToken;
  client.region = ewelinkCredentials.region;
  client.setUrl(ewelinkCredentials.region);

  // Check if token needs refresh
  const now = Date.now();
  if (ewelinkCredentials.atExpiry > 0 && now >= ewelinkCredentials.atExpiry) {
    if (ewelinkCredentials.rtExpiry > 0 && now < ewelinkCredentials.rtExpiry) {
      // Token expired but refresh token still valid - attempt refresh
      try {
        const refreshResult = await client.user.refreshToken({
          rt: ewelinkCredentials.refreshToken,
        });

        if (refreshResult.error === 0 && refreshResult.data) {
          client.at = refreshResult.data.at;
          // Note: In production, you'd want to persist the new tokens
          // back to n8n credentials, but that requires additional setup
        }
      } catch {
        // If refresh fails, proceed with existing token
        // It may still work or will fail on actual API call
      }
    }
  }

  return { client, credentials: ewelinkCredentials };
}

/**
 * Get the base URL for a region
 */
export function getRegionUrl(region: string): string {
  const tld = region === 'cn' ? 'cn' : 'cc';
  return `https://${region}-apia.coolkit.${tld}`;
}
