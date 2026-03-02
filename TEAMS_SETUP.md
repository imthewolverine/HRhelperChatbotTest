# Teams Integration Setup

This guide explains how to deploy and use your AI agent inside Microsoft Teams.

## Prerequisites
- Azure Bot Service created (you already have this with app ID and password in `.env.local`)
- Vercel deployment (you've already done this)
- Teams admin/developer access

## Steps

### 1. Update Azure Bot Messaging Endpoint
1. Go to [Azure Portal](https://portal.azure.com)
2. Find your **Bot Service** resource
3. Go to **Settings** → **Configuration**
4. Set **Messaging endpoint** to:
   ```
   https://h-rhelper-chatbot-test.vercel.app/api/teams/messages
   ```
   Replace `YOUR-VERCEL-URL` with your actual Vercel domain (e.g., `teamstest-rho.vercel.app`)
5. Save changes

### 2. Prepare Manifest Files
You need two 192x192 PNG icons:
- **color.png** - Full color icon (used in Teams sidebar)
- **outline.png** - Outline icon (used in taskbar)

Place these in the `public/` folder.

Example: Create simple placeholder images using an image editor or online tool, then save as `public/color.png` and `public/outline.png`.

### 3. Create Teams App Package
1. Create a ZIP file containing:
   ```
   manifest.json
   color.png
   outline.png
   ```

2. Update `manifest.json` to use your Vercel URL in `validDomains`:
   ```json
   "validDomains": [
     "YOUR-VERCEL-URL",
     "*.vercel.app"
   ]
   ```

### 4. Upload to Teams
1. Open Microsoft Teams
2. Go to **Teams** (left sidebar) → **...** (three dots) → **Manage teams**
3. Click **Create a team** or use an existing team
4. In Team settings, go to **Apps** → **Upload a custom app**
5. Upload the ZIP file from Step 3
6. Click **Add to team**

### 5. Test in Teams
1. Open the team where you added the app
2. Find the app in the left sidebar
3. Start a 1:1 chat with the bot or mention it in a channel
4. Send a message—it will be processed by your Gemini agent

## Troubleshooting

**Bot doesn't respond:**
- Check Azure Bot messaging endpoint is correct
- Verify `MICROSOFT_APP_ID` and `MICROSOFT_APP_PASSWORD` are in `.env.local`
- Check Vercel logs: `npm run build` and `npm start` locally to test

**Icon issues:**
- Ensure both `color.png` and `outline.png` are valid 192x192 PNG files
- Place them in the `public/` folder before creating the ZIP

**Manifest errors:**
- Validate manifest.json at [Microsoft App Manifest Validator](https://admx.dev/?msteams)
- Ensure `id` matches your `MICROSOFT_APP_ID`

## Resources
- [Bot Framework Documentation](https://docs.microsoft.com/en-us/azure/bot-service/)
- [Teams App Manifest Schema](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema)
- [Teams Developer Docs](https://docs.microsoft.com/en-us/microsoftteams/platform/overview)
