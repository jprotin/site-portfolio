# Configuration de l'envoi d'emails

Ce projet utilise PHPMailer avec le serveur SMTP Infomaniak pour l'envoi d'emails depuis le formulaire de contact.

## Installation

### 1. Installer les dépendances PHP avec Composer

```bash
composer install
```

Si vous n'avez pas Composer installé, téléchargez-le depuis [getcomposer.org](https://getcomposer.org/)

### 2. Configurer les credentials SMTP

Copiez le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

Puis éditez le fichier `.env` et renseignez vos identifiants SMTP Infomaniak :

```env
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_ENCRYPTION=tls
SMTP_USERNAME=votre-email@votre-domaine.com
SMTP_PASSWORD=votre-mot-de-passe-smtp
```

### 3. Configuration SMTP Infomaniak

Pour obtenir vos identifiants SMTP :

1. Connectez-vous à votre [Manager Infomaniak](https://manager.infomaniak.com/)
2. Accédez à votre compte email
3. Les paramètres SMTP sont :
   - **Serveur SMTP** : `mail.infomaniak.com`
   - **Port** : `587`
   - **Chiffrement** : `STARTTLS`
   - **Authentification** : Requise
   - **Nom d'utilisateur** : votre adresse email complète
   - **Mot de passe** : le mot de passe de votre compte email

## Sécurité

- Le fichier `.env` est ignoré par Git (configuré dans `.gitignore`)
- Ne committez JAMAIS vos identifiants SMTP
- En production, assurez-vous que le fichier `.env` n'est pas accessible publiquement

## Test de l'envoi d'emails

Le script `backend/send-email.php` gère l'envoi d'emails via une requête POST avec les champs :
- `name` : Nom de l'expéditeur
- `email` : Email de l'expéditeur
- `message` : Message du formulaire

## Dépannage

Si l'envoi d'emails ne fonctionne pas :

1. Vérifiez que `vendor/` existe et contient PHPMailer
2. Vérifiez que le fichier `.env` contient les bons identifiants
3. Consultez les logs dans `backend/logs/email-errors.log`
4. Décommentez la ligne `$mail->SMTPDebug = SMTP::DEBUG_SERVER;` dans `send-email.php` pour activer le mode debug

## Technologies utilisées

- **PHPMailer** : Bibliothèque PHP pour l'envoi d'emails
- **SMTP Infomaniak** : Serveur SMTP fiable et sécurisé
- **STARTTLS** : Chiffrement de la connexion SMTP
