// Carrossel automático da home
window.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel_slide');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Trocar slide a cada 10 segundos
    if (slides.length > 0) {
        setInterval(nextSlide, 10000);
    }
});
