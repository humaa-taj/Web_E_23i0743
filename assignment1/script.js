// Get the last 2 digits of roll number - change this based on your roll number
// For demonstration, using 3 (odd) - change to your actual last 2 digits
const ROLL_LAST_TWO = 3; // Change this to your roll number's last 2 digits
const STEP = ROLL_LAST_TWO % 2 === 0 ? 2 : 3;

// Canvas and image variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('fileInput');
const placeholder = document.getElementById('placeholder');
let originalImage = null;
let currentImage = null;

// Filter state
let filters = {
    brightness: 100,
    saturation: 100,
    inversion: 0,
    grayscale: 0,
    blur: 0,
    rotate: 0,
    sepia: 0,
    flipH: 1,
    flipV: 1,
    rotateAngle: 0
};

// History management
let history = [];
let historyIndex = -1;

// Current active filter for main slider
let activeFilter = 'brightness';

// DOM elements
const filterButtons = document.querySelectorAll('.filter-btn');
const filterSlider = document.getElementById('filterSlider');
const filterName = document.getElementById('filterName');
const filterValue = document.getElementById('filterValue');
const blurSlider = document.getElementById('blurSlider');
const rotateSlider = document.getElementById('rotateSlider');
const sepiaSlider = document.getElementById('sepiaSlider');
const chooseBtn = document.getElementById('chooseBtn');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const historyList = document.getElementById('historyList');

// Initialize
updateFilterSlider();

// Event listeners
chooseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', loadImage);
saveBtn.addEventListener('click', saveImage);
resetBtn.addEventListener('click', resetFilters);
undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);

// Filter button clicks
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        updateFilterSlider();
    });
});

// Main filter slider
filterSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    filters[activeFilter] = value;
    filterValue.textContent = value + '%';
    applyFilters();
    saveToHistory(`${activeFilter}: ${value}%`);
});

// Individual sliders
blurSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    filters.blur = value;
    document.getElementById('blurValue').textContent = value + 'px';
    applyFilters();
    saveToHistory(`Blur: ${value}px`);
});

rotateSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    filters.rotate = value;
    document.getElementById('rotateValue').textContent = value + 'deg';
    applyFilters();
    saveToHistory(`Rotate: ${value}deg`);
});

sepiaSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    filters.sepia = value;
    document.getElementById('sepiaValue').textContent = value + '%';
    applyFilters();
    saveToHistory(`Sepia: ${value}%`);
});

// Rotate and flip buttons
document.getElementById('rotateLeft').addEventListener('click', () => {
    filters.rotateAngle -= 90;
    applyFilters();
    saveToHistory('Rotate Left 90°');
});

document.getElementById('rotateRight').addEventListener('click', () => {
    filters.rotateAngle += 90;
    applyFilters();
    saveToHistory('Rotate Right 90°');
});

document.getElementById('flipHorizontal').addEventListener('click', () => {
    filters.flipH *= -1;
    applyFilters();
    saveToHistory('Flip Horizontal');
});

document.getElementById('flipVertical').addEventListener('click', () => {
    filters.flipV *= -1;
    applyFilters();
    saveToHistory('Flip Vertical');
});

// Load image function
function loadImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.style.display = 'block';
            placeholder.style.display = 'none';
            saveBtn.disabled = false;
            resetBtn.disabled = false;
            
            // Reset filters
            filters = {
                brightness: 100,
                saturation: 100,
                inversion: 0,
                grayscale: 0,
                blur: 0,
                rotate: 0,
                sepia: 0,
                flipH: 1,
                flipV: 1,
                rotateAngle: 0
            };
            
            // Reset sliders
            filterSlider.value = 100;
            blurSlider.value = 0;
            rotateSlider.value = 0;
            sepiaSlider.value = 0;
            updateFilterSlider();
            
            // Initialize history
            history = [];
            historyIndex = -1;
            saveToHistory('Original Image');
            
            applyFilters();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Apply all filters to canvas
function applyFilters() {
    if (!originalImage) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context state
    ctx.save();
    
    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(filters.rotateAngle * Math.PI / 180);
    ctx.rotate(filters.rotate * Math.PI / 180);
    ctx.scale(filters.flipH, filters.flipV);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
    // Apply filter CSS
    let filterString = '';
    filterString += `brightness(${filters.brightness}%) `;
    filterString += `saturate(${filters.saturation}%) `;
    filterString += `invert(${filters.inversion}%) `;
    filterString += `grayscale(${filters.grayscale}%) `;
    filterString += `blur(${filters.blur}px) `;
    filterString += `sepia(${filters.sepia}%)`;
    
    ctx.filter = filterString;
    
    // Draw image
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    
    // Restore context
    ctx.restore();
}

// Update filter slider based on active filter
function updateFilterSlider() {
    filterName.textContent = activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1);
    
    if (activeFilter === 'brightness' || activeFilter === 'saturation') {
        filterSlider.min = 0;
        filterSlider.max = 200;
        filterSlider.value = filters[activeFilter];
        filterValue.textContent = filters[activeFilter] + '%';
    } else if (activeFilter === 'inversion' || activeFilter === 'grayscale') {
        filterSlider.min = 0;
        filterSlider.max = 100;
        filterSlider.value = filters[activeFilter];
        filterValue.textContent = filters[activeFilter] + '%';
    }
    
    // Apply step based on roll number
    filterSlider.step = STEP;
}

// Save image
function saveImage() {
    if (!originalImage) return;
    
    // Create a temporary canvas to save the image properly
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw the current canvas content to temp canvas
    tempCtx.drawImage(canvas, 0, 0);
    
    // Create download link
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
}

// Reset all filters
function resetFilters() {
    filters = {
        brightness: 100,
        saturation: 100,
        inversion: 0,
        grayscale: 0,
        blur: 0,
        rotate: 0,
        sepia: 0,
        flipH: 1,
        flipV: 1,
        rotateAngle: 0
    };
    
    filterSlider.value = 100;
    blurSlider.value = 0;
    rotateSlider.value = 0;
    sepiaSlider.value = 0;
    
    updateFilterSlider();
    document.getElementById('blurValue').textContent = '0px';
    document.getElementById('rotateValue').textContent = '0deg';
    document.getElementById('sepiaValue').textContent = '0%';
    
    applyFilters();
    saveToHistory('Reset Filters');
}

// History management
function saveToHistory(action) {
    // Remove any future states if we're not at the end
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    
    // Save current state
    const state = {
        action: action,
        filters: JSON.parse(JSON.stringify(filters))
    };
    
    history.push(state);
    historyIndex = history.length - 1;
    
    updateHistoryUI();
    updateUndoRedoButtons();
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        restoreState(historyIndex);
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        restoreState(historyIndex);
    }
}

function restoreState(index) {
    const state = history[index];
    filters = JSON.parse(JSON.stringify(state.filters));
    
    // Update all sliders
    filterSlider.value = filters[activeFilter];
    blurSlider.value = filters.blur;
    rotateSlider.value = filters.rotate;
    sepiaSlider.value = filters.sepia;
    
    updateFilterSlider();
    document.getElementById('blurValue').textContent = filters.blur + 'px';
    document.getElementById('rotateValue').textContent = filters.rotate + 'deg';
    document.getElementById('sepiaValue').textContent = filters.sepia + '%';
    
    applyFilters();
    updateHistoryUI();
    updateUndoRedoButtons();
}

function updateHistoryUI() {
    historyList.innerHTML = '';
    
    history.forEach((state, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        if (index === historyIndex) {
            item.classList.add('active');
        }
        item.textContent = `${index + 1}. ${state.action}`;
        item.addEventListener('click', () => {
            historyIndex = index;
            restoreState(index);
        });
        historyList.appendChild(item);
    });
}

function updateUndoRedoButtons() {
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= history.length - 1;
}
