# Postman Collection Setup Guide

This guide explains how to set up a Postman collection for the Portfolio CMS API.

## Method 1: Import OpenAPI Schema (Recommended)

### Step 1: Export the OpenAPI Schema

Run the export script from the backend directory:

```bash
cd backend
python scripts/export_openapi.py
```

This will generate two files in the `backend/docs/` directory:
- `openapi_schema.yml` - YAML format
- `openapi_schema.json` - JSON format

### Step 2: Import into Postman

1. Open Postman
2. Click **Import** in the top left corner
3. Select either `openapi_schema.yml` or `openapi_schema.json`
4. Postman will automatically create a collection with all endpoints
5. Save the collection as "Portfolio CMS API"

### Step 3: Configure Environment Variables

Create a Postman environment with the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `base_url` | `http://localhost:8000/api/v1` | API base URL for development |
| `access_token` | `{{login_response.data.access}}` | JWT access token (auto-set) |
| `refresh_token` | `{{login_response.data.refresh}}` | JWT refresh token (auto-set) |

### Step 4: Authentication Setup

1. Go to the Portfolio CMS API collection
2. Click on the **Authorization** tab
3. Select **Bearer Token** from the type dropdown
4. In the Token field, enter: `{{access_token}}`

### Step 5: Login Request Setup

Create a login request to get the JWT token:

1. Create a new POST request: `{{base_url}}/auth/login/`
2. In the Body tab, select **raw** and **JSON**
3. Add the following JSON:

```json
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

4. In the **Tests** tab, add this script to save the token:

```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.data.access);
    pm.environment.set("refresh_token", jsonData.data.refresh);
}
```

5. Save this request in a folder called "Authentication"

## Method 2: Manual Collection Creation

If you prefer to create the collection manually, here are the key endpoints:

### Authentication
- `POST {{base_url}}/auth/login/` - Login
- `POST {{base_url}}/auth/refresh/` - Refresh token
- `POST {{base_url}}/auth/logout/` - Logout

### Content Management
- `GET {{base_url}}/hero/` - List hero sections
- `POST {{base_url}}/hero/` - Create hero section
- `GET {{base_url}}/hero/{id}/` - Get hero section
- `PUT {{base_url}}/hero/{id}/` - Update hero section
- `DELETE {{base_url}}/hero/{id}/` - Delete hero section

Similar patterns apply to:
- About (`/about/`)
- Skills (`/skills/`)
- Tech Stack (`/techstack/`)
- Experience (`/experience/`)
- Education (`/education/`)
- Certifications (`/certifications/`)
- Projects (`/projects/`)
- Blogs (`/blogs/`)
- Services (`/services/`)
- Clients (`/clients/`)
- Contact (`/contact/`)
- Socials (`/socials/`)
- Resume (`/resume/`)
- Media (`/media/`)

### Settings & Configuration
- `GET {{base_url}}/settings/` - Get site settings
- `PUT {{base_url}}/settings/` - Update site settings

## Common Postman Scripts

### Save Token After Login
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.data.access);
    pm.environment.set("refresh_token", jsonData.data.refresh);
}
```

### Clear Token After Logout
```javascript
if (pm.response.code === 200) {
    pm.environment.unset("access_token");
    pm.environment.unset("refresh_token");
}
```

### Auto-Refresh Token on 401
```javascript
if (pm.response.code === 401) {
    const refreshToken = pm.environment.get("refresh_token");
    if (refreshToken) {
        pm.sendRequest({
            url: pm.environment.get("base_url") + "/auth/refresh/",
            method: "POST",
            header: {
                "Content-Type": "application/json",
            },
            body: {
                mode: "raw",
                raw: JSON.stringify({ refresh: refreshToken })
            }
        }, function (err, res) {
            if (res.code === 200) {
                const jsonData = res.json();
                pm.environment.set("access_token", jsonData.data.access);
                pm.environment.set("refresh_token", jsonData.data.refresh);
            }
        });
    }
}
```

## Testing Tips

1. **Use Collection Runner**: Run multiple requests in sequence
2. **Add Delays**: Add delays between requests if needed
3. **Data Files**: Use CSV/JSON files for bulk testing
4. **Assertions**: Add test assertions to validate responses

## Exporting the Collection

Once configured, export your Postman collection:

1. Click the **...** next to the collection name
2. Select **Export**
3. Choose Collection v2.1 format
4. Save the file as `portfolio_cms_api_collection.json`

Share this file with your team for consistent API testing.
