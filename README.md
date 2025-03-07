# Place ID MCP Server

Un serveur MCP (Model Context Protocol) qui se connecte à l'API Google Places pour récupérer dynamiquement des photos de lieux et les intégrer dans Cursor via Smithery.

## Objectif

Ce projet développe un serveur qui expose une API HTTP permettant de récupérer des photos de lieux via l'API Google Places. Lorsqu'il est sollicité par Cursor via Smithery, le serveur renvoie l'URL d'une photo correspondant à une référence fournie. Cette intégration permet aux wireframes et prototypes d'afficher des images de lieux en temps réel, améliorant ainsi l'expérience utilisateur et le réalisme des maquettes.

## Fonctionnalités

- Récupération d'images depuis l'API Google Place Photo
- Traitement de la redirection vers l'URL réelle de l'image
- Réponse formatée selon le protocole MCP pour intégration à Cursor
- Gestion sécurisée de la clé API Google

## Technologies utilisées

- Node.js
- Express.js
- Axios
- dotenv (pour la gestion des variables d'environnement)

## Installation

1. Clonez ce dépôt :
```bash
git clone https://github.com/TimHub88/place-id-mcp-server.git
cd place-id-mcp-server
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet et ajoutez votre clé API Google Places :
```
GOOGLE_PLACES_API_KEY=votre_clé_api
PORT=3000
```

## Configuration

Pour utiliser ce serveur, vous devez :

1. Obtenir une clé API Google Places depuis la [Console Google Cloud](https://console.cloud.google.com/)
2. Activer l'API Places pour votre projet Google Cloud
3. Configurer la clé dans le fichier `.env`

## Utilisation

1. Démarrez le serveur :
```bash
npm start
```

2. Le serveur est accessible à l'adresse `http://localhost:3000` (ou le port spécifié dans votre fichier `.env`)

3. Endpoint principal :
   - Route : `/mcp/google-places-photo`
   - Méthode : POST
   - Payload :
     ```json
     {
       "photo_reference": "REFERENCE_PHOTO_GOOGLE",
       "maxwidth": 400
     }
     ```
   - Réponse :
     ```json
     {
       "success": true,
       "data": {
         "photoUrl": "https://url_de_la_photo.jpg"
       }
     }
     ```

## Intégration avec Cursor

Pour intégrer ce serveur MCP à Cursor via Smithery :

1. Déployez le serveur sur une plateforme de votre choix
2. Configurez l'agent MCP dans Cursor en utilisant l'URL publique du serveur
3. Suivez la documentation de Smithery pour finaliser l'intégration

## Développement

Pour exécuter le serveur en mode développement avec rechargement automatique :
```bash
npm run dev
```

## Tests

Pour exécuter les tests :
```bash
npm test
```

## Licence

MIT