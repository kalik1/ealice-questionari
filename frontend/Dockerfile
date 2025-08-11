# -----------------------------------------------
# Development
# -----------------------------------------------
FROM        node:16-alpine AS development

ARG FE_INSTALL_DIR # you could give this a default value as well
ENV FE_INSTALL_DIR=$FE_INSTALL_DIR

WORKDIR     /usr/src/app
RUN         npm install -g @angular/cli@13.1.2 && \
            echo "./${FE_INSTALL_DIR}/package*.json ./"
COPY        ./${FE_INSTALL_DIR}/package*.json ./
RUN         npm ci
COPY        ./${FE_INSTALL_DIR}/. .
RUN         npm run build


# -----------------------------------------------
# Production
# -----------------------------------------------
FROM        nginx:1.21-alpine
ENV         TZ=Europe/Rome
RUN         ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY        --from=development /usr/src/app/dist/fuse /usr/share/nginx/html
