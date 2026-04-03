# ScheMatch Production Backend (Firebase Functions + Express)

This backend provides a production-ready, Firebase-native API for:

- Rule-based eligibility checking (`POST /check-eligibility`)
- Query logging in Firestore (`users`, `queries`, `schemes`)
- Google Sheets logging (new `Query_<timestamp>` sheet per API call)
- Admin analytics and query management APIs
- Caching and performance-aware rule evaluation

It uses **no external AI APIs**.

---

## Folder Structure

```text
.
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── functions/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── index.js
│       ├── local.js
│       ├── config/
│       │   ├── env.js
│       │   ├── firebaseAdmin.js
│       │   └── sheets.js
│       ├── middleware/
│       │   ├── admin.js
│       │   ├── auth.js
│       │   ├── errorHandler.js
│       │   └── validate.js
│       ├── routes/
│       │   ├── adminRoutes.js
│       │   └── eligibilityRoutes.js
│       ├── scripts/
│       │   ├── seedSchemes.js
│       │   └── setAdminClaim.js
│       ├── services/
│       │   ├── analyticsService.js
│       │   ├── cacheService.js
│       │   ├── eligibilityEngine.js
│       │   ├── queryService.js
│       │   ├── schemeService.js
│       │   ├── sheetsLogger.js
│       │   └── userService.js
│       └── utils/
│           ├── asyncHandler.js
│           ├── constants.js
│           ├── errors.js
│           ├── hash.js
│           └── profile.js
└── package.json
```

---

## Core Features Implemented

## 1) Eligibility Engine

- Structured scheme rules in Firestore `schemes` collection
- Condition shape:
  - `field`, `operator`, `value`, `weight`, `required`, `explanation`
- Supported operators:
  - `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`, `between`, `contains`, `exists`
- Engine behavior:
  - Normalizes profile
  - Evaluates all scheme conditions
  - Computes weighted match percentage
  - Enforces required-rule failures
  - Ranks by eligibility, score, then priority
  - Returns human-readable explanations

## 2) Public API

### `POST /check-eligibility`

Auth required: Firebase ID token via `Authorization: Bearer <token>`

Input payload:

```json
{
  "age": 28,
  "income": 240000,
  "state": "Maharashtra",
  "category": "SC",
  "occupation": "farmer",
  "flags": ["female", "landholder"]
}
```

Output includes:

- Ranked schemes
- Match score per scheme
- Condition-level explanations
- Cache hit flag
- Query ID

## 3) Firestore Storage

Collections:

- `users`
- `queries`
- `schemes`
- `query_cache` (bonus cache)

Each query stores:

- normalized input
- results
- top scheme IDs
- score summary
- timestamp
- request metadata

## 4) Google Sheets Integration

On every eligibility API call:

- Creates new sheet tab named `Query_<timestamp>`
- Inserts input + ranked results
- Uses service account auth
- Uses batch APIs for writes and formatting

If `REQUIRE_SHEETS_LOGGING=true`, failures will fail request. If false, request succeeds with warning.

## 5) Admin Backend

All admin routes require:

- valid Firebase Auth token
- custom claims (`admin: true` or `role: "admin"`)

Routes:

- `GET /admin/queries` (filters + pagination)
- `GET /admin/queries/:id` (full details)
- `GET /admin/analytics/summary?days=30` (top schemes + trends)

## 6) Performance Optimizations

- Firestore indexes (`firestore.indexes.json`)
- in-memory TTL cache for active schemes
- Firestore-backed cache for repeated eligibility requests
- compact operator map + low-overhead evaluation loops

## 7) Security

- Strict input validation middleware
- Firebase Auth middleware
- Admin guard middleware for privileged routes
- Firestore security rules included

---

## Environment Variables

Copy `functions/.env.example` to `functions/.env` and set:

```env
FIREBASE_PROJECT_ID=your-firebase-project-id
FUNCTION_REGION=asia-south1
SHEETS_SPREADSHEET_ID=your-google-sheet-id
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
CACHE_TTL_SECONDS=600
SCHEME_CACHE_TTL_SECONDS=300
MAX_RESULTS=20
REQUIRE_SHEETS_LOGGING=true
LOCAL_PORT=5001
CORS_ORIGIN=*
```

---

## Firebase Setup Guide

1. Create/select Firebase project.
2. Enable:
   - Firestore
   - Firebase Authentication (your desired providers)
   - Cloud Functions
3. Install CLI and login:

```bash
npm i -g firebase-tools
firebase login
firebase use <your-project-id>
```

4. Install backend deps:

```bash
npm run backend:install
```

5. Deploy rules/indexes/functions:

```bash
npm run backend:deploy
```

---

## Google Sheets Setup Guide

1. In Google Cloud Console (same project or trusted project):
   - Enable **Google Sheets API**.
2. Create service account.
3. Create key (JSON).
4. Share target spreadsheet with service account email (`Editor`).
5. Put spreadsheet ID in `SHEETS_SPREADSHEET_ID`.
6. Put service account JSON into `GOOGLE_SERVICE_ACCOUNT_JSON` (raw JSON string or base64-encoded JSON).

---

## Local Development

Run Express-compatible local server:

```bash
npm run backend:start
```

Run Firebase emulators:

```bash
npm run backend:serve
```

Health check:

```bash
GET http://localhost:5001/health
```

---

## Operational Scripts

Seed sample schemes:

```bash
npm run backend:seed
```

Grant admin custom claim:

```bash
npm --prefix functions run set-admin -- <firebase_uid>
```

---

## API Summary

### Public

- `POST /check-eligibility`

### Admin

- `GET /admin/queries`
  - filters: `uid`, `state`, `category`, `schemeId`, `from`, `to`, `minScore`, `limit`, `cursor`
- `GET /admin/queries/:id`
- `GET /admin/analytics/summary?days=30`

---

## Deployment Steps (Production)

1. Configure `functions/.env` with production values.
2. Ensure service account access to sheet.
3. Deploy:

```bash
npm run backend:deploy
```

4. Seed schemes:

```bash
npm run backend:seed
```

5. Set first admin user:

```bash
npm --prefix functions run set-admin -- <uid>
```

6. Update frontend/API client to call deployed function endpoint.
