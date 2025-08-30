## Coop Questionari v2 Umbrella Chart

Components:
- backend-v2 (NestJS)
- frontend-v2 (React)
- PostgreSQL (Bitnami) – enable TimescaleDB manually or via custom image/operator
- Keycloak (Bitnami)
- Prometheus stack
- Grafana

Install (kind example):
```bash
helm dependency build ./helm/v2
helm upgrade --install coop-v2 ./helm/v2 -n coop --create-namespace \
  --set global.domain=localhost \
  --set global.tlsEnabled=false
```

Notes:
- For TimescaleDB in production, prefer the TimescaleDB open-source Helm chart or Crunchy/Hyperscale operators.
- Secrets here are for local only; replace in real environments.


