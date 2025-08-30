## backend-v2 (NestJS)

Goals:
- Modular, testable, Kubernetes-ready
- Dynamic questionnaires: schemas + UI hints from DB
- Multi-tenancy via RLS and request context
- Tokenized patient links with TTL and optional single-use

Planned modules (src/modules):
- core: config, logger, otel
- auth: keycloak guards, RBAC roles
- tenancy: tenant resolver, request context, DB session setter
- questionnaire: schema registry, validation, versioning
- session: operator sessions, token issuance, lifecycle
- answer: submit/validate/compute/ persist
- metrics: timeseries ingestion and query (TimescaleDB)
- dashboard: templates CRUD, assignment to patients/cohorts
- patient: CRUD, consent, retention
- admin: tenant lifecycle (global scope)

Kubernetes:
- Health probes, graceful shutdown, config via env vars
- Helm subchart values


