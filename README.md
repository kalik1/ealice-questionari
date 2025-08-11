# Coop Questionari

A comprehensive questionnaire application for healthcare cooperatives with a modern web interface and robust backend API.

## 🚀 Quick Start with Helm

The fastest way to deploy this application is using our Helm chart:

```bash
# Add the Helm repository
helm repo add coop-questionari https://kalik1.github.io/coop-questionari
helm repo update

# Install the application
helm install my-release coop-questionari/coop-questionari

# Access the application
kubectl port-forward svc/my-release-frontend 8080:80
```

Visit [http://localhost:8080](http://localhost:8080) to access the application.

## 📋 Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- kubectl configured to communicate with your cluster

## 🏗️ Architecture

The application consists of:

- **Frontend**: Angular application served by Nginx
- **Backend**: Node.js/Express API server with TypeORM
- **Database**: PostgreSQL with automatic migrations
- **Infrastructure**: Kubernetes deployments with Helm

## 🔧 Configuration

The Helm chart provides extensive configuration options:

```yaml
# custom-values.yaml
replicaCount: 2

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
```

See the [Helm chart documentation](helm/README.md) for complete configuration options.

## 🗄️ Database

The application automatically:
- Deploys PostgreSQL with persistent storage
- Runs database migrations before starting the backend
- Generates secure passwords and JWT secrets
- Provides health checks and monitoring

## 🔒 Security Features

- Auto-generated database passwords and JWT secrets
- Kubernetes secrets for sensitive data
- ConfigMaps for non-sensitive configuration
- Health checks and readiness probes
- RBAC with service accounts

## 📊 Monitoring

Health check endpoints:
- Frontend: `/` (readiness)
- Backend: `/health` (liveness & readiness)

## 🚀 Deployment Options

### 1. Helm Chart (Recommended)
```bash
helm install my-release coop-questionari/coop-questionari
```

### 2. Docker Compose (Development)
```bash
docker-compose up -d
```

### 3. Manual Kubernetes
```bash
kubectl apply -f k8s/
```

## 🔄 Upgrading

```bash
helm upgrade my-release coop-questionari/coop-questionari
```

## 🗑️ Uninstalling

```bash
helm uninstall my-release
```

**Note**: This removes all resources including the database. Ensure you have backups or set `postgresql.primary.persistence.enabled: true`.

## 🐛 Troubleshooting

### Check application status
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

### Database connection
```bash
kubectl exec -it <postgres-pod-name> -- psql -U coop_user -d coop_questionari
```

## 📚 Documentation

- [Helm Chart Documentation](helm/README.md)
- [API Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the chart locally
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the [documentation](helm/README.md)
- Review the [troubleshooting guide](helm/README.md#troubleshooting)
