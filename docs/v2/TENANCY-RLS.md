## Multi-Tenancy with PostgreSQL Row Level Security (RLS)

This document details how tenant isolation is enforced at both the database and application layers.

### Model
- Every multi-tenant table includes `tenant_id UUID NOT NULL`.
- RLS policies ensure the session tenant can only access rows for its tenant.
- The application sets `SET app.current_tenant = '<uuid>'` on each DB connection.

### Example Tables
```sql
CREATE TABLE tenants (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE patients (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  external_ref text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE answers (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  session_id uuid NOT NULL,
  payload_json jsonb NOT NULL,
  computed_json jsonb,
  created_at timestamptz DEFAULT now()
);
```

### RLS Policies
```sql
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY patients_tenant_rls ON patients
USING (tenant_id::text = current_setting('app.current_tenant', true));

CREATE POLICY answers_tenant_rls ON answers
USING (tenant_id::text = current_setting('app.current_tenant', true));
```

Optional write policies may enforce that inserts/updates can only set `tenant_id` to the current tenant.

### Application Layer
- Tenancy middleware resolves the tenant from Keycloak token or patient token link.
- NestJS interceptor attaches `tenantId` to a request-scoped provider.
- Database provider sets `current_setting` on connection checkout and verifies it.
- Guard denies requests lacking a tenant context, except for global admin endpoints.

### Testing RLS
- Use integration tests that attempt cross-tenant access; expect zero rows or errors.
- Ensure migrations create RLS policies and that service accounts set the tenant context.


