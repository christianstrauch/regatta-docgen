# regatta.club Document Generator - Setup Guide

## Environment Variables

All configuration is done via environment variables. Copy `.env.example` to `.env` and configure:

### Required Variables

#### Database
- `DATABASE_PATH`: Path to SQLite database file (default: `./data/regatta.db`)

#### OIDC Authentication
- `OIDC_ISSUER`: Your OIDC provider's issuer URL (e.g., `https://auth.example.com`)
  - The app will automatically fetch endpoints from `{OIDC_ISSUER}/.well-known/openid-configuration`
- `OIDC_CLIENT_ID`: OAuth2 client ID from your OIDC provider
- `OIDC_CLIENT_SECRET`: OAuth2 client secret from your OIDC provider
- `OIDC_CALLBACK_URL`: Full callback URL (e.g., `https://regatta.example.com/api/auth/callback`)

#### OIDC Claims
- `OIDC_USER_ID_CLAIM`: Claim containing user identifier (default: `sub`)
- `OIDC_RACE_COMMITTEE_CLAIM`: Claim containing race committee identifier (default: `org`)
  - Users with the same value in this claim will share documents

### Optional Variables

- `LOGO_URL`: URL to organization logo image
- `APP_NAME`: Application name (default: "regatta.club Document Generator")
- `NODE_ENV`: `development` or `production`

## Database Initialization

The database will be automatically initialized when the app starts. To manually initialize:

```bash
node scripts/init-db.js
```

The script will:
1. Read `DATABASE_PATH` from environment
2. Create parent directories if needed
3. Create tables: `race_committees`, `regatta_documents`
4. Set up indexes for performance

## Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t regatta-generator .

# Run container
docker run -d \
  -p 3000:3000 \
  -v /path/to/data:/home/user/data \
  -e DATABASE_PATH=/home/user/data/regatta.db \
  -e OIDC_ISSUER=https://auth.example.com \
  -e OIDC_CLIENT_ID=your-client-id \
  -e OIDC_CLIENT_SECRET=your-secret \
  -e OIDC_CALLBACK_URL=https://regatta.example.com/api/auth/callback \
  --name regatta-generator \
  regatta-generator
```

### Important Notes
- Always mount a volume for `/home/user/data` to persist the database
- The container expects a reverse proxy to handle SSL/TLS
- Database is automatically initialized on container start

## OIDC Provider Configuration

Your OIDC provider must:
1. Expose a `.well-known/openid-configuration` endpoint
2. Support the Authorization Code flow
3. Include required claims in ID token:
   - User identifier claim (default: `sub`)
   - Race committee identifier claim (default: `org` or custom)

### Example with Keycloak
- Set up a new client with "Confidential" access type
- Enable "Standard Flow" (Authorization Code)
- Add redirect URI: `https://your-domain.com/api/auth/callback`
- Configure mappers to include race committee in claims

### Example with Auth0
- Create a new Regular Web Application
- Add Allowed Callback URLs: `https://your-domain.com/api/auth/callback`
- Configure Rules or Actions to add race committee claim

## Development

```bash
# Install dependencies
pnpm install --no-frozen-lockfile

# Initialize database
node scripts/init-db.js

# Start development server
pnpm dev
```

## Troubleshooting

### Database Issues
- Check that `DATABASE_PATH` is set and the directory exists
- Verify write permissions on the database directory
- Run `node scripts/init-db.js` to recreate schema

### OIDC Issues
- Verify `.well-known/openid-configuration` endpoint is accessible
- Check browser console and server logs for OIDC discovery errors
- Ensure callback URL matches exactly in provider config
- Verify claims are present in ID token (check JWT at jwt.io)

### Installation Issues with better-sqlite3
If you encounter build issues with `better-sqlite3`:
```bash
pnpm install --no-frozen-lockfile
```

The package.json includes `"neverBuiltDependencies": []` to handle pre-built binaries.
