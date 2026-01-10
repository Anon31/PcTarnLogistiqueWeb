# pc-tarn-logistique-api/Dockerfile
FROM node:24-alpine

WORKDIR /usr/src/app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source
COPY . .

# --- ASTUCE PRISMA 7 ---
# On définit une fausse URL juste pour que la commande 'generate' puisse lire le fichier de config sans planter.
# La vraie URL sera injectée par docker-compose au démarrage (runtime).
ARG DATABASE_URL="postgresql://dummy:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL

# Génération du client Prisma (Crucial pour que NestJS trouve Prisma)
RUN npx prisma generate

EXPOSE 3000

# Commande de démarrage en mode dev
CMD ["npm", "run", "start:dev"]


