(function($) {
    'use strict';
    
    $(document).ready(function() {
        // Initialiser tous les carousels sur la page
        $('.carousel-container').each(function() {
            initCarousel($(this));
        });
        
        function initCarousel($container) {
            const $track = $container.find('.carousel-track');
            const $slides = $track.find('.carousel-slide');
            const $nextButton = $container.find('.carousel-button.next');
            const $prevButton = $container.find('.carousel-button.prev');
            const $indicators = $container.find('.carousel-indicator');
            
            // Si aucune slide, ne rien faire
            if ($slides.length === 0) return;
            
            // Variables pour le suivi
            let currentIndex = 0;
            
            // Marquer la première slide comme active
            $slides.eq(0).addClass('active');
            $indicators.eq(0).css('background-color', '#000').addClass('active');
            
            // Fonction pour déplacer vers une slide spécifique
            function moveToSlide(index) {
                if (index < 0 || index >= $slides.length) return;
                
                // Désactiver toutes les slides
                $slides.removeClass('active');
                
                // Activer la slide cible
                $slides.eq(index).addClass('active');
                
                // Mettre à jour les indicateurs
                $indicators.each(function(i) {
                    if (i === index) {
                        $(this).css('background-color', '#000');
                        $(this).addClass('active');
                    } else {
                        $(this).css('background-color', 'rgba(150, 150, 150, 0.7)');
                        $(this).removeClass('active');
                    }
                });
                
                currentIndex = index;
                
                // Mettre à jour l'état des boutons
                updateButtons();
            }
            
            // Mettre à jour l'affichage des boutons
            function updateButtons() {
                $prevButton.toggle(currentIndex > 0);
                $nextButton.toggle(currentIndex < $slides.length - 1);
            }
            
            // Événement pour le bouton suivant
            $nextButton.on('click', function() {
                moveToSlide(currentIndex + 1);
            });
            
            // Événement pour le bouton précédent
            $prevButton.on('click', function() {
                moveToSlide(currentIndex - 1);
            });
            
            // Événement pour les indicateurs
            $indicators.on('click', function() {
                const index = $(this).index();
                moveToSlide(index);
            });
            
            // Défilement automatique (optionnel)
            let autoplayInterval;
            
            function startAutoplay() {
                autoplayInterval = setInterval(function() {
                    if (currentIndex < $slides.length - 1) {
                        moveToSlide(currentIndex + 1);
                    } else {
                        moveToSlide(0); // Retour au début
                    }
                }, 5000); // Intervalle de 5 secondes
            }
            
            function stopAutoplay() {
                clearInterval(autoplayInterval);
            }
            
            // Démarrer le défilement automatique
            startAutoplay();
            
            // Arrêter le défilement au survol
            $container.on('mouseenter', stopAutoplay);
            $container.on('mouseleave', startAutoplay);
            
            // Gestion du swipe sur mobile (si jQuery UI Touch Punch est disponible)
            if ($.fn.swipe) {
                $container.swipe({
                    swipeLeft: function() {
                        moveToSlide(currentIndex + 1);
                    },
                    swipeRight: function() {
                        moveToSlide(currentIndex - 1);
                    },
                    threshold: 75
                });
            }
            
            // Initialiser l'état des boutons
            updateButtons();
        }
    });
})(jQuery);