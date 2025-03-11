jQuery(document).ready(function($) {
    // Compteur pour les nouvelles images
    var imageIndex = $('#carousel-images-list .carousel-image-item').length;
    
    // Fonction pour ajouter une nouvelle image
    $('#add-image').on('click', function(e) {
        e.preventDefault();
        
        // Ouvre la bibliothèque de médias WordPress
        var mediaUploader = wp.media({
            title: 'Sélectionner une image pour le carousel',
            button: {
                text: 'Utiliser cette image'
            },
            multiple: false
        });
        
        // Quand une image est sélectionnée
        mediaUploader.on('select', function() {
            var attachment = mediaUploader.state().get('selection').first().toJSON();
            
            // Prépare les données pour le template
            var templateData = {
                index: imageIndex,
                url: attachment.url,
                title: attachment.title || '',
                description: attachment.caption || ''
            };
            
            // Utilise le template pour créer un nouvel élément
            var template = wp.template('carousel-image-item');
            var newItem = template(templateData);
            
            // Ajoute le nouvel élément à la liste
            $('#carousel-images-list').append(newItem);
            
            // Incrémente le compteur
            imageIndex++;
        });
        
        // Ouvre la bibliothèque de médias
        mediaUploader.open();
    });
    
    // Suppression d'une image
    $(document).on('click', '.remove-image', function() {
        $(this).closest('.carousel-image-item').remove();
        
        // Réindexe les champs pour éviter les trous dans les indices
        $('#carousel-images-list .carousel-image-item').each(function(index) {
            $(this).find('input[type="hidden"]').attr('name', 'mon_carousel_images[' + index + '][url]');
            $(this).find('input[type="text"]').attr('name', 'mon_carousel_images[' + index + '][title]');
            $(this).find('textarea').attr('name', 'mon_carousel_images[' + index + '][description]');
        });
    });
    
    // Rendre les images triables (si jQuery UI est disponible)
    if ($.fn.sortable) {
        $('#carousel-images-list').sortable({
            handle: '.carousel-image-preview',
            update: function() {
                // Réindexe les champs après le tri
                $('#carousel-images-list .carousel-image-item').each(function(index) {
                    $(this).find('input[type="hidden"]').attr('name', 'mon_carousel_images[' + index + '][url]');
                    $(this).find('input[type="text"]').attr('name', 'mon_carousel_images[' + index + '][title]');
                    $(this).find('textarea').attr('name', 'mon_carousel_images[' + index + '][description]');
                });
            }
        });
    }
}); 