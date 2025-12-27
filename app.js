let appData = [];
let filteredData = [];
let currentItem = null;
let currentLevel = 1;

const card = document.getElementById('card');
const mainImage = document.getElementById('main-image');
const descriptionText = document.getElementById('description-text');
const nextBtn = document.getElementById('next-btn');
const levelBtns = document.querySelectorAll('.level-btn');
const flipToBackBtn = document.getElementById('flip-to-back');
const flipToFrontBtn = document.getElementById('flip-to-front');

// Load data
async function init() {
    try {
        const response = await fetch('datos_app.json');
        if (!response.ok) throw new Error('Network response was not ok');
        appData = await response.json();
        setLevel(1);
    } catch (error) {
        console.error('Error loading data:', error);
        descriptionText.innerHTML = `
            <div style="color: #d32f2f; font-size: 1rem;">
                <p>⚠️ Error al cargar los datos.</p>
                <p style="font-size: 0.8rem; margin-top: 10px;">
                    Si estás abriendo el archivo directamente (file://), el navegador bloquea la carga por seguridad (CORS).<br><br>
                    Para probarlo localmente, necesitas usar un servidor local (ej: Live Server en VS Code o 'npx serve').<br><br>
                    En GitHub Pages funcionará correctamente.
                </p>
            </div>
        `;
        card.classList.add('flipped');
    }
}

function setLevel(level) {
    currentLevel = level;
    
    // Update UI
    levelBtns.forEach(btn => {
        if (parseInt(btn.dataset.level) === level) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Filter data
    filteredData = appData.filter(item => item.nivel === level);
    
    if (filteredData.length > 0) {
        showRandomItem();
    } else {
        // Handle empty level
        mainImage.src = '';
        descriptionText.textContent = 'No hay datos para este nivel todavía.';
        currentItem = null;
    }
}

function showRandomItem() {
    if (filteredData.length === 0) return;
    
    // Reset flip state
    card.classList.remove('flipped');
    
    // For testing: prioritize items with ID 1 and 2 if they are in the filtered list
    let itemToShow;
    const testItems = filteredData.filter(item => item.id === 1 || item.id === 2);
    
    if (testItems.length > 0 && Math.random() > 0.3) { // 70% chance to show test items if available
        itemToShow = testItems[Math.floor(Math.random() * testItems.length)];
    } else {
        const randomIndex = Math.floor(Math.random() * filteredData.length);
        itemToShow = filteredData[randomIndex];
    }
    
    currentItem = itemToShow;
    
    // Update UI
    if (currentItem.imagen_local) {
        mainImage.src = `imagenes_webp/${currentItem.imagen_local}`;
    } else {
        mainImage.src = 'https://via.placeholder.com/1024x1792?text=' + encodeURIComponent(currentItem.descripcion);
    }
    
    descriptionText.textContent = currentItem.descripcion;
}

// Event Listeners
levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setLevel(parseInt(btn.dataset.level));
    });
});

nextBtn.addEventListener('click', () => {
    showRandomItem();
});

flipToBackBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    card.classList.add('flipped');
});

flipToFrontBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    card.classList.remove('flipped');
});

card.addEventListener('click', () => {
    card.classList.toggle('flipped');
});

// Initialize
init();
