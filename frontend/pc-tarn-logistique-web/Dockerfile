# pc-tarn-logistique-web/Dockerfile
FROM node:24-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Installation du CLI Angular pour utiliser 'ng serve' dans le conteneur
RUN npm install -g @angular/cli

COPY . .

EXPOSE 4200

# Démarrage avec l'hôte 0.0.0.0 pour l'accès externe
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]


