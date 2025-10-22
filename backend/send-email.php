<?php
/**
 * Script d'envoi d'email pour le formulaire de contact
 * Envoie les messages à johan.protin@nantares.com
 */

// Configuration des en-têtes pour les réponses JSON
header('Content-Type: application/json; charset=utf-8');

// Activer l'affichage des erreurs pour le développement (à désactiver en production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Permettre les requêtes CORS si nécessaire
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Gérer les requêtes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Vérifier que la méthode est POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée. Utilisez POST.'
    ]);
    exit;
}

// Configuration email
define('RECIPIENT_EMAIL', 'johan.protin@nantares.com');
define('RECIPIENT_NAME', 'Johan Protin');
define('FROM_EMAIL', 'noreply@cloudarchitect.fr');
define('FROM_NAME', 'Portfolio Cloud Architect');

/**
 * Fonction pour nettoyer les données d'entrée
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Fonction pour valider une adresse email
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Fonction pour logger les erreurs
 */
function logError($message) {
    $logFile = __DIR__ . '/logs/email-errors.log';
    $logDir = dirname($logFile);

    if (!file_exists($logDir)) {
        @mkdir($logDir, 0755, true);
    }

    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message" . PHP_EOL;
    @file_put_contents($logFile, $logMessage, FILE_APPEND);
}

try {
    // Récupérer les données POST
    $name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
    $message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';

    // Tableau pour stocker les erreurs
    $errors = [];

    // Validation des champs
    if (empty($name)) {
        $errors[] = 'Le nom est requis.';
    } elseif (strlen($name) < 2) {
        $errors[] = 'Le nom doit contenir au moins 2 caractères.';
    } elseif (strlen($name) > 100) {
        $errors[] = 'Le nom ne peut pas dépasser 100 caractères.';
    }

    if (empty($email)) {
        $errors[] = "L'adresse email est requise.";
    } elseif (!validateEmail($email)) {
        $errors[] = "L'adresse email n'est pas valide.";
    }

    if (empty($message)) {
        $errors[] = 'Le message est requis.';
    } elseif (strlen($message) < 10) {
        $errors[] = 'Le message doit contenir au moins 10 caractères.';
    } elseif (strlen($message) > 5000) {
        $errors[] = 'Le message ne peut pas dépasser 5000 caractères.';
    }

    // Si des erreurs sont présentes, retourner les erreurs
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Erreurs de validation',
            'errors' => $errors
        ]);
        exit;
    }

    // Protection anti-spam simple (vérifier le temps de remplissage)
    // En production, vous pourriez ajouter un CAPTCHA (reCAPTCHA, hCaptcha, etc.)

    // Construction du sujet de l'email
    $subject = 'Nouveau message depuis le portfolio - ' . $name;

    // Construction du corps de l'email (version texte)
    $bodyText = "Nouveau message reçu depuis le formulaire de contact du portfolio\n\n";
    $bodyText .= "Nom: $name\n";
    $bodyText .= "Email: $email\n";
    $bodyText .= "Date: " . date('d/m/Y à H:i:s') . "\n\n";
    $bodyText .= "Message:\n";
    $bodyText .= str_repeat('-', 50) . "\n";
    $bodyText .= $message . "\n";
    $bodyText .= str_repeat('-', 50) . "\n\n";
    $bodyText .= "---\n";
    $bodyText .= "Cet email a été envoyé automatiquement depuis le formulaire de contact.\n";

    // Construction du corps de l'email (version HTML)
    $bodyHtml = '
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouveau message de contact</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background: linear-gradient(135deg, #5fa9c0 0%, #f89576 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                background: #ffffff;
                padding: 30px;
                border: 1px solid #e0e0e0;
                border-top: none;
            }
            .info-row {
                margin-bottom: 15px;
                padding: 10px;
                background: #f5f5f5;
                border-radius: 5px;
            }
            .info-label {
                font-weight: bold;
                color: #5fa9c0;
                margin-bottom: 5px;
            }
            .message-box {
                background: #fffcf3;
                border-left: 4px solid #f89576;
                padding: 20px;
                margin: 20px 0;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            .footer {
                background: #f5f5f5;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-radius: 0 0 10px 10px;
                border: 1px solid #e0e0e0;
                border-top: none;
            }
            .button {
                display: inline-block;
                padding: 12px 30px;
                background: #5fa9c0;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📧 Nouveau message de contact</h1>
        </div>

        <div class="content">
            <p>Vous avez reçu un nouveau message depuis le formulaire de contact de votre portfolio.</p>

            <div class="info-row">
                <div class="info-label">Nom du contact:</div>
                <div>' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</div>
            </div>

            <div class="info-row">
                <div class="info-label">Adresse email:</div>
                <div><a href="mailto:' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '">' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</a></div>
            </div>

            <div class="info-row">
                <div class="info-label">Date de réception:</div>
                <div>' . date('d/m/Y à H:i:s') . '</div>
            </div>

            <div class="message-box">
                <div class="info-label">Message:</div>
                ' . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . '
            </div>

            <a href="mailto:' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '" class="button">Répondre au contact</a>
        </div>

        <div class="footer">
            <p>Cet email a été envoyé automatiquement depuis votre portfolio.<br>
            Ne répondez pas à cet email, utilisez plutôt l\'adresse email du contact ci-dessus.</p>
        </div>
    </body>
    </html>
    ';

    // Configuration des en-têtes de l'email
    $headers = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: multipart/alternative; boundary="boundary-' . md5(uniqid()) . '"';
    $headers[] = 'From: ' . FROM_NAME . ' <' . FROM_EMAIL . '>';
    $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
    $headers[] = 'X-Mailer: PHP/' . phpversion();
    $headers[] = 'X-Priority: 1';
    $headers[] = 'Importance: High';

    // Construction du message multipart (texte + HTML)
    $boundary = 'boundary-' . md5(uniqid());

    $fullMessage = "--$boundary\n";
    $fullMessage .= "Content-Type: text/plain; charset=UTF-8\n";
    $fullMessage .= "Content-Transfer-Encoding: 8bit\n\n";
    $fullMessage .= $bodyText . "\n\n";
    $fullMessage .= "--$boundary\n";
    $fullMessage .= "Content-Type: text/html; charset=UTF-8\n";
    $fullMessage .= "Content-Transfer-Encoding: 8bit\n\n";
    $fullMessage .= $bodyHtml . "\n\n";
    $fullMessage .= "--$boundary--";

    // Envoi de l'email
    $mailSent = mail(
        RECIPIENT_EMAIL,
        $subject,
        $fullMessage,
        implode("\r\n", $headers)
    );

    if ($mailSent) {
        // Succès
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.'
        ]);
    } else {
        // Échec de l'envoi
        logError("Échec de l'envoi de l'email à " . RECIPIENT_EMAIL);

        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard ou me contacter directement."
        ]);
    }

} catch (Exception $e) {
    // Gestion des erreurs inattendues
    logError("Exception: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => "Une erreur inattendue s'est produite. Veuillez réessayer plus tard."
    ]);
}
?>
