# Deployment Instructions (Vercel & Netlify)

## Vercel (recommended)
1. Install Vercel CLI (optional):
   ```bash
   npm i -g vercel
   ```
2. From the project root (where vercel.json is), run:
   ```bash
   vercel login
   vercel --prod
   ```
   - On first deploy, Vercel will detect the static client and Node serverless functions.
   - After deployment, note the production URL (e.g., https://your-project.vercel.app).
3. Update `devvit.json` -> `webview.origin` with the production origin (e.g., https://your-project.vercel.app).
4. Verify endpoints:
   - `https://your-project.vercel.app/api/leaderboard`
   - `https://your-project.vercel.app/api/score` (POST JSON body: {user, score})

## Netlify (alternative)
Netlify needs serverless functions to be placed differently (Netlify Functions). Basic steps:
1. Create Netlify account and link repo.
2. Configure build to publish `client` directory.
3. Add Netlify functions for `/api` endpoints (you may need to move server/api/*.js to netlify/functions/).
4. Deploy and note your site URL. Update `devvit.json` origin accordingly.

## Notes
- Make sure `devvit.json` `webview.origin` matches the deployed origin exactly (protocol + domain).
- Serverless functions are stateless: persist leaderboard to an external DB if you need persistence across function restarts.
- Keep request/response sizes small to obey Devvit limits.
