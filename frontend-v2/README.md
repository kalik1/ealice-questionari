## frontend-v2 (React + Vite)

Goals:
- Render dynamic questionnaires from server-provided JSON schema + UI hints
- Role-based navigation (viewer, operator, tenant-admin, global-admin)
- Charts for patient data powered by backend API (TimescaleDB)
- Grafana embed only for tenant admins (backend-signed)
- i18n support

Core packages (OSS):
- React, React Router, Zustand/Redux (state), react-hook-form + zod (or JSON schema forms)
- Charting: Recharts/Chart.js/visx (OSS)
- i18n: i18next

App slices:
- auth (OIDC via Keycloak)
- questionnaires (schema fetch + renderer)
- sessions (patient link flow)
- dashboards (admin templates, assignments)
- metrics (time-series queries)


