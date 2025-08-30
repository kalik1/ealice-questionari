## Coop Questionari v2: Open-Source, Kubernetes-Only Architecture

This document specifies the end-state architecture for v2. The design is 100% open-source, Kubernetes-only, and fully data-driven for questionnaires, data capture, and visualization.

### Tech Stack (All OSS)
- Backend: NestJS (TypeScript)
- API: REST + optional GraphQL
- AuthN/Z: Keycloak (OIDC), per-tenant RBAC
- DB: PostgreSQL with TimescaleDB extension for time-series
- Observability: OpenTelemetry, Prometheus, Grafana
- Frontend: React + Vite (TypeScript), i18n
- Packaging: OCI images (build with Podman), Helm charts, kind for local dev

### Core Principles
- Dynamic by design: Questionnaire schemas, dashboard templates, and visualizations are stored in the DB and versioned. No hardcoded questionnaires.
- Multi-tenancy: Strict isolation per tenant via tenant_id partitioning + PostgreSQL Row Level Security (RLS) and application-level guards.
- Kubernetes-only: Deploy via Helm. No Docker Compose.
- Security first: TLS, K8s secrets, short-lived tokens for patient links, audit logging.

---

## Domain and Modules (Backend)

NestJS application modules:
- CoreModule: config, logging, OpenTelemetry, validation, caching
- AuthModule: Keycloak integration, RBAC guards, token strategies
- TenancyModule: tenant resolution middleware, request context, RLS session setter
- QuestionnaireModule: schema registry, versioning, validators, rendering metadata
- SessionModule: operator sessions, patient token issuance and lifecycle
- AnswerModule: persistence of responses, server-side validation, auditing
- MetricsModule: vitals/metrics ingestion, derived calculation engine, TimescaleDB integration
- DashboardModule: dashboard template CRUD (tenant-admin), assignment to patients/cohorts
- PatientModule: patient identity within tenant, consent, retention policy links
- AdminModule: global admin (tenants lifecycle, quotas, config)

Key cross-cutting concerns:
- Request Context: `X-Tenant-ID` header or Keycloak tenant claim → TenantContext → DB RLS
- Audit Logger: all sensitive changes recorded (user, tenant, action, entity, changes, reason)
- Input Validation: class-validator + JSON Schema validation for dynamic payloads
- Rate Limiting: especially on public token endpoints

---

## Multi-Tenancy Design

Approach: Single database, tenant_id partitioning, enforced with PostgreSQL RLS. Optional schema-per-tenant is compatible but not the default.

Tables include `tenant_id UUID NOT NULL` and appropriate foreign keys. RLS policies restrict rows to the current tenant context.

Backend responsibilities:
- Resolve tenant from:
  1) Authenticated user JWT (Keycloak claim), or
  2) Tokenized patient link mapping to tenant, or
  3) Admin routes requiring explicit tenant scoping
- Set `SET app.current_tenant = '<uuid>'` via a connection-level `SET` or `pg_temp` var, used by RLS policies.
- Ensure all queries run with tenant context. Block queries missing context.

RLS example policy (conceptual):
```sql
CREATE POLICY tenant_isolation ON answers
USING (tenant_id::text = current_setting('app.current_tenant', true));
```

---

## Dynamic Questionnaires

Stored entities:
- questionnaire_types: id, tenant_id (nullable for global), name, description
- questionnaire_versions: id, questionnaire_type_id, version, json_schema, ui_schema, validators, status, created_by, created_at
- questionnaire_sessions: id, tenant_id, patient_id, type_id, version_id, status, token_id (nullable), created_by
- answers: id, tenant_id, session_id, payload_json, computed_json, created_at

Schema (JSON) contents:
- Sections, fields, types (numeric, text, select, multiselect, date/time, file), constraints, conditional visibility, derived fields definitions (expressions), server-side validators.
- UI hints: ordering, grouping, widget suggestions; the frontend must not hardcode forms.

Validation:
- Client-side: JSON Schema + rules delivered by backend
- Server-side: enforce identical rules; compute derived fields on submit; versioned calculators

Versioning:
- New versions are appended. Sessions pin a specific `questionnaire_version_id`. Answers retain version linkage for reproducibility.

---

## Patient Tokenized Links

Requirements:
- Short-lived, signed, single-use or limited-use tokens
- No patient login required
- Scope-limited to a single session or specific questionnaire

Flow:
1) Operator creates a questionnaire session for a patient
2) Backend issues a token (JWT or PASETO) with claims: tenant_id, session_id, type/version, exp, nbf, use_limit
3) Patient opens link: `/p/<token>`
4) Backend validates token, resolves tenant context, loads schema, returns form definition
5) Submit validates client/server, computes derived fields, persists, marks token used

Security:
- Rate limit public endpoints
- IP/device fingerprint optional, configurable per tenant policy
- CSRF not applicable for token GET; use same-site cookies if needed for step-up flows

---

## Derived Calculations

Design:
- Calculation registry (per questionnaire version) with deterministic, pure functions
- Versioned code paths bound to questionnaire_version_id
- Inputs: answer payload; Outputs: computed fields stored separately
- Execution recorded with calculator version hash for reproducibility

---

## Time-Series Metrics (TimescaleDB)

Use hypertables for vitals (heart rate, SpO₂, BP, etc.). Suggested schema:
- metrics: (tenant_id, patient_id, metric_name, time, value, unit, source, quality)
- Continuous aggregates for trends where needed

App exposes efficient query APIs for time windows, downsampling, and aggregations.

---

## Frontend (React + Vite)

Responsibilities:
- Fetch JSON schema + UI hints to render dynamic forms (no hardcoding)
- Validate and submit answers
- Display time-series charts for normal users using API data
- Tenant admins: create/manage dashboard templates; limited Grafana embed via backend proxy/signing
- i18n from server-provided labels + client bundles

Security:
- Normal users never access Grafana directly
- Admin-only Grafana embedding uses backend-signed URLs or image rendering API

---

## Observability

- OpenTelemetry SDK in backend with OTLP exporter
- Prometheus scraping via ServiceMonitor; RED metrics
- Structured JSON logs with request IDs and tenant IDs
- Audit log table for sensitive actions (who, when, what, before/after)

---

## Kubernetes-Only Delivery

- Helm umbrella chart `helm/v2` managing:
  - backend-v2 (NestJS)
  - frontend-v2 (React, static served via container)
  - postgresql with TimescaleDB extension enabled
  - keycloak (official OSS chart)
  - prometheus (kube-prometheus-stack or prom community chart)
  - grafana
- Init/migration Jobs for DB (TypeORM), seed roles/templates
- TLS via Ingress (e.g., NGINX Ingress + cert-manager)

Local Dev:
- kind cluster config in repo
- Podman to build images
- `helm install` against kind with NodePort/Ingress

---

## Security & Compliance

- RLS + app-level guards; deny-by-default
- Secrets in K8s; volumes with at-rest encryption (storage class dependent)
- GDPR: consent capture models, delete/export per tenant, configurable retention
- Input validation and rate limiting on public endpoints

---

## Non-Functional

- HA: run backend stateless replicas; Postgres with HA (Patroni or cloud-native operators, optional)
- Tests: unit/integration/e2e for backend; component/e2e for frontend
- Performance: bulk inserts for metrics, Timescale continuous aggregates

---

## Folder Plan

- backend-v2/
  - src/ (NestJS modules per above)
  - test/
  - helm/ (values fragment if needed)
- frontend-v2/
  - src/ (React/Vite app)
  - public/
- helm/v2/ (umbrella chart)
- kind/
  - kind-config.yaml
- docs/v2/ (this document + supplemental specs)


