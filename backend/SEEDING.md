# Database Seeding System

This document explains how to use the database seeding system for the coop-questionari backend application.

## Overview

The seeding system automatically creates initial data when the application starts, including:
- Default cooperative (coop)
- Admin user with full privileges
- Sample questions for testing

## Environment Variables

Configure the seeding behavior using these environment variables:

### Required for Production
```bash
# Admin user credentials (CHANGE THESE IN PRODUCTION!)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_password
ADMIN_NAME=Your Name

# Default cooperative settings
DEFAULT_COOP_NAME=Your Cooperative Name
DEFAULT_COOP_EMAIL=coop@yourdomain.com
```

### Optional
```bash
# Force seeding to run (default: false)
RUN_SEED=true

# Environment (default: development)
NODE_ENV=production

# Path to a PostgreSQL dump to import question-related data from
# If not set, defaults to bck_coop_11-8-2025.sql at repo root
QUESTIONS_BACKUP_PATH=./bck_coop_11-8-2025.sql
```

## Usage

Seeding is now performed through migrations. Run:

```bash
npm run migration:run
```

## Migration-based import for questions
To import only question-related tables via a migration, use:

```bash
# Adjust path if your backup is elsewhere
set QUESTIONS_BACKUP_PATH=../bck_coop_11-8-2025.sql   # Windows (cmd)
export QUESTIONS_BACKUP_PATH=../bck_coop_11-8-2025.sql # bash

# Run migrations
npm run migration:run

# Revert the import (clears question-related tables)
npm run migration:revert
```

The question import migration executes a helper SQL with hardcoded INSERTs for `public.question`, `public.question_single`, `public.question_single_option`, `public.question_single_result`, `public.question_single_result_option` after clearing existing data.

## Kubernetes Deployment

### ConfigMap Example
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coop-questionari-config
data:
  ADMIN_EMAIL: "admin@coop-questionari.com"
  ADMIN_NAME: "System Administrator"
  DEFAULT_COOP_NAME: "Default Cooperative"
  DEFAULT_COOP_EMAIL: "default@coop-questionari.com"
  NODE_ENV: "production"
```

### Secret Example
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: coop-questionari-secrets
type: Opaque
data:
  ADMIN_PASSWORD: <base64-encoded-password>
  DB_PASS: <base64-encoded-db-password>
```

### Deployment Example
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: coop-questionari-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: coop-questionari-backend
  template:
    metadata:
      labels:
        app: coop-questionari-backend
    spec:
      containers:
      - name: backend
        image: coop-questionari-backend:latest
        env:
        - name: RUN_SEED
          value: "true"
        - name: ADMIN_EMAIL
          valueFrom:
            configMapKeyRef:
              name: coop-questionari-config
              key: ADMIN_EMAIL
        - name: ADMIN_NAME
          valueFrom:
            configMapKeyRef:
              name: coop-questionari-config
              key: ADMIN_NAME
        - name: ADMIN_PASSWORD
          valueFrom:
            secretKeyRef:
              name: coop-questionari-secrets
              key: ADMIN_PASSWORD
        - name: DEFAULT_COOP_NAME
          valueFrom:
            configMapKeyRef:
              name: coop-questionari-config
              key: DEFAULT_COOP_NAME
        - name: DEFAULT_COOP_EMAIL
          valueFrom:
            configMapKeyRef:
              name: coop-questionari-config
              key: DEFAULT_COOP_EMAIL
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: coop-questionari-config
              key: NODE_ENV
        envFrom:
        - configMapRef:
            name: coop-questionari-config
        - secretRef:
            name: coop-questionari-secrets
```

## Security Considerations

### Production Deployment
1. **ALWAYS change default passwords** - The default admin password is `admin123`
2. **Use strong passwords** - Generate secure passwords for production
3. **Rotate credentials** - Regularly update admin credentials
4. **Limit access** - Only enable seeding when necessary
5. **Monitor logs** - Watch for unauthorized access attempts

### Default Credentials
Configured via environment variables in the seed migration (see migration file).

## Seeding Logic
Implemented via the initial seed migration that creates the default cooperative and admin user.

## Troubleshooting

### Seeding Not Running
1. Check `RUN_SEED` environment variable
2. Verify `NODE_ENV` is set to `development`
3. Check application logs for errors

### Permission Errors
1. Ensure database user has CREATE/INSERT permissions
2. Check database connection settings
3. Verify entity relationships are correct

### Duplicate Data
1. Seeding is idempotent by design
2. Check if data already exists
3. Use `reset()` method only in development/testing

## Development

### Adding New Seed Data
1. Extend the `Seed` class with new methods
2. Call new methods from the `run()` method
3. Follow the existing pattern for idempotent operations

### Testing
```bash
# Test seeding in development
npm run seed

# Check if seeding is needed
# The system automatically detects this
```

### Resetting Data (Development Only)
Re-run migrations on a fresh database or add a dedicated revert migration if needed.

## Monitoring

### Log Messages
The seeding system provides detailed logging:
- `Starting database seeding...`
- `Created default coop: [Name]`
- `Created admin user: [Email]`
- `Created sample question: [Question]`
- `Database seeding completed successfully!`

### Health Checks
Monitor the seeding process through:
- Application startup logs
- Database record counts
- Admin user existence verification
