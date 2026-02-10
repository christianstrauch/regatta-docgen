## Summary

**regatta.club Document Generator**, a professional application for race committees to compose Notices of Race (NoR) and Sailing Instructions (SI) documents. 

### OIDC only
**This application only works if you configure an OIDC authentication provider**: You can use Authentik, Keycloak, or anything else that supports OIDC and custom claims.

### Instructions
1. Copy .env.example to .env and modify it according to your environment, or use its environment variables directly in your `docker run` statement/`docker-compose.yml`.
2. ‼️ Mount whatever database path you define in the `DATABASE_PATH` environment variable as a volume to persist data
3. Create an application in your authentication provider, and make sure it delivers the claim you define as `OIDC_RACE_COMMITTEE_CLAIM`, and, optionally, what you define in `OIDC_RACE_COMMITTEE_LOGO_CLAIM`. The following is required to be able to save document sets in the application: The `OIDC_RACE_COMMITTEE_CLAIM` must be set to a claim, say, `race_committee`, that your identity provider can deliver for each user with the value of how the user's race committee is called. The `OIDC_RACE_COMMITTEE_LOGO_CLAIM` is optional - it allows a custom, race committee specific logo url to be retrieved from the identity provider.
4. If your identity provider needs the client to request a scope to get access to the above claim, you have to add it to `OIDC_SCOPE`, it's a space-separated list of scopes, for example `OIDC_SCOPE=openid profile email race_committee`.
5. Set `OIDC_USER_CLAIM` to one that returns a legible user name. Uniqueness is only critical for users in the same race committee. `OIDC_USER_CLAIM=preferred_username` should generally therefore be fine. If you want more uniqueness, feel free to use `OIDC_USER_CLAIM=email` or `OIDC_USER_CLAIM=sub`. The user's full name is currently read from the `name` claim by default.

>The application does intentionally not include user management. It completely relies on you defining an external OIDC identity source. Membership of users to race committees is solely defined by making that identity source return the right value for your `OIDC_RACE_COMMITTEE_CLAIM` per user. It's up to your configuration of the OIDC identity provider to resolve groups to that claim, or similar. If you have users that are members of more than one race committee, you will have to define a flow in your identity provider that allows them to select a race committee while authenticating. Authentik, Keycloak, and, with a bit of coding, Zitadel can do this just fine. 

Here's a `docker-compose.yml` you could use:
```yaml
volumes:
  data:
services:
  app:
    image: christianstrauch/rc-docgen:latest
    volumes:
      - data:/app/data
    environment:
      - "DATABASE_PATH=/app/data/regatta.db"
# OIDC Authentication Configuration
# The application will automatically discover endpoints from OIDC_ISSUER/.well-known/openid-configuration
      - "OIDC_ISSUER=https://your-oidc-provider.com"
      - "OIDC_CLIENT_ID=your-client-id"
      - "OIDC_CLIENT_SECRET=your-client-secret"
      - "OIDC_CALLBACK_URL=http://your-app-url:3000/api/auth/callback"
      - "OIDC_SCOPE=openid profile email"
      - "OIDC_USER_ID_CLAIM=sub"
      - "OIDC_RACE_COMMITTEE_CLAIM=org"
      - "OIDC_RACE_COMMITTEE_LOGO_CLAIM="
# Default logo URL used when no race committee-specific logo is provided
      - "LOGO_URL=https://example.com/logo.png"
      - "APP_NAME=My Race Document Set Generator"
      - "NODE_ENV=production"
```

Here's what the application includes:

### Key Features:

#### **Event Details Form** - Comprehensive form to capture all event information including:

1. Basic info (title, venue, dates, organizer)
2. Communication (VHF channel)
3. Entry & fees
4. Awards ceremony details
5. Technical requirements (scoring, certificates, time limits)
6. Contact information



#### **Rules Selector** - Interactive rule selection system featuring:

1. Racing Rules of Sailing 2025-2028
2. US Sailing Prescriptions
3. Appendices (T, P, V1, etc.)
4. Rules organized by category with accordion interface
5. Ability to select rules that only apply if specifically mentioned
6. Inline text modification for customizing rules
7. Visual indicators for modified rules
8. Separate selection for NoR and SI documents



#### **Custom Fields** - Flexible content management:

1. Add unlimited custom sections
2. Pre-suggested common fields (Restricted Areas, Safety Requirements, etc.)
3. Free-text input for custom content



#### **Document Preview & Export** - Professional markdown generation:

1. Side-by-side preview of NoR and SI documents
2. Properly formatted markdown with numbered sections
3. Download as .md files
4. Copy to clipboard functionality
5. Documents follow standard sailing regatta format based on the provided examples



#### **Design & UX**:

1. Nautical-themed color palette (blues and ocean colors)
2. Clean, professional interface inspired by documentation sites
3. Responsive layout
4. Tab-based navigation for workflow
5. Toast notifications for user feedback





The application intelligently separates rules into NoR and SI based on their typical usage, allows modifications to rule text (with visual indicators), and generates properly formatted markdown documents ready for publication.

### **Database & Persistence:**

- SQLite database with proper schema for race committees and regatta documents
- Database utilities for CRUD operations with proper access control


### **OIDC Authentication:**

- Complete OIDC integration with configurable provider settings
- User session management with JWT verification
- Race committee identification via configurable OIDC claims
- Login/logout flows with secure session cookies


### **Fleets/Divisions Management:**

- Fleet manager component to add/remove fleets
- Fleet-specific provisions that can apply to NoR, SI, or both
- Color-coded fleet visualization
- Support for conditional rules per fleet (e.g., autopilots for single-handed sailors)


### **Save/Load/Modify Documents:**

- Save documents to database under user's race committee
- Load existing documents from dropdown selector
- Modify and update saved documents
- Row-level security ensuring users only see their committee's documents
- New document creation functionality


### **HTML Preview:**

- Markdown to HTML conversion using 'marked' library
- Opens formatted documents in new browser window with professional styling
- Printable HTML output
- Maintains markdown download and clipboard copy features


### **Configurable Settings (via environment variables):**

- Logo URL configuration
- App name customization
- All OIDC settings (issuer, client ID/secret, callback URL, claim mappings)
- Database path configuration


### **Docker Containerization:**

- Complete Dockerfile with multi-stage build
- Automatic database initialization on container start
- Proper volume mounts for persistent data
- Optimized for production deployment
