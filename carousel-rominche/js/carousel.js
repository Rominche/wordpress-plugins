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
            
            // S'assurer que seule la première slide est visible
            $slides.css('display', 'none');
            $slides.first().css('display', 'block');
            
            // Fonction pour déplacer vers une slide spécifique
            function moveToSlide(index) {
                if (index < 0 || index >= $slides.length) return;
                
                // Masquer toutes les slides
                $slides.css('display', 'none');
                
                // Afficher la slide cible
                $slides.eq(index).css('display', 'block');
                
                // Mettre à jour les indicateurs
                $indicators.each(function(i) {
                    if (i === index) {
                        $(this).css('background-color', '#000').addClass('active');
                    } else {
                        $(this).css('background-color', 'rgba(150, 150, 150, 0.7)').removeClass('active');
                    }
                });
                
                currentIndex = index;
                updateButtons();
            }
            
            // Mettre à jour l'affichage des boutons
            function updateButtons() {
                $prevButton.toggle(currentIndex > 0);
                $nextButton.toggle(currentIndex < $slides.length - 1);
            }
            
            // Événement pour le bouton suivant
            $nextButton.on('click', function(e) {
                e.preventDefault();
                moveToSlide(currentIndex + 1);
            });
            
            // Événement pour le bouton précédent
            $prevButton.on('click', function(e) {
                e.preventDefault();
                moveToSlide(currentIndex - 1);
            });
            
            // Événement pour les indicateurs
            $indicators.each(function(index) {
                $(this).on('click touchend', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    moveToSlide(index);
                });
            });
            
            // Défilement automatique (optionnel)
            let autoplayInterval;
            let isAutoplayPaused = false;
            
            function startAutoplay() {
                if (!isAutoplayPaused) {
                    autoplayInterval = setInterval(function() {
                        if (currentIndex < $slides.length - 1) {
                            moveToSlide(currentIndex + 1);
                        } else {
                            moveToSlide(0);
                        }
                    }, 5000);
                }
            }
            
            function stopAutoplay() {
                clearInterval(autoplayInterval);
            }
            
            // Démarrer le défilement automatique
            startAutoplay();
            
            // Arrêter le défilement au survol ou au toucher
            $container.on('mouseenter touchstart', function() {
                isAutoplayPaused = true;
                stopAutoplay();
            });
            
            $container.on('mouseleave touchend', function() {
                isAutoplayPaused = false;
                startAutoplay();
            });
            
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