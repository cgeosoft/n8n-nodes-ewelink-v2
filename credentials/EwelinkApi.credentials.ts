import type { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class EwelinkApi implements ICredentialType {
  name = 'ewelinkApi';

  icon = { light: 'file:../icons/ewelink.svg', dark: 'file:../icons/ewelink.svg' } as const;

  displayName = 'eWeLink API';

  documentationUrl = 'https://dev.ewelink.cc/';

  properties: INodeProperties[] = [
    {
      displayName: 'Credentials JSON',
      name: 'credentialsJson',
      type: 'json',
      default: '{}',
      required: true,
      placeholder:
        '{\n  "appId": "...",\n  "appSecret": "...",\n  "region": "eu",\n  "accessToken": "...",\n  "refreshToken": "...",\n  "atExpiry": 0,\n  "rtExpiry": 0\n}',
      description:
        'Paste the complete JSON output from the OAuth helper tool (run: npx n8n-nodes-ewelink-v2 --id YOUR_APP_ID --secret YOUR_APP_SECRET)',
    },
  ];

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{JSON.parse($credentials.credentialsJson).region === "cn" ? "https://cn-apia.coolkit.cn" : "https://" + JSON.parse($credentials.credentialsJson).region + "-apia.coolkit.cc"}}',
      url: '/v2/user/profile',
      method: 'GET',
      headers: {
        'X-CK-Appid': '={{JSON.parse($credentials.credentialsJson).appId}}',
        Authorization: '=Bearer {{JSON.parse($credentials.credentialsJson).accessToken}}',
        'Content-Type': 'application/json',
      },
    },
  };
}
