giopil.PHONY: help deps build package install uninstall lint test clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

deps: ## Update and build dependencies
	@echo "Updating Helm dependencies..."
	helm repo add bitnami https://charts.bitnami.com/bitnami
	helm repo update
	helm dependency update
	helm dependency build
	@echo "Dependencies updated successfully!"

build: deps ## Build dependencies (alias for deps)
	@echo "Dependencies are built and ready!"

package: build ## Package the Helm chart
	@echo "Packaging Helm chart..."
	helm package .
	@echo "Chart packaged successfully!"

install: package ## Install the chart locally
	@echo "Installing chart locally..."
	helm install my-release .
	@echo "Chart installed successfully!"

uninstall: ## Uninstall the chart
	@echo "Uninstalling chart..."
	helm uninstall my-release
	@echo "Chart uninstalled successfully!"

lint: ## Lint the Helm chart
	@echo "Linting Helm chart..."
	helm lint .
	@echo "Chart linting completed!"

test: ## Test the Helm chart
	@echo "Testing Helm chart..."
	helm template . --debug
	@echo "Chart testing completed!"

clean: ## Clean up generated files
	@echo "Cleaning up..."
	rm -f *.tgz
	rm -rf charts/
	@echo "Cleanup completed!"

all: clean deps package ## Clean, build dependencies, and package
	@echo "All tasks completed successfully!"
