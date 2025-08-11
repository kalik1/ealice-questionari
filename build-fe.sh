#!/bin/bash

export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst)

#-------------------------------
#         Frontend
#-------------------------------

cd frontend
if [ -d "$FE_INSTALL_DIR" ]; then
  echo "Pulling from git..."
  cd ${FE_INSTALL_DIR}
  git pull
  cd ..
else
  echo "cloning from ${FE_GIT_SOURCE} (git clone ${FE_GIT_SOURCE} ${FE_INSTALL_DIR})"
  git clone ${FE_GIT_SOURCE} ${FE_INSTALL_DIR}
fi

cd ..

docker-compose build --build-arg FE_INSTALL_DIR=${FE_INSTALL_DIR} frontend

