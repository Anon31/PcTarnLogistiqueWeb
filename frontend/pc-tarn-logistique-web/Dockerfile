# --- ÉTAPE 1 : BASE COMMUNE (Installation des dépendances) ---
FROM node:24-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

# --- ÉTAPE 2 : DÉVELOPPEMENT ---
# Cette étape sera utilisée en local pour le Hot-Reload
FROM base AS development
RUN npm install -g @angular/cli
EXPOSE 4200

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]

# --- ÉTAPE 3 : BUILD DE PRODUCTION ---
FROM base AS build
RUN npm run build -- --configuration=production

# --- ÉTAPE 4 : PRODUCTION (Celle qui sera sur le VPS) ---
FROM nginx:stable-alpine AS production
# On copie le résultat du build vers Nginx
COPY --from=build /usr/src/app/dist/pc-tarn-logistique-web/browser /usr/share/nginx/html

# Configuration Nginx pour supporter le routage Angular (SPA)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
