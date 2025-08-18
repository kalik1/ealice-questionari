#!/bin/bash

echo "🔄 Migrating to optimized build workflow..."
echo "=========================================="

# Check if we're in the right directory
if [ ! -f ".github/workflows/docker-publish.yml" ]; then
    echo "❌ Error: docker-publish.yml not found in .github/workflows/"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Backup old workflow
echo "📦 Backing up old workflow..."
mv .github/workflows/docker-publish.yml .github/workflows/docker-publish.yml.backup
echo "✅ Old workflow backed up to docker-publish.yml.backup"

# Verify new workflow exists
if [ ! -f ".github/workflows/optimized-docker-publish.yml" ]; then
    echo "❌ Error: optimized-docker-publish.yml not found!"
    echo "Restoring old workflow..."
    mv .github/workflows/docker-publish.yml.backup .github/workflows/docker-publish.yml
    exit 1
fi

echo "✅ New optimized workflow is ready"
echo ""
echo "🎯 Next steps:"
echo "1. Commit and push these changes to trigger the new workflow"
echo "2. Monitor the first run in GitHub Actions"
echo "3. If everything works, you can delete the backup file"
echo ""
echo "📝 To revert:"
echo "   mv .github/workflows/docker-publish.yml.backup .github/workflows/docker-publish.yml"
echo ""
echo "🚀 Migration completed successfully!"
