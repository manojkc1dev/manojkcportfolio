# Manoj Khatri | Backend Software Engineer Portfolio

Personal portfolio and engineering showcase for **Manoj K.C. (Manoj Khatri)**, Backend Software Engineer specializing in Python, Django, DRF, PostgreSQL, and high-performance REST APIs.

- **Live Production URL**: [https://manojkc1.com.np](https://manojkc1.com.np)
- **Email**: [manojkc1@gmail.com](mailto:manojkc1@gmail.com)
- **Phone**: +977 9842203976
- **GitHub**: [@manojkc1dev](https://github.com/manojkc1dev/)
- **LinkedIn**: [in/manojkc1dev](https://linkedin.com/in/manojkc1dev/)
- **Socials**: `@manojkc1dev` across X, Instagram, Facebook, and TikTok

---

## Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion)
- **Backend / API**: Node.js & Express / Firebase Cloud Functions for contact form handling
- **Database & Services**: Firebase Firestore & Firebase Auth (with automatic graceful fallback)
- **Analytics**: Privacy-conscious opt-in analytics with UTM campaign & referral tracking
- **Testing**: Vitest, React Testing Library, jsdom
- **Performance & PWA**: Route-level code splitting (`React.lazy` + `Suspense`), Web Manifest, Service Worker ready, SEO meta tags, OpenGraph, JSON-LD structured schema

---

## Graceful Firebase Fallback

The application is engineered to boot seamlessly **with or without** Firebase environment variables:
- If environment variables are missing, the app runs in **UI-only mode** with no console errors or crashes.
- `isFirebaseConfigured` is exported from `src/firebase.ts` and guards all cloud database/auth operations.
- The contact form informs visitors when running in UI-only mode and captures simulated submissions without network failures.

---

## Getting Started & Local Development

### 1. Prerequisites
- Node.js >= 18
- npm >= 9

### 2. Installation
```bash
git clone https://github.com/manojkc1dev/portfolio.git
cd portfolio
npm install
```

### 3. Running Development Server
```bash
npm run dev
```
The development server will start on [http://localhost:3000](http://localhost:3000).

### 4. Running Tests
```bash
# Run unit & component tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### 5. Type Checking & Formatting
```bash
# Type check with TypeScript compiler
npm run lint

# Format code with Prettier
npm run format
```

---

## Environment Variables & Configuration

Copy `.env.example` to `.env` to configure Firebase for production message persistence:

```bash
cp .env.example .env
```

| Variable | Description | Default / Required |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key | Optional (graceful fallback) |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Optional |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | Optional |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Cloud Storage Bucket | Optional |
| `VITE_FIREBASE_MESSAGING_SENDER_ID`| FCM Sender ID | Optional |
| `VITE_FIREBASE_APP_ID` | Firebase Web App ID | Optional |
| `VITE_FIREBASE_MEASUREMENT_ID` | Google Analytics Measurement ID | Optional |

---

## Custom Domain Setup (`manojkc1.com.np`)

To link the custom domain `manojkc1.com.np`:
1. **Firebase Console**: Navigate to **Hosting** -> **Add Custom Domain** and enter `manojkc1.com.np`.
2. **DNS Records**: In your domain registrar (e.g., Mercantile Communications / `.np` domain portal or Cloudflare):
   - **Type A**: Point `@` to the two IP addresses provided by Firebase Hosting.
   - **Type TXT**: Add the verification token record requested by Firebase.
3. Firebase automatically provisions and renews an SSL/TLS certificate within 24 hours.

---

## Production Deployment

To build and deploy the application to Firebase Hosting:

```bash
# Run tests and type check
npm run lint
npm run test

# Build and deploy to production
npm run deploy:prod
```

Or emulate Firebase services locally:
```bash
npm run emulate
```

---

## Updating Portfolio Content

All content is strictly separated into clean, typed data modules in `src/data/`:
- **Projects**: Edit `src/data/projects.ts` to add or update case studies, screenshots, live links, and GitHub repositories.
- **Experience & Education**: Edit `src/data/experience.ts` to modify timeline items, skills acquired, and roles.
- **Skills**: Edit `src/data/skills.ts` to update core backend technologies, frameworks, and tools.
- **Resume**: Replace `/public/resume.pdf` with your latest updated CV.
- **Socials & Contacts**: All social links are centralized under `@manojkc1dev` handles across `Hero.tsx`, `Contact.tsx`, and `Footer.tsx`.

---

## License

MIT © Manoj K.C. (Manoj Khatri)
