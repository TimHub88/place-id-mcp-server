FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port sur lequel le serveur s'exécute
EXPOSE 3000

# Commande pour démarrer le serveur
CMD ["node", "src/index.js"]