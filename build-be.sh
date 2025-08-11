#!/bin/bash

export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst)

#-------------------------------
#         Backend
#-------------------------------

cd backend
if [ -d "$BE_INSTALL_DIR" ]; then
  echo "Pulling from git..."
  cd ${BE_INSTALL_DIR}
  git pull
  cd ..
else
  echo "cloning from ${BE_GIT_SOURCE}"
  git clone ${BE_GIT_SOURCE} ${BE_INSTALL_DIR}
fi

cd ..

docker-compose build --build-arg BE_INSTALL_DIR=${BE_INSTALL_DIR} backend

