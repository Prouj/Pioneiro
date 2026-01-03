// Carrossel automático da galeria
let currentSlide = 0;
let autoPlayInterval = null;
let images = [];

async function loadGalleryImages() {
  try {
    const response = await fetch('./gallery-images.json');
    const data = await response.json();
    images = data.images;
    initCarousel();
  } catch (error) {
    console.error('Erro ao carregar imagens da galeria:', error);
  }
}

function initCarousel() {
  const track = document.querySelector('.carousel_track');
  const dotsContainer = document.querySelector('.carousel_dots');
  
  if (!track || !dotsContainer || images.length === 0) return;

  // Criar slides
  images.forEach((img, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel_slide';
    slide.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy">`;
    track.appendChild(slide);

    // Criar indicadores (dots)
    const dot = document.createElement('button');
    dot.className = 'carousel_dot';
    dot.setAttribute('aria-label', `Ir para imagem ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  // Botões de navegação
  const prevBtn = document.querySelector('.carousel_btn_prev');
  const nextBtn = document.querySelector('.carousel_btn_next');
  
  if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));

  // Suporte a toque/swipe
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) changeSlide(1);
    if (touchEndX > touchStartX + 50) changeSlide(-1);
  }

  // Scroll horizontal também funciona
  const trackContainer = document.querySelector('.carousel_track_container');
  if (trackContainer) {
    trackContainer.addEventListener('scroll', () => {
      const slideWidth = trackContainer.offsetWidth;
      const newIndex = Math.round(trackContainer.scrollLeft / slideWidth);
      if (newIndex !== currentSlide) {
        currentSlide = newIndex;
        updateDots();
        resetAutoPlay();
      }
    });
  }

  updateCarousel();
  startAutoPlay();
}

function changeSlide(direction) {
  currentSlide += direction;
  if (currentSlide < 0) currentSlide = images.length - 1;
  if (currentSlide >= images.length) currentSlide = 0;
  updateCarousel();
  resetAutoPlay();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
  resetAutoPlay();
}

function updateCarousel() {
  const track = document.querySelector('.carousel_track');
  const trackContainer = document.querySelector('.carousel_track_container');
  
  if (track && trackContainer) {
    const slideWidth = trackContainer.offsetWidth;
    trackContainer.scrollTo({
      left: currentSlide * slideWidth,
      behavior: 'smooth'
    });
  }
  
  updateDots();
}

function updateDots() {
  const dots = document.querySelectorAll('.carousel_dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    changeSlide(1);
  }, 5000); // 5 segundos
}

function resetAutoPlay() {
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

// Pausa o autoplay quando o usuário sai da aba
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(autoPlayInterval);
  } else {
    startAutoPlay();
  }
});

// Iniciar quando o DOM estiver pronto
window.addEventListener('DOMContentLoaded', loadGalleryImages);
