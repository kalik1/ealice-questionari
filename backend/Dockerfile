# -----------------------------------------------
# Development
# -----------------------------------------------
FROM        node:16-alpine AS development

ARG BE_INSTALL_DIR # you could give this a default value as well
ENV BE_INSTALL_DIR=$BE_INSTALL_DIR

WORKDIR     /usr/src/app
COPY        ./${BE_INSTALL_DIR}/package*.json ./${BE_INSTALL_DIR}/pnpm*.yaml ./
RUN         echo -e "http://nl.alpinelinux.org/alpine/v3.5/main\nhttp://nl.alpinelinux.org/alpine/v3.5/community" > /etc/apk/repositories && \
            apk --no-cache add curl && \
            curl -sL https://unpkg.com/@pnpm/self-installer | node && \
            pnpm config set store-dir /.pnpm-store && \
            pnpm install
COPY        ./${BE_INSTALL_DIR}/. .
RUN         pnpm run build

# -----------------------------------------------
# Production
# -----------------------------------------------


FROM        node:16-alpine

ARG         NODE_ENV=production
ENV         NODE_ENV=${NODE_ENV}

ARG BE_INSTALL_DIR # you could give this a default value as well
ENV BE_INSTALL_DIR=$BE_INSTALL_DIR

WORKDIR     /usr/src/app
COPY        ./${BE_INSTALL_DIR}/package*.json ./${BE_INSTALL_DIR}/pnpm*.yaml ./
COPY        --from=development /.pnpm-store /.pnpm-store
RUN         echo -e "http://nl.alpinelinux.org/alpine/v3.5/main\nhttp://nl.alpinelinux.org/alpine/v3.5/community" > /etc/apk/repositories&& \
            apk update && \
            apk --no-cache add curl && \
            curl -sL https://unpkg.com/@pnpm/self-installer | node && \ 
            pnpm config set store-dir /.pnpm-store && \
            pnpm install --only=production
ENV         TZ=Europe/Rome
RUN         ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY        --from=development /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]


