# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial Helm chart release
- PostgreSQL dependency with auto-generated passwords
- Frontend and backend deployments
- Database migration init container
- ConfigMap and Secret management
- Health checks and probes
- Ingress support
- Comprehensive documentation

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- Auto-generated database passwords and JWT secrets
- Kubernetes secrets for sensitive data
- ConfigMaps for non-sensitive configuration

## [0.1.0] - 2024-01-XX

### Added
- Initial Helm chart release
- PostgreSQL 13.2.32 dependency
- Frontend deployment with Nginx
- Backend deployment with Node.js
- Database migration init container
- Service accounts and RBAC
- Health checks and readiness probes
- Resource limits and requests
- Ingress configuration support
- Comprehensive values.yaml configuration
- Helm helpers and templates
- Installation notes and troubleshooting guide
