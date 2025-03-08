# Guide de contribution

Merci de votre intérêt pour contribuer à ce projet ! Voici quelques directives pour vous aider à contribuer efficacement.

## Code de conduite

En participant à ce projet, vous vous engagez à maintenir un environnement respectueux et collaboratif. Soyez bienveillant envers les autres contributeurs et respectez leurs points de vue.

## Comment contribuer

### Rapporter des bugs

Si vous trouvez un bug, veuillez créer une issue en incluant :
- Une description claire du problème
- Les étapes pour reproduire le bug
- Le comportement attendu versus le comportement observé
- Des captures d'écran si applicables
- Votre environnement (OS, version de Node.js, etc.)

### Suggérer des améliorations

Les suggestions d'améliorations sont les bienvenues ! Pour proposer une nouvelle fonctionnalité :
- Créez une issue avec le tag "enhancement"
- Décrivez clairement la fonctionnalité proposée
- Expliquez pourquoi cette fonctionnalité serait utile pour le projet

### Pull Requests

1. Fork le dépôt
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

### Conventions de code

- Utilisez des noms de variables et de fonctions descriptifs
- Commentez votre code lorsque nécessaire
- Écrivez des tests pour les nouvelles fonctionnalités
- Respectez le style de code existant

## Sécurité

### Clés API et secrets

- Ne jamais commiter de clés API, mots de passe ou autres secrets
- Utilisez le fichier `.env` pour stocker ces informations localement
- Assurez-vous que ces fichiers sont bien dans le `.gitignore`

### Signaler des vulnérabilités

Si vous découvrez une vulnérabilité de sécurité, veuillez ne pas la divulguer publiquement. Contactez plutôt directement les responsables du projet.

## Tests

Avant de soumettre une Pull Request, assurez-vous que :
- Tous les tests passent (`npm test`)
- Vous avez écrit des tests pour les nouvelles fonctionnalités
- Le code est cohérent avec le style du projet

## Déploiement

Le déploiement est géré par les mainteneurs du projet. Si vous avez des suggestions concernant le processus de déploiement, veuillez créer une issue pour en discuter.

Merci de contribuer à ce projet !