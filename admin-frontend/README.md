# Portfolio CMS Admin Frontend

Separate admin panel for Portfolio CMS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Architecture

- Separate from public frontend
- Uses HttpOnly cookies for refresh tokens
- Port: 3001 (development)
- Domain: admin.example.com (production)

## Authentication

- JWT with HttpOnly cookies
- Session timeout: 30 minutes (planned)
- MFA support (planned)
