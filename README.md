# BucketLife

BucketLife is a production-oriented bucket list PWA built with React, Vite, TypeScript, Tailwind CSS v4, and Firebase. It supports multi-user authentication, item collaboration, completion tracking, and an admin read-only dashboard.

## Stack

- React 19 + Vite 7 + TypeScript
- Tailwind CSS v4
- Firebase Authentication and Firestore
- React Router
- vite-plugin-pwa

## Features

- Email/password signup, Google OAuth login/signup, session persistence, and logout
- Personal bucket list CRUD with completion tracking
- Collaboration on shared items
- Read-only admin dashboard for all users
- Responsive UI with loading, empty, and error states
- PWA install support and runtime caching

## Project structure

```text
src/
  components/
  context/
  hooks/
  pages/
  services/
  types/
  utils/
```

## Firebase setup

1. Create a Firebase project.
2. Enable Email/Password and Google in Authentication.
3. Create a Firestore database in production mode.
4. Copy `.env.example` to `.env` and fill in your Firebase web app credentials.
5. Deploy the included Firestore rules:

```bash
firebase deploy --only firestore:rules
```

6. Create your first admin by editing that user's Firestore document in `users/{uid}` and changing `role` from `user` to `admin`.

## Firestore data model

### `users/{uid}`

```json
{
  "uid": "auth uid",
  "email": "person@example.com",
  "role": "user"
}
```

### `bucketItems/{id}`

```json
{
  "userId": "owner uid",
  "title": "See the northern lights",
  "description": "Optional notes",
  "completed": false,
  "collaborators": [{ "userId": "collab uid", "role": "editor" }],
  "collaboratorIds": ["collab uid"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

`collaboratorIds` is stored alongside `collaborators` so Firestore queries and security rules can efficiently match shared access.

## Required indexes

Create these Firestore composite indexes if the console prompts for them:

- Collection: `bucketItems`
- Fields: `userId` ascending, `createdAt` descending

- Collection: `bucketItems`
- Fields: `collaboratorIds` array contains, `createdAt` descending

## Local development

```bash
npm install
npm run dev
```

## Vercel deployment

1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Add all `VITE_FIREBASE_*` environment variables in the Vercel project settings.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy.

If you need SPA fallback routing, add a `vercel.json` rewrite:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

## Notes

- Firestore local persistence is enabled with multi-tab support.
- Admin access is enforced in Firebase rules, not only in the UI.
- Image uploads are currently disabled to keep the stack focused on Firestore-only list management.
