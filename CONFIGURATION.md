# Configuration du formulaire de contact

## Problème actuel

Le formulaire de contact renvoie une erreur 400 avec le message "Échec de la vérification anti-bot" car le fichier `.env` n'est pas configuré sur le serveur de production.

## Solution : Configurer le fichier .env sur le serveur

### 1. Créer le fichier .env sur le serveur

Connectez-vous à votre serveur nantares.com via SSH ou FTP, puis créez un fichier `.env` à la racine du projet (au même niveau que `index.html`).

### 2. Copier le contenu de .env.example

Copiez le contenu du fichier `.env.example` dans votre nouveau fichier `.env` :

```bash
cp .env.example .env
```

### 3. Récupérer vos clés reCAPTCHA

1. Allez sur [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Si vous n'avez pas encore de site reCAPTCHA, créez-en un :
   - Type : reCAPTCHA v2
   - Option : "Case à cocher Je ne suis pas un robot"
   - Domaines : `nantares.com` (et `www.nantares.com` si nécessaire)
3. Récupérez vos deux clés :
   - **Clé du site (Site Key)** : Utilisée dans le HTML (déjà configurée : `6LeuO_MrAAAAAMhg49hVpMwyz0dwNkIXqZyhczjr`)
   - **Clé secrète (Secret Key)** : À mettre dans le fichier `.env`

### 4. Configurer le fichier .env

Éditez le fichier `.env` et remplissez les valeurs suivantes :

```env
# Configuration SMTP Infomaniak
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_USERNAME=johan.protin@nantares.com
SMTP_PASSWORD=VOTRE_MOT_DE_PASSE_SMTP_EN_BASE64
SMTP_ENCRYPTION=tls

# Configuration Google reCAPTCHA v2
RECAPTCHA_SECRET_KEY=VOTRE_CLE_SECRETE_RECAPTCHA
```

### 5. Encoder le mot de passe SMTP en base64

Pour encoder votre mot de passe SMTP en base64 :

```bash
# Sur Linux/Mac
echo -n "votre_mot_de_passe" | base64

# Sur Windows PowerShell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("votre_mot_de_passe"))
```

### 6. Vérifier les permissions du fichier .env

Assurez-vous que le fichier `.env` n'est pas accessible publiquement :

```bash
chmod 600 .env
```

### 7. Vérifier que .env est dans .gitignore

Le fichier `.env` ne doit JAMAIS être commité dans Git. Vérifiez qu'il est bien dans `.gitignore` :

```bash
cat .gitignore | grep ".env"
```

## Vérification des logs

Après avoir configuré le fichier `.env`, vous pouvez vérifier les logs d'erreur pour diagnostiquer les problèmes :

```bash
# Les logs sont créés automatiquement dans :
backend/logs/email-errors.log
```

Les logs contiennent maintenant des informations détaillées sur :
- La présence du token reCAPTCHA
- La configuration de la clé secrète
- La réponse de l'API Google reCAPTCHA
- Les données POST reçues

## Test du formulaire

Après configuration :

1. Rechargez la page du site
2. Remplissez le formulaire de contact
3. Cochez la case "Je ne suis pas un robot"
4. Cliquez sur "Envoyer le message"
5. Vérifiez que le message est bien envoyé

Si le problème persiste, consultez les logs dans `backend/logs/email-errors.log` pour plus de détails.

## Clés actuellement configurées

- **Clé publique reCAPTCHA (dans index.html)** : `6LeuO_MrAAAAAMhg49hVpMwyz0dwNkIXqZyhczjr`
- **Clé secrète reCAPTCHA (dans .env)** : À configurer
- **Email de réception** : `johan.protin@nantares.com`

## Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs : `backend/logs/email-errors.log`
2. Vérifiez que le fichier `.env` existe et est bien rempli
3. Vérifiez que les clés reCAPTCHA sont valides et correspondent bien au domaine `nantares.com`
4. Vérifiez que les informations SMTP sont correctes
