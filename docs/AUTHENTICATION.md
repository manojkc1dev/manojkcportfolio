# Authentication & API Security Architecture

This document defines the authentication architecture, token lifecycle, endpoint contracts, permission models, and security practices implemented for the **Manoj Khatri Portfolio (`manojkcportfolio`)** backend.

---

## 1. Authentication Architecture

The portfolio application implements a clear separation between **public read-only consumers** and **administrative mutation operators**:

```text
                    MANOJ K.C. PORTFOLIO
                           |
             +-------------+-------------+
             |                           |
          PUBLIC                       ADMIN
             |                           |
      React Portfolio             Admin Interface
             |                           |
             +-------------+-------------+
                           |
                    Django REST API
                           |
                    PostgreSQL
```

* **Public Consumers (Visitors)**: Query portfolio content (profile, projects, skills, experience, uses, articles) freely without authentication or tokens.
* **Administrative Operators**: Must authenticate via JWT (JSON Web Tokens) to access protected API endpoints, inspect private telemetry, and manage portfolio content.

---

## 2. JWT Lifecycle & SimpleJWT

The system utilizes `djangorestframework-simplejwt` with cryptographic HMAC-SHA256 signing.

* **Access Token**: Short-lived credential (default: 15 minutes) passed in the `Authorization: Bearer <token>` header on protected API requests.
* **Refresh Token**: Longer-lived credential (default: 7 days) used strictly to request refreshed access tokens or invalidate sessions upon logout.
* **Token Blacklisting**: Enabled via `rest_framework_simplejwt.token_blacklist` to guarantee that logged-out or rotated refresh tokens cannot be reused.

---

## 3. Canonical Authentication Endpoints

All authentication routes are mounted under `/api/v1/auth/`:

| Method | Endpoint | Permission | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/token/` | `AllowAny` | Obtain JWT access and refresh token pair via username or email. |
| `POST` | `/api/v1/auth/token/refresh/` | `AllowAny` | Issue a new access token using a valid, unexpired refresh token. |
| `POST` | `/api/v1/auth/token/verify/` | `AllowAny` | Cryptographically verify validity and expiration of a JWT token. |
| `GET` | `/api/v1/auth/me/` | `IsAuthenticated` | Retrieve safe identity and role information for current administrator. |
| `POST` | `/api/v1/auth/change-password/` | `IsAuthenticated` | Rotate administrator password with validation and current password check. |
| `POST` | `/api/v1/auth/logout/` | `IsAuthenticated` | Revoke and blacklist refresh token, invalidating subsequent refresh requests. |

### Compatibility Aliases
For backward compatibility with existing clients:
* `POST /api/token/` → `PortfolioTokenObtainPairView`
* `POST /api/auth/login/` → `PortfolioTokenObtainPairView`
* `POST /api/auth/change-password/` → `ChangePasswordView`

---

## 4. Endpoint Specifications

### 4.1 Login / Token Issuance
* **Endpoint**: `POST /api/v1/auth/token/`
* **Request Payload**:
  ```json
  {
    "username": "manojadmin",
    "password": "SecurePassword123!"
  }
  ```
  *(Or optionally supply `"email"` instead of `"username"`)*
* **Success Response (200 OK)**:
  ```json
  {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "manojadmin",
      "email": "manojkc1dev@gmail.com",
      "first_name": "Manoj",
      "last_name": "Khatri",
      "is_staff": true,
      "is_superuser": true,
      "date_joined": "2026-10-01T00:00:00Z"
    }
  }
  ```

### 4.2 Current User Profile (`/me/`)
* **Endpoint**: `GET /api/v1/auth/me/`
* **Headers**: `Authorization: Bearer <access_token>`
* **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "username": "manojadmin",
    "email": "manojkc1dev@gmail.com",
    "first_name": "Manoj",
    "last_name": "Khatri",
    "is_staff": true,
    "is_superuser": true,
    "date_joined": "2026-10-01T00:00:00Z"
  }
  ```
  *(Sensitive fields like password hashes, salts, and secret keys are never exposed)*

### 4.3 Change Password
* **Endpoint**: `POST /api/v1/auth/change-password/`
* **Headers**: `Authorization: Bearer <access_token>`
* **Request Payload**:
  ```json
  {
    "old_password": "CurrentPassword123!",
    "new_password": "NewSuperSecurePassword2026!"
  }
  ```
* **Validation Rules**:
  * `old_password` must match the current password hash.
  * `new_password` must pass Django's active password validator suite (`MinimumLengthValidator`, `CommonPasswordValidator`, `NumericPasswordValidator`).
  * `new_password` must not be identical to `old_password`.

---

## 5. Public vs Protected Permission Strategy

### 5.1 Public Endpoints (`AllowAny`)
All standard portfolio data reads require no authentication:
* `GET /api/v1/profile/`
* `GET /api/v1/projects/`
* `GET /api/v1/projects/<slug>/`
* `GET /api/v1/skills/`
* `GET /api/v1/experience/`
* `GET /api/v1/experience/<id>/`
* `GET /api/v1/uses/`
* `GET /api/v1/currently-building/`
* `GET /api/v1/services/`
* `GET /api/v1/services/<slug>/`
* `GET /api/v1/articles/`
* `GET /api/v1/articles/<slug>/`
* `GET /api/v1/resume/`
* `GET /api/v1/resume/download/`
* `POST /api/v1/inquiries/` (Public ingestion with IP rate-limiting & honeypot)

### 5.2 Protected Administrative Operations (`IsAuthenticated`)
All data mutations and administrative views require valid authentication and staff/superuser permissions:
* `POST`, `PUT`, `PATCH`, `DELETE` operations on content models
* `GET /api/v1/auth/me/`
* `POST /api/v1/auth/change-password/`
* `POST /api/v1/auth/logout/`

---

## 6. Security Controls

1. **Token Lifetime Management**: Short-lived access tokens minimize blast radius if intercepted.
2. **Blacklist on Rotation / Logout**: Prevents replay attacks using stale refresh tokens.
3. **No Credential Logging**: Passwords and raw tokens are excluded from application logs.
4. **Environment-Driven Configuration**: Secret keys, token durations, and CORS origins are configured via environment variables.
5. **No Blind Frontend Trust**: Client route guards are treated as UX helpers; all security is strictly enforced on the server.
