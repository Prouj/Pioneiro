document.addEventListener("DOMContentLoaded", function() {
    const headerPath = "../Components/header.html";
    const footerPath = "../Components/footer.html";
    const carouselDataPath = "../carousel.json";

    // Carregar o header
    fetch(headerPath)
        .then(response => response.text())
        .then(data => {
            document.querySelector("header").innerHTML = data;
            setActiveNavLink();
        });

    // Carregar o footer
    fetch(footerPath)
        .then(response => response.text())
        .then(data => {
            document.querySelector("footer").innerHTML = data;
        });

    // Função para definir o link ativo no menu
    function setActiveNavLink() {
        const links = document.querySelectorAll("nav ul li a");
        const currentPath = window.location.pathname.split('/').pop();
        
        links.forEach(link => {
            if (link.getAttribute("href") === currentPath) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }

            // Adiciona animação de fade ao clicar nos links
            link.addEventListener("click", (e) => {
                e.preventDefault();
                document.querySelector("main").classList.add("fade-out");
                setTimeout(() => {
                    window.location.href = link.getAttribute("href");
                }, 500);
            });
        });

        // Adicionar evento de clique na logo para animação de fade
        const logo = document.querySelector(".logo-title a");
        if (logo) {
            logo.addEventListener("click", (e) => {
                e.preventDefault();
                document.querySelector("main").classList.add("fade-out");
                setTimeout(() => {
                    window.location.href = logo.getAttribute("href");
                }, 500);
            });
        }
    }
       // Carregar dados do carrossel e inicializar o carrossel
    fetch(carouselDataPath)
    .then(response => response.json())
    .then(data => {
        initializeCarousel(data);
    });

function initializeCarousel(data) {
    const carouselContainer = document.getElementById("carousel-container");
    carouselContainer.innerHTML = data.map((item, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${item.imageUrl}" alt="${item.title}">
            <div class="carousel-content">
                <h2>${item.title}</h2>
                <p>${item.description}</p>
            </div>
        </div>
    `).join('');

    const carouselItems = document.querySelectorAll(".carousel-item");
    let currentIndex = 0;

    function showNextImage() {
        carouselItems[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % carouselItems.length;
        carouselItems[currentIndex].classList.add("active");
        carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(showNextImage, 3000);
}
});