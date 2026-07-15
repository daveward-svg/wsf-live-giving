# WSF Live Giving — Clean Firebase Build

## Files to keep in GitHub

- index.html
- admin.html
- display.js
- admin.js
- firebase-config.js
- styles.css
- admin.css
- database.rules.json
- netlify.toml
- README.md

Delete old files such as `app.js`, `config.js`, and `style.css`.

## Firebase setup

1. Authentication → Sign-in method → enable Email/Password.
2. Authentication → Users → create your admin account.
3. Authentication → Settings → Authorized domains → add:
   `wsf-live-giving.netlify.app`
4. Realtime Database → Rules → paste the contents of `database.rules.json`.
5. Publish the rules.

## GitHub replacement

1. Delete the old project files from the repository.
2. Upload all files from this folder to the repository root.
3. Commit to `main`.
4. Wait for Netlify to redeploy.

## Test

Public display:
`https://wsf-live-giving.netlify.app/`

Admin:
`https://wsf-live-giving.netlify.app/admin.html`

After signing in, enter the amount, goal, campaign name, subtitle, and giving URL, then click **Save live update**.
