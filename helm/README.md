# Coop Questionari Helm Chart

A Helm chart for deploying the Coop Questionari application with PostgreSQL database on Kubernetes.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- kubectl configured to communicate with your cluster

## Installation

### Add the Helm repository

```bash
helm repo add coop-questionari https://kalik1.github.io/coop-questionari
helm repo update
```

### Install the chart

```bash
helm install my-release coop-questionari/coop-questionari
```

### Install with custom values

```bash
helm install my-release coop-questionari/coop-questionari \
  --values custom-values.yaml
```

## Development and Local Testing

### Clone and test locally

```bash
git clone <repository-url>
cd helm

# Update dependencies
helm dependency update

# Build dependencies
helm dependency build

# Package the chart
helm package .

# Install locally
helm install my-release .
```

### Dependency Management

The chart depends on the PostgreSQL chart from Bitnami. To manage dependencies:

```bash
# Add Bitnami repository
helm repo add bitnami https://charts.bitnami.com/bitnami

# Update repositories
helm repo update

# Update dependencies
helm dependency update

# Build dependencies (downloads charts to charts/ directory)
helm dependency build
```

**Note**: The `charts/` directory will be created after running `helm dependency build`. This directory contains the downloaded PostgreSQL chart and is required for local installation.

## Configuration

The following table lists the configurable parameters of the coop-questionari chart and their default values.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas for frontend and backend | `1` |
| `image.frontend.repository` | Frontend image repository | `ghcr.io/kalik1/coop-questionari-frontend` |
| `image.frontend.tag` | Frontend image tag | `latest` |
| `image.backend.repository` | Backend image repository | `ghcr.io/kalik1/coop-questionari-backend` |
| `image.backend.tag` | Backend image tag | `latest` |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `service.type` | Kubernetes service type | `ClusterIP` |
| `ingress.enabled` | Enable ingress | `false` |
| `postgresql.enabled` | Enable PostgreSQL | `true` |
| `postgresql.auth.database` | PostgreSQL database name | `coop_questionari` |
| `postgresql.auth.username` | PostgreSQL username | `coop_user` |
| `postgresql.auth.password` | PostgreSQL password | Auto-generated |
| `postgresql.primary.persistence.size` | PostgreSQL PVC size | `8Gi` |
| `backend.migrations.enabled` | Enable database migrations | `true` |
| `resources.frontend.limits.cpu` | Frontend CPU limit | `500m` |
| `resources.frontend.limits.memory` | Frontend memory limit | `512Mi` |
| `resources.backend.limits.cpu` | Backend CPU limit | `1000m` |
| `resources.backend.limits.memory` | Backend memory limit | `1Gi` |

### Example custom values

```yaml
# custom-values.yaml
replicaCount: 2

image:
  frontend:
    tag: "v1.0.0"
  backend:
    tag: "v1.0.0"

ingress:
  enabled: true
  className: "nginx"
  hosts:
    - host: "app.example.com"
      paths:
        - path: /
          pathType: Prefix

postgresql:
  auth:
    password: "my-custom-password"
  primary:
    persistence:
      size: 20Gi

resources:
  frontend:
    limits:
      cpu: 1000m
      memory: 1Gi
  backend:
    limits:
      cpu: 2000m
      memory: 2Gi
```

## Architecture

The chart deploys the following components:

- **Frontend**: Angular application served by Nginx
- **Backend**: Node.js/Express API server
- **PostgreSQL**: Database with persistent storage
- **Migrations**: Init container that runs database migrations before the backend starts

## Database Migrations

The backend deployment includes an init container that:

1. Waits for PostgreSQL to be ready
2. Runs database migrations using `npm run migration:run`
3. Only starts the main backend container after migrations complete

## Security

- Database passwords and JWT secrets are auto-generated if not provided
- Secrets are stored in Kubernetes secrets
- Non-sensitive configuration is stored in ConfigMaps

## Monitoring

The application includes health checks:

- **Liveness probe**: `/health` endpoint for backend
- **Readiness probe**: `/` endpoint for frontend, `/health` for backend

## Troubleshooting

### Common Issues

#### PostgreSQL dependency not found
```bash
# Make sure Bitnami repository is added
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Update and build dependencies
helm dependency update
helm dependency build
```

#### Charts directory missing
```bash
# Build dependencies to create charts/ directory
helm dependency build
```

### Check pod status

```bash
kubectl get pods -l app.kubernetes.io/name=coop-questionari
```

### View logs

```bash
# Backend logs
kubectl logs -l app.kubernetes.io/component=backend

# Frontend logs
kubectl logs -l app.kubernetes.io/component=frontend

# Migration logs
kubectl logs -l app.kubernetes.io/component=backend -c migrations
```

### Check database connection

```bash
# Connect to PostgreSQL
kubectl exec -it <postgres-pod-name> -- psql -U coop_user -d coop_questionari
```

### Port forward for local access

```bash
# Frontend
kubectl port-forward svc/<release-name>-frontend 8080:80

# Backend
kubectl port-forward svc/<release-name>-backend 3000:3000
```

## Upgrading

```bash
helm upgrade my-release coop-questionari/coop-questionari
```

## Uninstalling

```bash
helm uninstall my-release
```

**Note**: This will remove all resources including the PostgreSQL database. To preserve data, ensure you have backups or set `postgresql.primary.persistence.enabled: true`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the chart locally
5. Submit a pull request

## License

This chart is licensed under the same license as the main project.
