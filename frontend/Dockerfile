# -----------------------------------------------
# Development
# -----------------------------------------------
FROM        node:16-alpine AS development

WORKDIR     /usr/src/app
RUN         npm install -g @angular/cli@13.1.2 && \
            echo "./package*.json ./"
COPY        ./package*.json ./
RUN         npm ci --legacy-peer-deps
COPY        ./ .
RUN         npm run build


# -----------------------------------------------
# Production
# -----------------------------------------------
FROM        nginx:1.21-alpine
ENV         TZ=Europe/Rome
RUN         ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY        --from=development /usr/src/app/dist/fuse /usr/share/nginx/html
COPY        nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
