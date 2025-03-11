<?php
/*
Plugin Name: Carousel de rominche
Description: Un carousel personnalisé en JavaScript.
Version: 1.0
Author: Rominche
*/

// Empêche l'accès direct au fichier
if (!defined('ABSPATH')) {
    exit;
}

function mon_carousel_assets() {
    // Charge le CSS
    wp_enqueue_style('mon-carousel-css', plugins_url('css/carousel.css', __FILE__));

    // Charge le JS
    wp_enqueue_script('mon-carousel-js', plugins_url('js/carousel.js', __FILE__), array(), null, true);
}
add_action('wp_enqueue_scripts', 'mon_carousel_assets');

function mon_carousel_shortcode() {
    ob_start(); // Démarre la temporisation de sortie
    ?>
    <div class="carousel-container">
        <div class="carousel-track">
            <div class="carousel-slide">
                <img src="https://via.placeholder.com/800x400?text=Slide+1" alt="Slide 1">
            </div>
            <div class="carousel-slide">
                <img src="https://via.placeholder.com/800x400?text=Slide+2" alt="Slide 2">
            </div>
            <div class="carousel-slide">
                <img src="https://via.placeholder.com/800x400?text=Slide+3" alt="Slide 3">
            </div>
        </div>
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
    ?>
    <div class="wrap">
        <h1>Carousel Rominche</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('mon_carousel_options_group');
            do_settings_sections('carousel-rominche');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

function mon_carousel_settings() {
    register_setting('mon_carousel_options_group', 'mon_carousel_images', 'sanitize_text_field');
    add_settings_section('mon_carousel_main_section', 'Paramètres du carousel', null, 'carousel-rominche');
    add_settings_field('mon_carousel_images_field', 'URL des images (séparées par des virgules)', 'mon_carousel_images_field_callback', 'carousel-rominche', 'mon_carousel_main_section');
}
add_action('admin_init', 'mon_carousel_settings');

function mon_carousel_images_field_callback() {
    $images = get_option('mon_carousel_images', '');
    echo '<input type="text" name="mon_carousel_images" value="' . esc_attr($images) . '" class="regular-text">';
}