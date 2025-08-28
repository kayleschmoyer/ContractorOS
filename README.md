# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Authentication

The web app uses Firebase Authentication. Set the following environment variables in `apps/web/.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=<your key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your project id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<sender id>
NEXT_PUBLIC_FIREBASE_APP_ID=<app id>
```

## Testing

Install dependencies and run the tests:

```
npm install
npm test
```

Vitest covers basic form validation and password reset flow.
