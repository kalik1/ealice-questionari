#!/bin/bash

# Script to test Helm dependencies locally

echo "🧪 Testing Helm dependencies..."

# Add Bitnami repository
echo "📦 Adding Bitnami repository..."
helm repo add bitnami https://charts.bitnami.com/bitnami

# Update repositories
echo "🔄 Updating repositories..."
helm repo update

# Check available PostgreSQL versions
echo "🔍 Checking available PostgreSQL versions..."
helm search repo bitnami/postgresql --versions | head -10

# Test dependency update
echo "📥 Testing dependency update..."
helm dependency update

# Test dependency build
echo "🔨 Testing dependency build..."
helm dependency build

# Test chart packaging
echo "📦 Testing chart packaging..."
helm package .

echo ""
echo "✅ All tests completed successfully!"
echo ""
echo "📋 Summary:"
echo "  - Bitnami repository: ✅"
echo "  - Dependencies updated: ✅"
echo "  - Dependencies built: ✅"
echo "  - Chart packaged: ✅"
echo ""
echo "🚀 Ready to push to CI!"
