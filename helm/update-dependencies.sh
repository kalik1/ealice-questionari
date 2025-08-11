#!/bin/bash

# Script to update Helm chart dependencies

echo "Updating Helm chart dependencies..."

# Add Bitnami repository if not already added
helm repo add bitnami https://charts.bitnami.com/bitnami

# Update repositories
helm repo update

# Update dependencies
helm dependency update

echo "Dependencies updated successfully!"
echo ""
echo "To build the chart:"
echo "  helm package ."
echo ""
echo "To install the chart:"
echo "  helm install my-release ."
echo ""
echo "To install with dependencies:"
echo "  helm dependency build"
echo "  helm install my-release ."
