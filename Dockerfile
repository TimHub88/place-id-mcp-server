FROM node:18-alpine

WORKDIR /app

# Copier les fichiers package.json et package-lock.json (s'ils existent)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Définir une variable d'environnement par défaut pour la clé API (à remplacer lors du déploiement)
ENV GOOGLE_PLACES_API_KEY=default_api_key
ENV PORT=3000
ENV NODE_ENV=production

# Exposer le port sur lequel le serveur s'exécute
EXPOSE 3000

# Commande pour démarrer le serveur
CMD ["node", "src/index.js"]