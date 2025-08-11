#!/bin/bash

sh ./build-be.sh
sh ./build-fe.sh

docker-compose down && docker-compose up -d && docker-compose logs -f
