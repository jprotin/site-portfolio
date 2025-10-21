# Configuration de l'envoi d'emails - Portfolio Cloud Solution Architect

Ce document explique comment configurer l'envoi d'emails depuis le formulaire de contact.

## 📋 Vue d'ensemble

Le formulaire de contact envoie automatiquement les messages à **johan.protin@nantares.com** via le script PHP `send-email.php`.

## 🔧 Prérequis

### Serveur Web
- **Serveur web** : Apache ou Nginx avec support PHP
- **PHP** : Version 7.4 ou supérieure (recommandé : PHP 8.0+)
- **Extensions PHP requises** :
  - `mail` (fonction mail() de PHP)
  - `json`
  - `filter`

### Configuration du serveur mail

Pour que l'envoi d'emails fonctionne, votre serveur doit avoir un agent de transfert de mail (MTA) configuré :

#### Option 1 : Serveur Linux avec Sendmail/Postfix
```bash
# Installer sendmail (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install sendmail

# OU installer Postfix
sudo apt-get install postfix

# Vérifier que le service est actif
sudo systemctl status sendmail
# OU
sudo systemctl status postfix
```

#### Option 2 : Utiliser un serveur SMTP externe (recommandé pour production)
Pour une meilleure délivrabilité, il est recommandé d'utiliser un service SMTP comme :
- SendGrid
- Mailgun
- Amazon SES
- SMTP Gmail

**Note** : Le script actuel utilise la fonction `mail()` de PHP. Pour utiliser un SMTP externe, vous devrez modifier `send-email.php` pour utiliser une bibliothèque comme PHPMailer.

## 📁 Fichiers créés

```
site-portfolio/
├── send-email.php          # Script PHP d'envoi d'email
├── .htaccess              # Configuration Apache
├── EMAIL_SETUP.md         # Ce fichier
├── script.js              # JavaScript (modifié pour AJAX)
└── logs/                  # Dossier créé automatiquement pour les logs
    └── email-errors.log   # Log des erreurs d'envoi
```

## 🚀 Installation

### 1. Déploiement sur un serveur web

#### Avec Apache
```bash
# Copier tous les fichiers sur votre serveur web
scp -r * user@your-server.com:/var/www/html/portfolio/

# Vérifier les permissions
sudo chown -R www-data:www-data /var/www/html/portfolio/
sudo chmod 755 /var/www/html/portfolio/
sudo chmod 644 /var/www/html/portfolio/*
sudo chmod 755 /var/www/html/portfolio/send-email.php

# Créer le dossier logs avec les bonnes permissions
sudo mkdir -p /var/www/html/portfolio/logs
sudo chown www-data:www-data /var/www/html/portfolio/logs
sudo chmod 755 /var/www/html/portfolio/logs
```

#### Avec Nginx + PHP-FPM
```nginx
# Configuration Nginx (/etc/nginx/sites-available/portfolio)
server {
    listen 80;
    server_name votre-domaine.com;

    root /var/www/html/portfolio;
    index index.html index.php;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }

    location ~ /logs/ {
        deny all;
    }
}
```

### 2. Configuration PHP

Vérifier la configuration PHP (`php.ini`) :

```ini
# Activer l'envoi d'emails
mail.add_x_header = On

# Configuration SMTP (pour Windows uniquement)
# SMTP = smtp.example.com
# smtp_port = 587

# Pour Linux, sendmail_path doit pointer vers sendmail
sendmail_path = /usr/sbin/sendmail -t -i

# Taille maximale des posts
post_max_size = 10M
upload_max_filesize = 10M

# Sécurité
display_errors = Off
log_errors = On
error_log = /var/log/php/error.log
```

### 3. Test de l'envoi d'email

#### Test simple depuis le terminal
```bash
# Test d'envoi avec la fonction mail de PHP
php -r "mail('johan.protin@nantares.com', 'Test', 'Ceci est un test');"

# Vérifier les logs
tail -f /var/log/mail.log
```

#### Test depuis le navigateur
1. Ouvrez votre site web
2. Allez sur la section Contact
3. Remplissez le formulaire
4. Cliquez sur "Envoyer le message"
5. Vérifiez que vous recevez un email à johan.protin@nantares.com

## 🔍 Dépannage

### L'email n'arrive pas

**Vérifier les logs du serveur** :
```bash
# Logs PHP
tail -f /var/log/php/error.log

# Logs Apache
tail -f /var/log/apache2/error.log

# Logs mail
tail -f /var/log/mail.log

# Logs du script
tail -f /var/www/html/portfolio/logs/email-errors.log
```

**Vérifier que sendmail/postfix est actif** :
```bash
sudo systemctl status sendmail
# OU
sudo systemctl status postfix
```

**Test d'envoi manuel** :
```bash
echo "Test email body" | mail -s "Test Subject" johan.protin@nantares.com
```

### Emails marqués comme spam

1. **Configurer SPF** : Ajouter un enregistrement TXT dans votre DNS
   ```
   v=spf1 a mx ip4:VOTRE_IP_SERVEUR ~all
   ```

2. **Configurer DKIM** : Installer et configurer OpenDKIM
   ```bash
   sudo apt-get install opendkim opendkim-tools
   ```

3. **Configurer DMARC** : Ajouter un enregistrement TXT
   ```
   v=DMARC1; p=none; rua=mailto:postmaster@votre-domaine.com
   ```

### Erreur 500 lors de l'envoi

1. Vérifier les permissions du fichier PHP :
   ```bash
   sudo chmod 755 send-email.php
   ```

2. Vérifier les logs PHP pour voir l'erreur exacte

3. Vérifier que toutes les extensions PHP sont installées :
   ```bash
   php -m | grep -E 'mail|json|filter'
   ```

## 🔐 Sécurité

### Mesures de sécurité implémentées

✅ **Validation des données** : Tous les champs sont validés (nom, email, message)
✅ **Sanitization** : Les données sont nettoyées pour éviter les injections
✅ **Protection XSS** : Headers de sécurité dans `.htaccess`
✅ **Limitation de taille** : Messages limités à 5000 caractères
✅ **Logging** : Les erreurs sont loggées de manière sécurisée

### Améliorations recommandées pour la production

1. **Ajouter un CAPTCHA** (reCAPTCHA v3 ou hCaptcha)
   ```html
   <script src="https://www.google.com/recaptcha/api.js" async defer></script>
   <div class="g-recaptcha" data-sitekey="VOTRE_CLE_SITE"></div>
   ```

2. **Rate limiting** : Limiter le nombre de soumissions par IP
   ```php
   // Exemple simple dans send-email.php
   session_start();
   $max_submissions = 3;
   $time_window = 3600; // 1 heure
   ```

3. **Honeypot field** : Champ caché pour bloquer les bots
   ```html
   <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
   ```

4. **HTTPS** : Activer SSL/TLS sur votre serveur
   ```bash
   sudo apt-get install certbot python3-certbot-apache
   sudo certbot --apache
   ```

## 📧 Utiliser un SMTP externe (recommandé)

Pour une meilleure délivrabilité, utilisez PHPMailer avec un service SMTP :

### Installation de PHPMailer
```bash
composer require phpmailer/phpmailer
```

### Exemple de configuration (à intégrer dans send-email.php)
```php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    // Configuration SMTP
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'votre-email@gmail.com';
    $mail->Password   = 'votre-mot-de-passe-app';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Destinataires
    $mail->setFrom('noreply@cloudarchitect.fr', 'Portfolio Contact');
    $mail->addAddress('johan.protin@nantares.com', 'Johan Protin');
    $mail->addReplyTo($email, $name);

    // Contenu
    $mail->isHTML(true);
    $mail->Subject = 'Nouveau message depuis le portfolio - ' . $name;
    $mail->Body    = $bodyHtml;
    $mail->AltBody = $bodyText;

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Email envoyé !']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur: ' . $mail->ErrorInfo]);
}
```

## 📊 Monitoring

### Vérifier les logs régulièrement
```bash
# Créer un script de monitoring
cat > monitor-emails.sh << 'EOF'
#!/bin/bash
echo "=== Logs des erreurs d'email ==="
tail -n 20 /var/www/html/portfolio/logs/email-errors.log

echo -e "\n=== Emails envoyés récemment ==="
grep "mail" /var/log/mail.log | tail -n 10
EOF

chmod +x monitor-emails.sh
```

### Configurer des alertes
```bash
# Créer un cron job pour vérifier les erreurs
crontab -e

# Ajouter cette ligne pour vérifier toutes les heures
0 * * * * [ -s /var/www/html/portfolio/logs/email-errors.log ] && mail -s "Erreurs email portfolio" admin@example.com < /var/www/html/portfolio/logs/email-errors.log
```

## 🎯 Configuration avancée

### Variables d'environnement (recommandé)

Créer un fichier `.env` (à ne pas commiter dans Git) :
```env
EMAIL_RECIPIENT=johan.protin@nantares.com
EMAIL_FROM=noreply@cloudarchitect.fr
EMAIL_FROM_NAME=Portfolio Cloud Architect
```

Modifier `send-email.php` pour charger ces variables :
```php
// Charger les variables d'environnement
if (file_exists(__DIR__ . '/.env')) {
    $env = parse_ini_file(__DIR__ . '/.env');
    define('RECIPIENT_EMAIL', $env['EMAIL_RECIPIENT']);
    define('FROM_EMAIL', $env['EMAIL_FROM']);
    define('FROM_NAME', $env['EMAIL_FROM_NAME']);
}
```

## 📝 Support

Pour toute question ou problème :
1. Vérifier les logs dans `logs/email-errors.log`
2. Vérifier la configuration PHP avec `phpinfo()`
3. Tester l'envoi d'email manuellement depuis le serveur

## 🔄 Mise à jour

Pour modifier l'adresse email de réception, éditer le fichier `send-email.php` :
```php
define('RECIPIENT_EMAIL', 'nouvelle-adresse@example.com');
```

---

**Dernière mise à jour** : 2025
**Version** : 1.0
