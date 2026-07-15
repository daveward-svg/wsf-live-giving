# WSF Live Giving

## Firebase setup
1. Firebase Console → Authentication → Sign-in method → enable Email/Password.
2. Authentication → Users → add your admin email/password account.
3. Realtime Database → Rules → paste the contents of `database.rules.json` → Publish.

## GitHub upload
1. In the `wsf-live-giving` repository choose **Add file → Upload files**.
2. Drag every file from this folder into GitHub.
3. Commit to `main`.

## Netlify
1. Add new project → Import an existing project → GitHub.
2. Choose `wsf-live-giving`.
3. Build command: leave blank.
4. Publish directory: `.`
5. Deploy.

Public display: `/`
Admin page: `/admin.html`

Sign in on the admin page, enter the first total and goal, then click **Save live update**.

The Firebase web config is safe to include in frontend code. Protection comes from Authentication and Database Rules. Never upload a Firebase service-account JSON file or your password.
