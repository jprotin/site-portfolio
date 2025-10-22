# Site Portfolio - Cloud Solution Architect

Portfolio professionnel avec formulaire de contact sécurisé et protection anti-bot.

## Fonctionnalités

- Portfolio responsive avec Tailwind CSS
- Formulaire de contact avec validation
- Envoi d'emails via PHPMailer (SMTP)
- Protection anti-bot avec Google reCAPTCHA v3
- Animations et effets visuels modernes

## Prérequis

- Serveur web avec PHP 7.4+
- Composer (pour les dépendances PHP)
- Compte SMTP (Infomaniak, Gmail, etc.)
- Compte Google reCAPTCHA v3

## Installation

### 1. Cloner le dépôt

```bash
git clone <votre-repo>
cd site-portfolio
```

### 2. Installer les dépendances PHP

```bash
composer install
```

### 3. Configuration de l'environnement

Copiez le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Éditez le fichier `.env` avec vos informations :

```env
# Configuration SMTP
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_USERNAME=votre-email@votredomaine.com
SMTP_PASSWORD=votre-mot-de-passe-en-base64
SMTP_ENCRYPTION=tls

# Configuration reCAPTCHA
RECAPTCHA_SECRET_KEY=votre-cle-secrete-recaptcha
RECAPTCHA_MINIMUM_SCORE=0.5
```

**Note :** Le mot de passe SMTP doit être encodé en base64. Vous pouvez l'encoder avec :
```bash
echo -n "votre-mot-de-passe" | base64
```

### 4. Configuration de Google reCAPTCHA v3

#### Étape 1 : Créer un site reCAPTCHA

1. Allez sur [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
2. Connectez-vous avec votre compte Google
3. Remplissez le formulaire :
   - **Libellé** : Nom de votre site (ex: "Portfolio Contact Form")
   - **Type de reCAPTCHA** : Choisissez **reCAPTCHA v3**
   - **Domaines** : Ajoutez votre(vos) domaine(s) (ex: `example.com`, `www.example.com`)
     - Pour le développement local, ajoutez aussi `localhost`
4. Acceptez les conditions d'utilisation
5. Cliquez sur "Envoyer"

#### Étape 2 : Récupérer les clés

Vous obtiendrez deux clés :
- **Clé du site (Site Key)** : Clé publique à utiliser côté client
- **Clé secrète (Secret Key)** : Clé privée à utiliser côté serveur

#### Étape 3 : Configurer les clés dans le code

**Dans le fichier `.env` :**
```env
RECAPTCHA_SECRET_KEY=votre-cle-secrete-ici
```

**Dans `index.html` (ligne 21) :**
```html
<script src="https://www.google.com/recaptcha/api.js?render=VOTRE_CLE_DU_SITE"></script>
```

**Dans `scripts/script.js` (ligne 283) :**
```javascript
grecaptcha.execute('VOTRE_CLE_DU_SITE', {action: 'contact_form'})
```

Remplacez `YOUR_RECAPTCHA_SITE_KEY` et `VOTRE_CLE_DU_SITE` par votre véritable clé du site (Site Key).

### 5. Permissions des dossiers

Assurez-vous que le dossier `backend/logs` est accessible en écriture :

```bash
mkdir -p backend/logs
chmod 755 backend/logs
```

## Structure du projet

```
site-portfolio/
├── index.html              # Page principale
├── styles/
│   └── style.css          # Styles CSS personnalisés
├── scripts/
│   └── script.js          # JavaScript (formulaire, animations)
├── backend/
│   ├── send-email.php     # Script d'envoi d'emails avec validation reCAPTCHA
│   └── logs/              # Logs d'erreurs
├── img/                   # Images
├── vendor/                # Dépendances PHP (Composer)
├── .env                   # Configuration (à créer, non versionné)
├── .env.example           # Exemple de configuration
└── composer.json          # Dépendances PHP

```

## Comment ça fonctionne

### Protection anti-bot avec reCAPTCHA v3

reCAPTCHA v3 fonctionne de manière invisible :

1. **Côté client (JavaScript)** :
   - Lors de la soumission du formulaire, un token est généré par Google
   - Le token est ajouté aux données envoyées au serveur

2. **Côté serveur (PHP)** :
   - Le token est vérifié auprès de l'API Google
   - Google retourne un score entre 0.0 (bot probable) et 1.0 (humain probable)
   - Si le score est inférieur au seuil configuré (0.5 par défaut), la soumission est rejetée

3. **Avantages** :
   - Pas de CAPTCHA visible (meilleure UX)
   - Détection basée sur le comportement
   - Protection efficace contre les bots automatisés

### Score reCAPTCHA

Le score minimum recommandé est **0.5** :
- **1.0** : Très probablement un humain
- **0.5** : Score neutre (seuil recommandé)
- **0.0** : Très probablement un bot

Vous pouvez ajuster ce seuil dans `.env` avec `RECAPTCHA_MINIMUM_SCORE`.

## Déploiement

1. Uploadez tous les fichiers sur votre serveur web
2. Configurez le fichier `.env` avec vos vraies informations
3. Assurez-vous que PHP et Composer sont installés sur le serveur
4. Exécutez `composer install` sur le serveur si nécessaire
5. Testez le formulaire de contact

## Sécurité

- ✅ Validation côté client et serveur
- ✅ Protection anti-spam avec reCAPTCHA v3
- ✅ Sanitisation des entrées utilisateur
- ✅ CORS configuré
- ✅ Logs des erreurs
- ✅ Headers de sécurité
- ⚠️ **Important** : Ne jamais commiter le fichier `.env` dans Git

## Support

Pour toute question ou problème :
- Vérifiez les logs dans `backend/logs/email-errors.log`
- Vérifiez que toutes les clés (SMTP et reCAPTCHA) sont correctement configurées
- Vérifiez que votre domaine est bien ajouté dans la console Google reCAPTCHA

## Licence

© 2025 Cloud Solution Architect - Tous droits réservés
