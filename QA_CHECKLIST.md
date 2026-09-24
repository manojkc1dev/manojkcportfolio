# Portfolio QA & Audit Checklist

Audit checklist for Manoj K.C.'s Portfolio (`https://manojkc1.com.np`).

---

## 1. Accessibility (WCAG 2.1 AA Compliance)

- [x] **Semantic Landmarks**: Standard HTML5 landmarks (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<article>`) utilized across all views.
- [x] **Skip-to-Content Link**: `#main-content` skip link rendered as the very first focusable DOM element with tab-to-reveal focus styling.
- [x] **Keyboard Navigation**: All interactive elements (buttons, links, copy toggles, modal dialogs) are navigable using `Tab`, `Shift+Tab`, `Enter`, and `Space`.
- [x] **Visible Focus Indicators**: High-contrast, tailored focus rings (`focus-visible:ring-2 focus-visible:ring-indigo-500`) on all interactive controls.
- [x] **Accessible Names & Labels**:
  - Social media and external link icons include explicit `aria-label` tags and descriptive `title` attributes.
  - Form inputs (`name`, `email`, `message`) contain associated `<label>` elements with `htmlFor` bindings and `aria-describedby` for error states.
  - Availability status badge includes a descriptive `aria-label`.
- [x] **Reduced Motion Support**:
  - Framer Motion animations respect `prefers-reduced-motion: reduce` via `useReducedMotion()` and `MotionConfig`.
  - Cursor spotlight and heavy hover shifts are deactivated when reduced motion is detected or on touch devices.
- [x] **Color Contrast**: All text pairings meet WCAG AA minimum contrast ratio (4.5:1 for body copy, 3:1 for large display titles) across both light and dark themes.

---

## 2. Search Engine Optimization (SEO) & Social Sharing

- [x] **Title & Meta Descriptions**: Canonical title tag "Manoj K.C. | Backend Software Engineer (Python, Django, REST APIs)" and keyword-rich description.
- [x] **Canonical Link**: `<link rel="canonical" href="https://manojkc1.com.np" />` configured.
- [x] **OpenGraph & Twitter Cards**:
  - `og:title`, `og:description`, `og:image`, `og:url`, `og:type` tags in `<head>`.
  - `twitter:card` set to `summary_large_image`, `twitter:creator` set to `@manojkc1dev`.
- [x] **JSON-LD Structured Data**:
  - `Person` schema with name, jobTitle, url, sameAs profiles (GitHub, LinkedIn, Twitter, etc.).
  - `WebSite` schema detailing search and portfolio authority.
- [x] **Robots & Sitemap**:
  - `/robots.txt` allowing indexing and pointing to `/sitemap.xml`.
  - `/sitemap.xml` providing updated canonical routes and change frequencies.
  - `/humans.txt` attributing author and development technologies.

---

## 3. Security & Privacy Hardening

- [x] **Graceful Fallback**: App boots safely when environment variables or Firebase credentials are absent without throwing uncaught exceptions.
- [x] **Honeypot Form Anti-Spam**: Hidden spam trapping inputs (`_hp`, `hp_field`) prevent automated bot submissions.
- [x] **Client-Side Input Validation**: Validates string lengths, email regex patterns, and empty states before dispatch.
- [x] **Safe External Links**: Every external anchor tag enforces `rel="noopener noreferrer"` and `target="_blank"` to protect against tab-napping and referrer leaks.
- [x] **Security Policy (`security.txt`)**: Located at `/.well-known/security.txt` containing contact email and encryption policies.
- [x] **Secret Hygiene**: Zero API keys or secrets hardcoded in client bundles; all private configuration resides in `.env`.

---

## 4. Performance & Core Web Vitals

- [x] **Code Splitting**: Route-level dynamic imports with `React.lazy` and lightweight skeleton fallback `Suspense`.
- [x] **Image Optimization**: Project media assets utilize `loading="lazy"`, `decoding="async"`, and `referrerPolicy="no-referrer"`.
- [x] **Font Stack & CLS Prevention**: Preloaded primary typography with robust system font fallbacks (`ui-sans-serif, system-ui, sans-serif`) to eliminate Layout Shifts.
- [x] **Scroll & Resize Throttling**: Passive listeners and RAF-based debouncing applied to scroll progress bars and cursor spotlight effects.
- [x] **PWA Compliance**: `site.webmanifest` configured with app names, theme colors (`#4f46e5`), and app icons.

---

## 5. Automated Testing & Verification

- [x] **Unit & Component Tests**: 17 tests across 5 test suites running on Vitest:
  - `Hero.test.tsx` (Name rendering, CTA buttons, Availability badge)
  - `ProjectCard.test.tsx` (Agritech title, Tagline, Tech stack chips, Link attributes)
  - `ContactForm.test.tsx` (Validation errors, Invalid email formats, API dispatch, Success toast, Error handling)
  - `ThemeToggle.test.tsx` (HTML class toggling, LocalStorage persistence, System prefers-color-scheme detection)
  - `Socials.test.tsx` (All handles link to `@manojkc1dev`, Mailto points to `manojkc1@gmail.com`)
- [x] **Static Type Checking**: `npm run lint` (`tsc --noEmit`) passes with 0 errors.
- [x] **Production Bundle**: `npm run build` generates optimized static assets in `/dist`.
