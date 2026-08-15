# AUTHENTICATION ARCHITECTURE

**Date:** 2024-08-08  
**Status:** Phase 2 Complete - Backend HttpOnly Cookies Implemented

---

## CURRENT JWT IMPLEMENTATION

### Configuration (backend/config/settings.py)

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}
```

### Token Lifetimes

- **Access Token:** 60 minutes
- **Refresh Token:** 7 days
- **Rotation:** Enabled
- **Blacklisting:** Enabled after rotation

### Custom Claims (CustomTokenObtainPairSerializer)

- email
- role
- full_name
- is_verified

### Security Features

1. **Account Lockout:** 5 failed attempts, 30-minute lockout
2. **Login Logging:** IP, user agent, device, location
3. **Failed Login Reset:** On successful login
4. **Token Blacklisting:** On logout

---

## IMPLEMENTED CHANGES (Phase 2)

### 1. HttpOnly Cookie Support for Refresh Tokens ✅

**Purpose:** Prevent XSS token theft

**Implementation:**
- Refresh token now set as HttpOnly cookie on login
- Cookie attributes: HttpOnly, Secure (production), SameSite=Lax
- CustomTokenRefreshView reads from cookie
- Logout clears cookie
- Refresh token removed from response body

**Files Changed:**
- `backend/apps/accounts/views.py` - CustomTokenObtainPairView, CustomTokenRefreshView, LogoutView
- `backend/apps/accounts/urls.py` - Updated to use CustomTokenRefreshView

**Cookie Configuration:**
```python
response.set_cookie(
    'refresh_token',
    refresh_token,
    max_age=7 * 24 * 60 * 60,  # 7 days
    httponly=True,
    secure=not settings.DEBUG,
    samesite='Lax',
    path='/'
)
```

### 2. Session Timeout ⏳

**Purpose:** Limit exposure window for compromised sessions

**Status:** Deferred to Phase 3 (Admin Frontend)
- Session timeout is primarily a frontend concern
- Will be implemented in the separate admin frontend
- 30-minute idle timeout planned

**Frontend Implementation Required:**
- Activity tracking
- Timeout countdown
- Auto-logout

---

## CURRENT STATUS

**JWT Implementation:** ✅ Working
- Token rotation: Yes
- Blacklisting: Yes
- Account lockout: Yes
- Login logging: Yes

**Token Storage:** ✅ Improved
- Refresh token: HttpOnly cookie (XSS protected)
- Access token: In memory (recommended for admin)
- Legacy localStorage support: Still works for backward compatibility

**Session Timeout:** ⏳ Pending
- Will be implemented in Phase 3 (Admin Frontend)

---

## BACKWARD COMPATIBILITY

The implementation maintains backward compatibility:
- CustomTokenRefreshView checks cookie first, then falls back to request body
- LogoutView checks cookie first, then falls back to request body
- Existing public frontend using localStorage will continue to work
- New admin frontend will use HttpOnly cookies

---

## NEXT STEPS

1. Phase 3: Create separate admin frontend
2. Implement session timeout in admin frontend (30 minutes)
3. Update admin frontend to use HttpOnly cookies
4. Test authentication flow with both frontends

---

**Updated:** 2024-08-08  
**Phase 2 Status:** Backend Complete - Frontend Deferred to Phase 3
