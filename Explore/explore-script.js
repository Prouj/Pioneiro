// Script para carregar e renderizar as categorias de exploração
import { setCustom } from '../Components/Scripts/i18n.js';

async function loadExploreData() {
    try {
        const response = await fetch('./explore-data.json');
        const data = await response.json();
        return data.categories;
    } catch (error) {
        console.error('Erro ao carregar dados de exploração:', error);
        return [];
    }
}

function getTranslation(key) {
    return setCustom(key) || key;
}

function createCategorySection(category) {
    const section = document.createElement('section');
    section.className = 'explore_category';
    section.id = category.id;
    
    // Título da categoria
    const title = document.createElement('h2');
    title.className = 'category_title text_title';
    title.textContent = getTranslation(category.titleKey);
    section.appendChild(title);
    
    // Container dos cards com scroll horizontal
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'category_cards';
    
    // Criar cards para cada item
    category.items.forEach(item => {
        // Se o link estiver vazio, criar um div; senão criar um link
        const hasLink = item.link && item.link.trim() !== '';
        const cardWrapper = document.createElement(hasLink ? 'a' : 'div');
        
        if (hasLink) {
            cardWrapper.href = item.link;
            cardWrapper.target = '_blank';
            cardWrapper.rel = 'noopener noreferrer';
            cardWrapper.className = 'card_link';
        } else {
            cardWrapper.className = 'card_link card_no-link';
        }
        
        // Criar card manualmente sem usar o componente web component
        const cardContainer = document.createElement('div');
        cardContainer.className = 'image-card-container';
        
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        img.className = 'image-card-img';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'image-card-text';
        
        const titleH3 = document.createElement('h3');
        titleH3.className = 'image-card-title';
        titleH3.textContent = item.title;
        
        const locationP = document.createElement('p');
        locationP.className = 'image-card-subtitle';
        locationP.textContent = item.location;
        
        textDiv.appendChild(titleH3);
        textDiv.appendChild(locationP);
        
        cardContainer.appendChild(img);
        cardContainer.appendChild(textDiv);
        
        cardWrapper.appendChild(cardContainer);
        cardsContainer.appendChild(cardWrapper);
    });
    
    section.appendChild(cardsContainer);
    return section;
}

async function initializeExplorePage() {
    // Aguardar um pouco mais para garantir que as traduções estão carregadas
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const categories = await loadExploreData();
    const exploreContent = document.querySelector('.explore_content');
    
    if (!exploreContent) {
        console.error('Elemento .explore_content não encontrado');
        return;
    }
    
    // Renderizar cada categoria
    categories.forEach(category => {
        const categorySection = createCategorySection(category);
        exploreContent.appendChild(categorySection);
    });
}

// Aguardar carregamento das traduções antes de inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExplorePage);
} else {
    initializeExplorePage();
}
