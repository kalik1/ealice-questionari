#!/bin/bash

echo "🚀 Starting optimized build process..."
echo "======================================"

# Set environment variables
export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst)

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf frontend/dist backend/dist

# Build Frontend
echo "🔨 Building Frontend..."
cd frontend
if [ -d "$FE_INSTALL_DIR" ]; then
  echo "Pulling from git..."
  cd ${FE_INSTALL_DIR}
  git pull
  cd ..
else
  echo "Cloning from ${FE_GIT_SOURCE}"
  git clone ${FE_GIT_SOURCE} ${FE_INSTALL_DIR}
fi

echo "Installing dependencies and building..."
cd ${FE_INSTALL_DIR}
npm ci --legacy-peer-deps
npm run build
cd ../..
echo "✅ Frontend built successfully"

# Build Backend
echo "🔨 Building Backend..."
cd backend
if [ -d "$BE_INSTALL_DIR" ]; then
  echo "Pulling from git..."
  cd ${BE_INSTALL_DIR}
  git pull
  cd ..
else
  echo "Cloning from ${BE_GIT_SOURCE}"
  git clone ${BE_GIT_SOURCE} ${BE_INSTALL_DIR}
fi

echo "Installing dependencies and building..."
cd ${BE_INSTALL_DIR}
npm ci
npm run build
cd ../..
echo "✅ Backend built successfully"

# Build Docker images using production Dockerfiles
echo "🐳 Building Docker images..."
docker-compose -f docker-compose.prod.yml build --build-arg FE_INSTALL_DIR=${FE_INSTALL_DIR} --build-arg BE_INSTALL_DIR=${BE_INSTALL_DIR}

echo "🎉 Build process completed!"
echo "======================================"
echo "You can now run: docker-compose -f docker-compose.prod.yml up -d"
