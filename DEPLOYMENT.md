# Publish Chemistry Atlas with GitHub Pages, login and AI

The course site is a static frontend in `dist/`. It works in local study mode immediately. Login/cloud sync and AI are implemented as optional integrations. They cannot work until you connect your own Supabase project; AI also needs a server-held OpenAI key and a model available to your API account. No accounts or provider keys are bundled.

## 1. Publish the frontend

1. Create your GitHub repository, then add the complete project, including the `.github` directory. Keep backend secrets out of the repository.
2. The homepage and frontend assets must remain together in `dist/`.
3. In the repository's **Settings → Pages**, set the publishing source to **GitHub Actions**.
4. Push to `main`, or manually run **Deploy Chemistry Atlas to GitHub Pages**. The included workflow uploads only `dist/`.
5. Wait for the Pages deployment URL. Relative asset links support both a repository site (`https://you.github.io/repo/`) and a custom domain.

The site is usable without completing the remaining steps: lessons, diagrams, practice and local progress still work. The UI clearly indicates that cloud login or AI needs setup when no configuration exists.

## 2. Create the progress database

1. Create a Supabase project.
2. In its SQL Editor, run `supabase/migrations/202611070001_atlas.sql` once. Alternatively use the Supabase CLI migrations workflow.
3. The `study_progress` table stores one JSON progress document per signed-in user, protected by row-level security. The authenticated user may only select, insert, update or delete their own row.
4. A separate RLS-protected counter and an atomic SQL function enforce a 30-request daily AI budget per account. The limit resets at midnight UTC.

Cloud progress uses a last-write-wins document. Do not edit progress concurrently in multiple devices. Before replacing local progress with cloud data, review the sync choices offered in the app. Signing out should leave you in local study mode; do not share a browser profile for private account study data.

## 3. Configure email one-time-code sign-in

In Supabase Authentication:

1. Enable the Email provider and allow signups if students will create their own accounts.
2. In **Email Templates**, configure the relevant sign-in/magic-link and signup confirmation templates to include the token, not just a link:

```html
<h2>Your Chemistry Atlas sign-in code</h2>
<p>Enter this code in the website:</p>
<p><strong>{{ .Token }}</strong></p>
```

The frontend requests an email OTP and verifies it using the user's email, token and type `email`. This avoids conflicts between authentication redirect hashes and the site's own lesson routing.

3. Set your site URL to the exact Pages URL. Configure a production SMTP sender for use beyond provider test-email restrictions. Supabase's authentication rate limits and email delivery rules still apply.
4. Copy `config.example.js` to `dist/config.js` (or edit the already supplied `dist/config.js`) and fill only:

```js
window.ATLAS_CONFIG = {
  SUPABASE_URL: 'https://YOUR-PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR-PUBLIC-ANON-OR-PUBLISHABLE-KEY'
};
```

These public frontend values are designed to be visible in the repository. A **service-role key, Supabase secret key, or OpenAI API key must never go in this file or anywhere under `dist/`**. RLS, not secrecy of the public key, protects progress.

5. Commit the public configuration and redeploy. Request a code using the app's login form and complete verification.

## 4. Deploy the AI tutor

The tutor uses a Supabase Edge Function and OpenAI's Responses API. It accepts text questions with optional selected-lesson context. It does not accept image uploads. The frontend never talks to OpenAI directly.

With the Supabase CLI installed and linked to your project:

```sh
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase functions deploy chemistry-tutor
```

Set these secrets using the Supabase dashboard or CLI, without committing their values:

- `OPENAI_API_KEY`: your API key, with available billing/quota.
- `OPENAI_MODEL`: a Responses-compatible model ID that is available in your account. Explicitly choose this value; no model is silently hard-coded.
- `ALLOWED_ORIGINS`: comma-separated exact site origins, such as `https://you.github.io,https://chemistry.example.com`. Origin means scheme + host (and port when present), **not** a repository path. Do not use `*`.

Supabase supplies the standard `SUPABASE_URL` and `SUPABASE_ANON_KEY` function environment values. The bundled function configuration disables gateway JWT verification because the handler validates every bearer token itself through `supabase.auth.getUser(token)`; this does **not** make tutor access anonymous.

The Edge Function rejects unapproved origins, unauthenticated users, unsupported roles, oversized messages and excessive per-user daily use. It permits only user/assistant conversation roles and treats supplied lesson context as untrusted study data. Requests are capped at eight messages, 4,000 characters per message, 14,000 context characters and 1,600 output tokens. The model key is used only on the server. `store:false` is sent to OpenAI; requests are nevertheless handled by the API provider under its applicable policies. Selected lesson context and the conversation are sent to that provider when the student submits a tutor question.

For public use, configure provider project budgets/spend monitoring and suitable auth controls. The per-account cap limits ordinary individual usage; it is not a guarantee of total cost if many accounts sign up. Failed model calls can still consume a daily request.

## 5. Verify with your real services

No live Supabase project or OpenAI credentials were supplied when this package was built. JavaScript syntax and mocked REST flows can be checked locally; actual email delivery, database policies and model access must be verified on your deployment:

- Sign in as one student and sync a small amount of progress.
- Sign out and sign in on a second browser; load the cloud document.
- Sign in as a different student and confirm that it cannot read or change the first student's progress.
- Confirm unauthenticated tutor calls are rejected, and a signed-in request returns a real answer.
- Confirm a hostile origin is rejected and the daily request cap is enforced.

AI answers are generated and may be wrong. Students should compare important results with course notes, data-booklet values and their teacher. The app renders replies as text and never executes returned HTML.

## Integration contract for the frontend

Load `config.js` before `auth.js`. `window.AtlasCloud` is a singleton:

- `await init(window.ATLAS_CONFIG)` → stored session or `null`; `isConfigured()` reports configuration presence.
- `await signIn(email)` → requests a code; `await verifyOtp(email, token)` → session.
- `await getSession()` → session or `null` (refreshes expiring sessions).
- `await signOut()` → clears the session, even if remote logout fails.
- `await loadProgress()` → `{payload, updated_at}` or `null`.
- `await saveProgress(data)` → saved row.
- `await ask([{role:'user',content:'...'}], selectedLessonText)` → answer string.

`atlas-auth-change` window events contain only `{signedIn,email}`, not tokens. Session/refresh tokens are kept in the current browser's local storage, like a normal SPA session. Do not log them or put them into URLs.

## Official implementation references (checked November 2026)

- [Supabase passwordless email](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- [Supabase email templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase server validation with getUser](https://supabase.com/docs/reference/javascript/auth-getuser)
- [Supabase Edge Function authentication](https://supabase.com/docs/guides/functions/auth)
- [OpenAI Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)
- [GitHub Pages custom workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
