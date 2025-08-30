## Observability Plan (OSS)

### Metrics
- Prometheus Operator (kube-prometheus-stack) scrapes backend-v2 via ServiceMonitor.
- Export RED metrics and custom business metrics (e.g., sessions started, answers submitted).
- Timeseries for patient data stored in TimescaleDB; Prometheus only for infra/app metrics.

### Tracing
- OpenTelemetry SDK in NestJS with OTLP exporter to the collector.
- Collector exports to Tempo or Jaeger (OSS). Choose Tempo for Grafana-native dashboards.

### Logging
- JSON structured logs with requestId and tenantId; stdout collection by fluent-bit or promtail.
- Centralize in Loki (OSS) with retention policies.

### Dashboards
- Grafana with folders per tenant for admin-allowed templates.
- Normal users consume charts via backend APIs; admins get secure embeds.


