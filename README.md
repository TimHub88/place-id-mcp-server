# Place ID MCP Server

Un serveur MCP (Model Context Protocol) qui se connecte à l'API Google Places pour récupérer dynamiquement des photos de lieux et les intégrer dans Cursor via Smithery.

## Objectif

Ce projet développe un serveur qui expose une API HTTP permettant de récupérer des photos de lieux via l'API Google Places. Lorsqu'il est sollicité par Cursor via Smithery, le serveur renvoie l'URL d'une photo correspondant à une référence fournie. Cette intégration permet aux wireframes et prototypes d'afficher des images de lieux en temps réel, améliorant ainsi l'expérience utilisateur et le réalisme des maquettes.

## Fonctionnalités

- Récupération d'images depuis l'API Google Place Photo
- Traitement de la redirection vers l'URL réelle de l'image
- Réponse formatée selon le protocole MCP pour intégration à Cursor
- Gestion sécurisée de la clé API Google
- Recherche de lieux pour obtenir des références de photos valides

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
4. **Important :** Appliquer des restrictions à votre clé API (domaines, adresses IP, etc.) pour éviter une utilisation non autorisée

### Sécurisation de la clé API

Pour sécuriser votre clé API Google Places :

1. Dans la console Google Cloud, accédez à "API et services" > "Identifiants"
2. Sélectionnez votre clé API et ajoutez des restrictions :
   - Restriction d'API : Limitez l'utilisation à l'API Places uniquement
   - Restriction de domaine/IP : Limitez l'utilisation aux domaines ou adresses IP de votre serveur
3. Ne partagez jamais votre clé API dans des fichiers publics ou sur GitHub

## Utilisation

1. Démarrez le serveur :
```bash
npm start
```

2. Le serveur est accessible à l'adresse `http://localhost:3000` (ou le port spécifié dans votre fichier `.env`)

3. Endpoints disponibles :

### 1. Recherche de lieux et références de photos
   - Route : `/mcp/search-places`
   - Méthode : GET
   - Paramètres : `query` (terme de recherche, ex: "Eiffel Tower")
   - Exemple : `http://localhost:3000/mcp/search-places?query=Eiffel%20Tower`
   - Réponse :
     ```json
     {
       "success": true,
       "data": {
         "places": [
           {
             "name": "Tour Eiffel",
             "address": "Champ de Mars, 5 Av. Anatole France, 75007 Paris, France",
             "place_id": "ChIJLU7jZClu5kcR4PcOOO6p3I0",
             "photos": [
               {
                 "photo_reference": "AUjq9jlXyV5A3sadj...",
                 "width": 4000,
                 "height": 6000,
                 "html_attributions": ["..."]
               }
             ]
           }
         ]
       }
     }
     ```

### 2. Récupération de photo
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

## Flux de travail typique

1. Utilisez d'abord l'endpoint `/mcp/search-places` pour obtenir des références de photos valides
2. Utilisez ensuite ces références avec l'endpoint `/mcp/google-places-photo` pour obtenir les URLs des photos

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