// Audio player state
let isPlaying = false;
let currentChunk = 0;
let audioElements = [];
let lessonData = null;

// Load or generate lesson content
async function loadOrGenerateLesson() {
    const savedLesson = await window.ContentSaver.loadContent();
    if (savedLesson) {
        lessonData = savedLesson;
        console.log('Loaded existing lesson:', lessonData.lesson.title);
        return true;
    }

    console.log('⚙️ Generating lesson content...');
    try {
        const generatedLesson = await window.ContentGenerator.generateCompleteLesson();
        lessonData = generatedLesson;
        console.log('Generated and saved new lesson:', lessonData.lesson.title);
        return true;
    } catch (error) {
        console.error('Failed to generate lesson content:', error);
        return false;
    }
}

// Fallback for static content
function initializeLesson() {
    const contentContainer = document.getElementById('lesson-text');
    if (contentContainer) {
        contentContainer.innerHTML = `
            <div class="chunk-section">
                <h3>خطأ في التحميل</h3>
                <p dir="rtl">فشل في إنشاء محتوى الدرس بسبب مشكلة في الاتصال أو مفتاح API. يرجى المحاولة لاحقاً.</p>
            </div>
        `;
    }
    console.log('Initialized fallback static content');
}

// Initialize lesson with generated content
async function initializeLessonWithGeneratedContent() {
    if (!(await loadOrGenerateLesson())) {
        console.log('Using fallback static content');
        initializeLesson();
        return;
    }

    // Update lesson title and metadata
    const titleElement = document.querySelector('.lesson-info h1');
    if (titleElement) {
        titleElement.textContent = ` ${lessonData.lesson.title}`;
    }

    // Display first chunk
    displayChunk(currentChunk);
    
    // Prepare audio elements
    prepareAudioElements();
    
    // Setup controls
    setupAudioControls();
    
    // Initialize time display
    updateTimeDisplay();
    
    console.log('🎯 Lesson initialized with generated content');
}

// Display a single chunk
function displayChunk(chunkIndex) {
    const contentContainer = document.getElementById('lesson-text');
    if (!contentContainer || !lessonData) return;

    const chunk = lessonData.lesson.chunks[chunkIndex];
    if (!chunk) return;

    let htmlContent = `
        <div class="chunk-section" id="chunk-${chunk.id}" data-chunk="${chunkIndex}" style="animation: fadeIn 0.8s ease;">
            <h3 class="chunk-title">${chunk.title}</h3>
            <div class="chunk-time-info">
                <span class="time-range">${chunk.timeStart} - ${chunk.timeEnd}</span>
                <span class="word-count">${chunk.wordCount} كلمة</span>
            </div>
            <div class="chunk-content" dir="rtl">
                ${chunk.arabicText}
            </div>
            <div class="chunk-summary">
                <small><strong>الملخص:</strong> ${chunk.englishSummary}</small>
            </div>
        </div>
    `;

    // Add SVG diagram for first chunk
    if (chunkIndex === 0 && lessonData.lesson.svg_code) {
        htmlContent += `<div class="svg-diagram">${lessonData.lesson.svg_code}</div>`;
    }

    // Add YouTube recommendations for first chunk
    if (chunkIndex === 0 && lessonData.lesson.youtube_recommendations) {
        const youtubeHTML = lessonData.lesson.youtube_recommendations.map(video => `
            <div class="video-item">
                <span class="video-icon">🎥</span>
                <div class="video-info">
                    <strong>${video.title}</strong>
                    <p>${video.channel} (${video.language})</p>
                </div>
            </div>
        `).join('');
        htmlContent += `<div class="youtube-recommendations">${youtubeHTML}</div>`;
    }

    contentContainer.innerHTML = htmlContent;
}

// Prepare audio elements from generated audio data
function prepareAudioElements() {
    if (!lessonData || !lessonData.audio) return;

    audioElements = [];
    lessonData.audio.forEach((audioFile, index) => {
        try {
            const audioBlob = new Blob([audioFile.audioData], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audioElements.push(audio);
            
            // When audio ends, move to next chunk
            audio.addEventListener('ended', () => {
                console.log(`Audio for chunk ${index + 1} ended`);
                if (currentChunk < audioElements.length - 1) {
                    currentChunk++;
                    displayChunk(currentChunk);
                    if (isPlaying) {
                        playAudio();
                    }
                    highlightCurrentChunk(currentChunk);
                } else {
                    isPlaying = false;
                    updatePlayPauseButton();
                }
            });
        } catch (error) {
            console.error(`Error preparing audio for chunk ${index + 1}:`, error);
        }
    });
}

// Play audio for current chunk
function playAudio() {
    if (currentChunk < audioElements.length) {
        audioElements.forEach(audio => audio.pause());
        audioElements[currentChunk].play();
        isPlaying = true;
        updatePlayPauseButton();
        updateTimeDisplay();
    }
}

// Toggle audio playback
function toggleAudio() {
    if (isPlaying) {
        audioElements[currentChunk].pause();
        isPlaying = false;
    } else {
        playAudio();
    }
    updatePlayPauseButton();
}

// Update play/pause button
function updatePlayPauseButton() {
    const playBtn = document.querySelector('.audio-btn.play-pause');
    if (playBtn) {
        playBtn.innerHTML = isPlaying ? '⏸️' : '▶️';
    }
}

// Highlight current chunk
function highlightCurrentChunk(chunkIndex) {
    displayChunk(chunkIndex);
    updateTimeDisplay();
    const chunkDisplay = document.getElementById('current-chunk-display');
    if (chunkDisplay) {
        chunkDisplay.textContent = chunkIndex + 1;
    }
}

// Navigate to next chunk
function nextChunk() {
    if (currentChunk < audioElements.length - 1) {
        if (audioElements[currentChunk]) {
            audioElements[currentChunk].pause();
        }
        currentChunk++;
        displayChunk(currentChunk);
        if (isPlaying) {
            playAudio();
        }
        highlightCurrentChunk(currentChunk);
    }
}

// Navigate to previous chunk
function previousChunk() {
    if (currentChunk > 0) {
        if (audioElements[currentChunk]) {
            audioElements[currentChunk].pause();
        }
        currentChunk--;
        displayChunk(currentChunk);
        if (isPlaying) {
            playAudio();
        }
        highlightCurrentChunk(currentChunk);
    }
}

// Setup audio controls
function setupAudioControls() {
    const audioControls = document.querySelector('.audio-controls');
    if (audioControls && audioElements.length > 0) {
        const navigationHTML = `
            <button class="audio-btn play-pause" onclick="window.LessonPlayerUpdated.toggleAudio()" title="Play/Pause">▶️</button>
            <button class="audio-btn" onclick="window.LessonPlayerUpdated.previousChunk()" title="Previous Chunk">⏮️</button>
            <button class="audio-btn" onclick="window.LessonPlayerUpdated.nextChunk()" title="Next Chunk">⏭️</button>
            <div class="chunk-indicator">
                <span id="current-chunk-display">1</span>/<span id="total-chunks">${audioElements.length}</span>
            </div>
        `;
        audioControls.innerHTML = navigationHTML;
    }
}

// Update time display
function updateTimeDisplay() {
    const currentDisplay = document.getElementById('current-time');
    const totalDisplay = document.getElementById('total-time');
    const chunkDisplay = document.getElementById('current-chunk-display');
    
    if (currentDisplay && audioElements[currentChunk]) {
        audioElements[currentChunk].ontimeupdate = () => {
            currentDisplay.textContent = formatTime(audioElements[currentChunk].currentTime);
        };
    }
    if (totalDisplay) {
        totalDisplay.textContent = lessonData ? lessonData.lesson.estimatedTime : '10:00';
    }
    if (chunkDisplay) {
        chunkDisplay.textContent = currentChunk + 1;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Navigation functions
function goBackToSelection() {
    window.location.href = 'learning-style.html';
}

function takeQuiz() {
    localStorage.setItem('lesson1Completed', 'true');
    localStorage.setItem('lesson1GeneratedQuiz', 'true');
    const level = localStorage.getItem('selectedLevel');
    const style = localStorage.getItem('selectedLearningStyle');
    window.location.href = `quiz1.html?level=${level}&style=${style}`;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Show loading indicator (you can add a CSS class or element for this)
    console.log('⏳ Loading lesson...');
    await initializeLessonWithGeneratedContent();
    console.log('Lesson ready');
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
        
        switch(event.key) {
            case ' ':
            case 'k':
                event.preventDefault();
                toggleAudio();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                previousChunk();
                break;
            case 'ArrowRight':
                event.preventDefault();
                nextChunk();
                break;
            case 'q':
                event.preventDefault();
                takeQuiz();
                break;
        }
    });
});

// Export functions
window.LessonPlayerUpdated = {
    toggleAudio,
    takeQuiz,
    goBackToSelection,
    nextChunk,
    previousChunk,
    currentChunk: () => currentChunk,
    totalChunks: () => audioElements.length,
    isPlaying: () => isPlaying
};