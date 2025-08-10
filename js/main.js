// Global state management
let selectedLevel = null;
let selectedLearningStyle = null;

// Knowledge Level Selection Functions
function selectLevel(level) {
    // Remove previous selection
    document.querySelectorAll('.level-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    const selectedCard = document.querySelector(`[data-level="${level}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Store selection
    selectedLevel = level;
    localStorage.setItem('selectedLevel', level);
    
    // Enable continue button
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.disabled = false;
        continueBtn.style.opacity = '1';
    }
    
    // Visual feedback
    console.log(`Selected level: ${level}`);
}

// Learning Style Selection Functions
function selectLearningStyle(style) {
    // Remove previous selection
    document.querySelectorAll('.level-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    const selectedCard = document.querySelector(`[data-style="${style}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Store selection
    selectedLearningStyle = style;
    localStorage.setItem('selectedLearningStyle', style);
    
    // Update the selected info display
    const selectedStyleSpan = document.getElementById('selected-style');
    if (selectedStyleSpan) {
        selectedStyleSpan.textContent = capitalizeFirst(style);
    }
    
    // Enable continue button
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.disabled = false;
        continueBtn.style.opacity = '1';
    }
    
    // Visual feedback
    console.log(`Selected learning style: ${style}`);
}

// Navigation Functions
function continueToLearningStyle() {
    if (!selectedLevel) {
        alert('Please select a knowledge level first!');
        return;
    }
    
    // Navigate to learning style page with selected level
    window.location.href = `learning-style.html?level=${selectedLevel}`;
}

function goBack() {
    // Navigate back to knowledge level selection
    window.location.href = 'index.html';
}

function startLearning() {
    if (!selectedLearningStyle) {
        alert('Please select a learning style first!');
        return;
    }
    
    // Get stored values
    const level = localStorage.getItem('selectedLevel');
    const style = localStorage.getItem('selectedLearningStyle');
    
    // Navigate directly to lesson 1
    window.location.href = `lesson1.html?level=${level}&style=${style}`;
}

// Modal Functions
function showInfo() {
    const modal = document.getElementById('info-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Add fade-in animation
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

function closeModal() {
    const modal = document.getElementById('info-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 200);
    }
}

// Utility Functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('-', '/');
}

// Page Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on and initialize accordingly
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '') {
        initializeKnowledgeLevelPage();
    } else if (currentPage === 'learning-style.html') {
        initializeLearningStylePage();
    }
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('info-modal');
        if (event.target === modal) {
            closeModal();
        }
    };
    
    // Handle ESC key for modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});

// Page-specific initialization
function initializeKnowledgeLevelPage() {
    console.log('Initializing Knowledge Level Selection Page');
    
    // Restore previous selection if any
    const savedLevel = localStorage.getItem('selectedLevel');
    if (savedLevel) {
        selectLevel(savedLevel);
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && selectedLevel) {
            continueToLearningStyle();
        }
    });
}

function initializeLearningStylePage() {
    console.log('Initializing Learning Style Selection Page');
    
    // Get and display the selected level
    const urlParams = new URLSearchParams(window.location.search);
    const levelFromURL = urlParams.get('level');
    const savedLevel = levelFromURL || localStorage.getItem('selectedLevel');
    
    if (savedLevel) {
        selectedLevel = savedLevel;
        localStorage.setItem('selectedLevel', savedLevel);
        
        // Update display
        const selectedLevelSpan = document.getElementById('selected-level');
        if (selectedLevelSpan) {
            selectedLevelSpan.textContent = capitalizeFirst(savedLevel);
        }
        
        // Show the info card
        const selectedInfo = document.getElementById('selected-info');
        if (selectedInfo) {
            selectedInfo.style.display = 'block';
        }
    }
    
    // Restore previous learning style selection if any
    const savedStyle = localStorage.getItem('selectedLearningStyle');
    if (savedStyle) {
        selectLearningStyle(savedStyle);
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && selectedLearningStyle) {
            startLearning();
        }
        if (event.key === 'Backspace' || (event.key === 'ArrowLeft' && event.ctrlKey)) {
            goBack();
        }
    });
}

// Demo functionality for testing
function logCurrentState() {
    console.log('Current State:', {
        selectedLevel: selectedLevel || localStorage.getItem('selectedLevel'),
        selectedLearningStyle: selectedLearningStyle || localStorage.getItem('selectedLearningStyle'),
        currentPage: window.location.pathname
    });
}

// Export functions for potential external use
window.AraProf = {
    selectLevel,
    selectLearningStyle,
    continueToLearningStyle,
    startLearning,
    goBack,
    showInfo,
    closeModal,
    logCurrentState
};