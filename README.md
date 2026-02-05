# @cgeosoft/n8n-nodes-ewelink

![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

[![npm version](https://img.shields.io/npm/v/@cgeosoft/n8n-nodes-ewelink.svg)](https://www.npmjs.com/package/@cgeosoft/n8n-nodes-ewelink)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dt/@cgeosoft/n8n-nodes-ewelink.svg)](https://www.npmjs.com/package/@cgeosoft/n8n-nodes-ewelink)

> WARNING: This package is in early beta. Please test it thoroughly and report any issues you find!
> I have not test every operation on every device type, so there may be bugs or unexpected behavior. Use with caution and always have a backup of your n8n instance. Also I have not yet performed extensive security audits.
> You secret keys are not stored anywhere by this package, but always be careful when handling credentials. If you have any concerns or find any security issues, please report them immediately.

**Control your eWeLink smart home devices directly from n8n**

This is an [n8n](https://n8n.io/) community node that lets you integrate your **eWeLink** devices into your workflow automations. Supports devices from popular brands like **SONOFF**, **Shelly**, and any other device compatible with the eWeLink ecosystem.

**Why I built this**

I wanted a way to automate my smart home devices and the original n8n eWeLink node only supported the old API with username/password authentication. This new version uses the latest eWeLink v2 API with OAuth2, which is more secure and supports all the latest features.

---

## Features

- **Device Control**: Turn devices on/off, adjust brightness, change colors, and control multi-channel switches.
- **Status Monitoring**: Get real-time status updates and historical data from your devices.
- **Home Management**: Manage your Families, Rooms, and sort devices accordingly.
- **Group Support**: Control entire groups of devices with a single action.
- **Secure Auth**: Built-in OAuth2 support with token management.

---

## Installation

### Option 1: Community Nodes (Recommended)
1. In your **n8n** instance, go to **Settings** > **Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-ewelink-v2` and click **Install**.

### Option 2: Manual Install
If you are running n8n via Docker or npm, you can install it globally:
```bash
npm install @cgeosoft/n8n-nodes-ewelink -g
```

---

## Authentication Setup

Using the eWeLink v2 API requires an **App ID** and **App Secret** from the eWeLink Developer portal. Follow these steps to get set up quickly.

### Step 1: Create an eWeLink App
1. Log in to the [eWeLink Developer Portal](https://dev.ewelink.cc/).
2. Click **Create Application**.
3. Select **App Type**: `OAuth2.0`.
4. Set **Redirect URL**: `http://localhost:3000` (or any valid URL you control).
5. Once created, copy your **App ID** and **App Secret**.

### Step 2: Generate Tokens (The Easy Way)
We successfully included a CLI tool to handle the complicated OAuth handshake for you.

Run this command in your terminal:
```bash
npx n8n-nodes-ewelink-v2 --id <YOUR_APP_ID> --secret <YOUR_APP_SECRET>
```

**What happens next?**
1. A browser window will open asking you to log in to your eWeLink account.
2. Allow the permissions.
3. The terminal will print a **JSON block** with your credentials.

> **Note on Region:** If you are outside the US, you can specify your region (`eu`, `cn`, `as`) like this:
> `npx n8n-nodes-ewelink-v2 --id ... --secret ... --region eu`

### Step 3: Connect in n8n
1. In n8n, verify you have the credentials for **eWeLink API**.
2. Create a new credential or select an existing one.
3. Paste the **entire JSON object** you got from Step 2 into the **JSON** field.
4. Click **Save**.

---

## Operations

### Device
Everything you need to manage individual hardware.
* **Set Status**: The most common operation. Turn things on/off or set parameters.
  * *Supports JSON input for advanced properties like `brightness`, `color`, etc.*
* **Get Status**: Check if a device is currently on or off.
* **Get Many**: List all devices in your account.
* **Get History**: See the usage logs of a device.
* **Update / Delete**: Manage device names or remove them.
* **Control Channels**: Specific support for multi-channel switches (e.g., Switch 1 vs Switch 2).

### Group
Manage device groups created in the eWeLink app.
* **Set Status**: Turn an entire group on/off.
* **Get Many**: List your groups.
* **Create / Update / Delete**: Manage groups programmatically.

### Home / Family
Organize your devices into physical spaces.
* **Get Families**: See your configured homes.
* **Add/Remove Room**: Manage rooms within a home.
* **Get Home Page**: Retrieve dashboard-like data structure.

---

## Usage Examples

### 1. Toggle a Light at Sunset
Create a workflow with:
1. **Schedule Trigger**: Set to "Every Day" at "Sunset".
2. **eWeLink Node**:
   - Resource: `Device`
   - Operation: `Set Status`
   - Device ID: `<Select your light>`
   - State: `On`

### 2. Turn Off All Plugs When I Leave
1. **Webhook Trigger**: Receive a signal from your phone (e.g., via Tasker or iOS Shortcuts).
2. **eWeLink Node**:
   - Resource: `Group`
   - Operation: `Set Status`
   - Group ID: `<Select "All Plugs" group>`
   - State: `Off`

### 3. Advanced: Set Color & Brightness
For an RGB Bulb, use the **Set Status** operation and enable "JSON Parameters" (or passed via expression):
```json
{
  "switch": "on",
  "ltype": "color",
  "color": {
    "br": 50,
    "r": 255,
    "g": 0,
    "b": 0
  }
}
```

---

## FAQ & Troubleshooting

**Q: My tokens expired, what do I do?**
A: The node attempts to refresh tokens automatically. If the `Refresh Token` itself expires (usually after 60 days), you simply need to run the `npx` command from Step 2 again and update your credentials in n8n.

**Q: I get a "Region does not match" error.**
A: Make sure you use the `--region` flag when generating tokens if your eWeLink account is not US-based. Try `eu` (Europe), `cn` (China), or `as` (Asia).

**Q: Can I run the OAuth helper on a server without a browser?**
A: No, the helper needs to open a browser for the login page. Run it on your local machine, copy the JSON, and paste it into your production n8n instance.

---

## Contributing

Contributions are welcome! If you find a bug or want to add a feature:
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE.md` for more information.

---

*Not affiliated with eWeLink or CoolKit Technology.*
