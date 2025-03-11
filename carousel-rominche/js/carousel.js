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
            let slideWidth = $container.width();
            
            // Positionner les slides côte à côte
            $slides.each(function(index) {
                $(this).css('left', slideWidth * index + 'px');
            });
            
            // Marquer la première slide comme active
            $slides.eq(0).addClass('active');
            $indicators.eq(0).addClass('active');
            
            // Fonction pour déplacer vers une slide spécifique
            function moveToSlide(index) {
                if (index < 0 || index >= $slides.length) return;
                
                $track.css('transform', 'translateX(-' + (slideWidth * index) + 'px)');
                $slides.removeClass('active');
                $slides.eq(index).addClass('active');
                
                // Mettre à jour les indicateurs
                $indicators.removeClass('active');
                $indicators.eq(index).addClass('active');
                
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
                const index = $(this).index(); // Utiliser l'index de l'élément dans la liste
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
            
            // Gestion du redimensionnement de la fenêtre
            $(window).on('resize', function() {
                // Recalculer la largeur des slides
                slideWidth = $container.width();
                
                // Repositionner les slides
                $slides.each(function(index) {
                    $(this).css('left', slideWidth * index + 'px');
                });
                
                // Déplacer vers la slide actuelle
                moveToSlide(currentIndex);
            });
            
            // Initialiser l'état des boutons
            updateButtons();
        }
    });
})(jQuery);