document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');

    const slideWidth = slides[0].getBoundingClientRect().width;

    // Positionne les slides côte à côte
    slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    });

    // Déplacer la slide
    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    // Cacher ou afficher les boutons en fonction de la position
    const updateButtons = (slides, prevButton, nextButton, targetIndex) => {
        if (targetIndex === 0) {
            prevButton.style.display = 'none';
        } else {
            prevButton.style.display = 'block';
        }

        if (targetIndex === slides.length - 1) {
            nextButton.style.display = 'none';
        } else {
            nextButton.style.display = 'block';
        }
    };

    // Événement pour le bouton suivant
    nextButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling;
        const nextIndex = slides.findIndex(slide => slide === nextSlide);

        moveToSlide(track, currentSlide, nextSlide);
        updateButtons(slides, prevButton, nextButton, nextIndex);
    });

    // Événement pour le bouton précédent
    prevButton.addEventListener('click', () => {
        const currentSlide = track.querySelector('.current-slide');
        const prevSlide = currentSlide.previousElementSibling;
        const prevIndex = slides.findIndex(slide => slide === prevSlide);

        moveToSlide(track, currentSlide, prevSlide);
        updateButtons(slides, prevButton, nextButton, prevIndex);
    });

    // Initialiser le carousel
    slides[0].classList.add('current-slide');
    prevButton.style.display = 'none'; // Cacher le bouton précédent au départ
});