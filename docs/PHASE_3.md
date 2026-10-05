# Phase 3 — JWT Authentication & API Security Summary

## 1. Implementation Summary

Phase 3 established the security and token lifecycle foundation for **Manoj Khatri Portfolio (`manojkcportfolio`)**, providing standard JSON Web Token authentication using `djangorestframework-simplejwt`.

* **Dependency**: `djangorestframework-simplejwt`
* **App**: `apps.authentication`
* **URL Prefix**: `/api/v1/auth/`
* **Status**: Complete & Verified (82/82 backend tests passing, 0 Django check issues, 119/119 frontend tests passing)

---

## 2. Authentication Endpoints Implemented

| Method | Canonical Endpoint | Permission | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/token/` | `AllowAny` | Issue access + refresh tokens (supports username or email) |
| `POST` | `/api/v1/auth/token/refresh/` | `AllowAny` | Exchange valid refresh token for new access token |
| `POST` | `/api/v1/auth/token/verify/` | `AllowAny` | Cryptographically verify JWT validity and expiration |
| `GET` | `/api/v1/auth/me/` | `IsAuthenticated` | Inspect current administrator's identity and permissions |
| `POST` | `/api/v1/auth/change-password/` | `IsAuthenticated` | Update administrator password with validation rules |
| `POST` | `/api/v1/auth/logout/` | `IsAuthenticated` | Blacklist refresh token to invalidate active session |

---

## 3. Permission Model

* **Public APIs (`AllowAny`)**:
  * Profile, Projects, Skills, Experience, Uses, Currently Building, Services, Articles, Resume downloads, and Inquiry submissions.
* **Protected Operations (`IsAuthenticated` / Staff Check)**:
  * Admin `/me/` endpoint, password rotation, token revocation, and future administrative CRUD endpoints.

---

## 4. Security Controls

* **Cryptographic Signatures**: HMAC-SHA256 signing with environment-configured secret key.
* **Token Lifetimes**: Access tokens expire in 15 minutes; refresh tokens expire in 7 days.
* **Token Blacklisting**: Revoked refresh tokens are persisted in `token_blacklist` to prevent replay attacks.
* **Password Validation Suite**: Enforces Django's `MinimumLengthValidator`, `CommonPasswordValidator`, and `NumericPasswordValidator`.
* **Zero Secrets in Code**: Credentials and keys are managed via environment variables.

---

## 5. Test Suite Verification

* **Authentication Tests**: `apps.authentication.tests.AuthenticationTests`
  * Valid login with username and email
  * Case-insensitive email login
  * Missing/invalid credentials rejection
  * Token refresh & verify lifecycle
  * Unauthenticated `/me/` rejection (401)
  * Authenticated `/me/` safe response
  * Password rotation validation & old-credential invalidation
  * Logout & token blacklisting verification
* **Total Backend Tests**: `82/82 PASS`
* **Total Frontend Tests**: `119/119 PASS`

---

## 6. Known Limitations

* **No Multi-Tenancy**: The portfolio is single-tenant and tailored specifically for Manoj Khatri's administration.
* **No Social OAuth**: Pure JWT username/email auth is used without third-party OAuth providers.

---

## 7. Recommended Next Phase

* **Phase 4**: Public Read-Only REST API Endpoints & Serializers (completed and verified).
* **Phase 5**: Frontend React Integration with canonical Django REST API (Profile, Projects, Skills, Experience, Uses, and Writing completed).
