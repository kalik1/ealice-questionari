# -----------------------------------------------
# Development
# -----------------------------------------------
FROM        registry.access.redhat.com/ubi9/nodejs-20 AS development

ARG         NODE_ENV=development
ENV         NODE_ENV=${NODE_ENV}

COPY        package*.json ./
RUN         npm ci
COPY        ./ .
RUN         npm run build


# -----------------------------------------------
# Production
# -----------------------------------------------


FROM        registry.access.redhat.com/ubi9/nodejs-20

ARG         NODE_ENV=production
ENV         NODE_ENV=${NODE_ENV}
ENV         TZ=Europe/Rome

COPY        package*.json ./ 
RUN          npm ci --omit=dev

COPY        --from=development /opt/app-root/src/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]


