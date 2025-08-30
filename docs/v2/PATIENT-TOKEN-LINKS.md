## Patient Tokenized Links

Public flow to allow patients to answer questionnaires without a full login.

### Token Format
- Signed JWT or PASETO (v2.local/v2.public). OSS libraries only.
- Claims:
  - `tid` (tenant_id)
  - `sid` (session_id)
  - `qvid` (questionnaire_version_id)
  - `sub` (pseudo-subject for audit)
  - `exp`, `nbf`, `iat`
  - `ul` (use_limit) and `uc` (use_count)
  - `oneTime` boolean optional

### Endpoints
- `POST /api/sessions/:sessionId/token` (operator): issues token link; RBAC: operator within tenant
- `GET /public/p/:token` → returns questionnaire schema + ui hints (no PII)
- `POST /public/p/:token/answers` → submit answers; decrements use counter; invalidates token when expired/used

### Security Controls
- Rate limiting on `/public` routes (per IP + token)
- Input validation and payload size limits
- Optional device hint binding (fingerprint) stored against token claims
- Deny if tenant disabled or session closed
- Full audit trail of token creation and usage

### Revocation
- Tokens include a short TTL.
- Server keeps a token jti/blacklist table for immediate revocation when necessary.


