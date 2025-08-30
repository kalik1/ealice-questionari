## Migrations and Seed Plan (TypeORM)

### Goals
- Create tenants, roles, base RBAC mappings
- Create questionnaire tables and seed starter templates (optional)
- Enable RLS and policies
- Set up TimescaleDB extension and hypertables

### Migrations Order
1) enable_extensions: `CREATE EXTENSION IF NOT EXISTS timescaledb;`
2) core_tables: tenants, users, roles, user_roles, audit_log
3) patient_tables: patients, consents
4) questionnaire_tables: questionnaire_types, questionnaire_versions, questionnaire_sessions, answers
5) metrics_tables: metrics hypertable and indexes
6) rls_policies: enable RLS and create policies for all tenant tables
7) seed_data: global roles, default tenant (dev), admin user, starter questionnaire templates

### TimescaleDB
```sql
SELECT create_hypertable('metrics', by_range('time'));
```

### Seed Starters (Optional Templates)
- Basic vitals capture form
- SF-12 or other OSS questionnaire structure if licensing permits

### Bootstrap Job (Helm)
- Kubernetes Job runs `npm run typeorm migration:run` in backend-v2 image
- Followed by a seed script `npm run seed` guarded to non-prod


