<?php
/*
Plugin Name: Carousel Rominche
Description: Un carousel personnalisé en JavaScript avec téléversement d'images.
Version: 1.3
Author: Rominche
Author URI: https://github.com/Rominche
Text Domain: carousel-rominche
Domain Path: /languages
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
GitHub Plugin URI: https://github.com/Rominche/wordpress-plugins/carousel-rominche
*/

// Empêche l'accès direct au fichier
if (!defined('ABSPATH')) {
    exit;
}

// Activation du plugin
register_activation_hook(__FILE__, 'mon_carousel_activation');

function mon_carousel_activation() {
    // Création du dossier pour stocker les images téléversées
    $upload_dir = wp_upload_dir();
    $carousel_dir = $upload_dir['basedir'] . '/carousel-rominche';
    
    if (!file_exists($carousel_dir)) {
        wp_mkdir_p($carousel_dir);
    }
}

function mon_carousel_assets() {
    // Charge le CSS
    wp_enqueue_style('mon-carousel-css', plugins_url('css/carousel.css', __FILE__));

    // Charge le JS
    wp_enqueue_script('mon-carousel-js', plugins_url('js/carousel.js', __FILE__), array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'mon_carousel_assets');

function mon_carousel_admin_assets() {
    // Charge les scripts de la bibliothèque media de WordPress
    wp_enqueue_media();
    
    // Charge le CSS admin
    wp_enqueue_style('mon-carousel-admin-css', plugins_url('css/admin.css', __FILE__));
    
    // Charge le JS admin
    wp_enqueue_script('mon-carousel-admin-js', plugins_url('js/admin.js', __FILE__), array('jquery'), null, true);
}
add_action('admin_enqueue_scripts', 'mon_carousel_admin_assets');

function mon_carousel_shortcode() {
    // Récupère les images du carousel
    $carousel_images = get_option('mon_carousel_images', array());
    
    // Si aucune image n'est définie, utilise des placeholders
    if (empty($carousel_images) || !is_array($carousel_images)) {
        $carousel_images = array(
            array('url' => 'https://via.placeholder.com/800x400?text=Slide+1', 'title' => 'Slide 1', 'description' => 'Description du slide 1'),
            array('url' => 'https://via.placeholder.com/800x400?text=Slide+2', 'title' => 'Slide 2', 'description' => 'Description du slide 2'),
            array('url' => 'https://via.placeholder.com/800x400?text=Slide+3', 'title' => 'Slide 3', 'description' => 'Description du slide 3')
        );
    }
    
    ob_start(); // Démarre la temporisation de sortie
    ?>
    <div class="carousel-container">
        <div class="carousel-track">
            <?php foreach ($carousel_images as $image) : ?>
                <div class="carousel-slide">
                    <img src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['title']); ?>">
                    <div class="carousel-content">
                        <?php if (!empty($image['title'])) : ?>
                            <div class="carousel-caption"><?php echo esc_html($image['title']); ?></div>
                        <?php endif; ?>
                        <?php if (!empty($image['description'])) : ?>
                            <div class="carousel-description"><?php echo esc_html($image['description']); ?></div>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        
        <!-- Indicateurs de position (points) -->
        <ul class="carousel-indicators">
            <?php foreach ($carousel_images as $index => $image) : ?>
                <li class="carousel-indicator <?php echo ($index === 0) ? 'active' : ''; ?>" data-index="<?php echo $index; ?>"></li>
            <?php endforeach; ?>
        </ul>
        
        <button class="carousel-button prev">&#10094;</button>
        <button class="carousel-button next">&#10095;</button>
    </div>
    <?php
    return ob_get_clean(); // Retourne le contenu du carousel
}
add_shortcode('carousel-rominche', 'mon_carousel_shortcode');

function mon_carousel_admin_menu() {
    add_menu_page(
        'Carousel Rominche', // Titre de la page
        'Carousel Rominche', // Titre du menu
        'manage_options', // Capacité requise
        'carousel-rominche', // Slug du menu
        'mon_carousel_admin_page', // Fonction de rappel
        'dashicons-images-alt2', // Icône
        6 // Position
    );
}
add_action('admin_menu', 'mon_carousel_admin_menu');

function mon_carousel_admin_page() {
    // Traitement du formulaire de téléversement
    if (isset($_POST['mon_carousel_save_images']) && check_admin_referer('mon_carousel_save_images_nonce')) {
        $images = isset($_POST['mon_carousel_images']) ? $_POST['mon_carousel_images'] : array();
        $carousel_images = array();
        
        foreach ($images as $image) {
            if (!empty($image['url'])) {
                $carousel_images[] = array(
                    'url' => esc_url_raw($image['url']),
                    'title' => sanitize_text_field($image['title']),
                    'description' => sanitize_textarea_field($image['description'])
                );
            }
        }
        
        update_option('mon_carousel_images', $carousel_images);
        echo '<div class="notice notice-success is-dismissible"><p>Images du carousel mises à jour avec succès.</p></div>';
    }
    
    // Récupère les images actuelles
    $carousel_images = get_option('mon_carousel_images', array());
    
    // Si aucune image n'est définie, initialise avec un tableau vide
    if (!is_array($carousel_images)) {
        $carousel_images = array();
    }
    ?>
    <div class="wrap">
        <h1>Carousel Rominche</h1>
        
        <div class="carousel-admin-container">
            <form method="post" action="">
                <?php wp_nonce_field('mon_carousel_save_images_nonce'); ?>
                
                <div class="carousel-images-container">
                    <h2>Images du carousel</h2>
                    <p>Ajoutez, réorganisez et supprimez les images de votre carousel.</p>
                    
                    <div id="carousel-images-list">
                        <?php if (!empty($carousel_images)) : ?>
                            <?php foreach ($carousel_images as $index => $image) : ?>
                                <div class="carousel-image-item">
                                    <div class="carousel-image-preview">
                                        <img src="<?php echo esc_url($image['url']); ?>" alt="">
                                    </div>
                                    <div class="carousel-image-details">
                                        <input type="hidden" name="mon_carousel_images[<?php echo $index; ?>][url]" value="<?php echo esc_attr($image['url']); ?>">
                                        <label>
                                            Titre:
                                            <input type="text" name="mon_carousel_images[<?php echo $index; ?>][title]" value="<?php echo esc_attr($image['title']); ?>">
                                        </label>
                                        <label>
                                            Description:
                                            <textarea name="mon_carousel_images[<?php echo $index; ?>][description]" rows="3"><?php echo esc_textarea(isset($image['description']) ? $image['description'] : ''); ?></textarea>
                                        </label>
                                    </div>
                                    <button type="button" class="button remove-image">Supprimer</button>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                    
                    <div class="carousel-actions">
                        <button type="button" class="button button-primary" id="add-image">Ajouter une image</button>
                    </div>
                </div>
                
                <p class="submit">
                    <input type="submit" name="mon_carousel_save_images" class="button button-primary" value="Enregistrer les modifications">
                </p>
            </form>
            
            <div class="carousel-shortcode-info">
                <h2>Utilisation du shortcode</h2>
                <p>Pour afficher ce carousel sur votre site, utilisez le shortcode suivant :</p>
                <code>[carousel-rominche]</code>
            </div>
        </div>
    </div>
    
    <!-- Template pour les nouvelles images -->
    <script type="text/html" id="tmpl-carousel-image-item">
        <div class="carousel-image-item">
            <div class="carousel-image-preview">
                <img src="{{ data.url }}" alt="">
            </div>
            <div class="carousel-image-details">
                <input type="hidden" name="mon_carousel_images[{{ data.index }}][url]" value="{{ data.url }}">
                <label>
                    Titre:
                    <input type="text" name="mon_carousel_images[{{ data.index }}][title]" value="{{ data.title }}">
                </label>
                <label>
                    Description:
                    <textarea name="mon_carousel_images[{{ data.index }}][description]" rows="3">{{ data.description }}</textarea>
                </label>
            </div>
            <button type="button" class="button remove-image">Supprimer</button>
        </div>
    </script>
    <?php
}