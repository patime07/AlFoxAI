// Quiz Handler - Emotional Intelligence & Assessment

// Quiz state
let quizAnswers = {
    q1: null,
    q2: '',
    q3: null
};

let quizResults = {
    score: 0,
    total: 3,
    details: []
};

// Correct answers
const correctAnswers = {
    q1: 'b', // Informed search uses additional information
    q2: {
        keywords: ['مسار', 'طريق', 'أمثل', 'سرعة', 'تكلفة', 'خوارزمية', 'بحث'],
        minWords: 50
    },
    q3: 'true' // A* guarantees optimal path with admissible heuristic
};

// Question 1: Multiple Choice
function selectOption(questionNum, option) {
    // Remove previous selection
    document.querySelectorAll(`#question-${questionNum} .option`).forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked option
    const selectedOption = document.querySelector(`#question-${questionNum} [data-option="${option}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Store answer
    quizAnswers.q1 = option;
    
    // Update status
    updateQuestionStatus(1, true);
    
    console.log(`Question 1 answered: ${option}`);
}

// Question 3: True/False
function selectTF(value) {
    // Remove previous selection
    document.querySelectorAll('.tf-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked option
    const selectedOption = document.querySelector(`[data-value="${value}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Store answer
    quizAnswers.q3 = value;
    
    // Update status
    updateQuestionStatus(3, true);
    
    console.log(`Question 3 answered: ${value}`);
}

// Essay word count and validation
function setupEssayHandlers() {
    const essayTextarea = document.getElementById('essay-answer');
    const wordCountDisplay = document.getElementById('word-count');
    
    if (essayTextarea && wordCountDisplay) {
        essayTextarea.addEventListener('input', function() {
            const text = essayTextarea.value.trim();
            const words = text ? text.split(/\s+/).length : 0;
            
            // Update word count
            wordCountDisplay.textContent = `${words} words`;
            
            // Store answer
            quizAnswers.q2 = text;
            
            // Update visual state
            if (words >= 50) {
                essayTextarea.classList.add('filled');
                updateQuestionStatus(2, true);
            } else {
                essayTextarea.classList.remove('filled');
                updateQuestionStatus(2, false);
            }
        });
    }
}

// Update question completion status
function updateQuestionStatus(questionNum, completed) {
    const statusElement = document.getElementById(`q${questionNum}-status`);
    if (statusElement) {
        if (completed) {
            statusElement.textContent = `Q${questionNum}: Completed ✓`;
            statusElement.classList.add('completed');
        } else {
            statusElement.textContent = `Q${questionNum}: Not answered`;
            statusElement.classList.remove('completed');
        }
    }
    
    // Update question card appearance
    const questionCard = document.getElementById(`question-${questionNum}`);
    if (questionCard) {
        if (completed) {
            questionCard.classList.add('answered');
        } else {
            questionCard.classList.remove('answered');
        }
    }
    
    // Check if all questions are answered
    updateSubmitButton();
    updateScore();
}

// Check if all questions are answered and enable submit
function updateSubmitButton() {
    const q1Answered = quizAnswers.q1 !== null;
    const q2Answered = quizAnswers.q2.trim().split(/\s+/).length >= 50;
    const q3Answered = quizAnswers.q3 !== null;
    
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        if (q1Answered && q2Answered && q3Answered) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Quiz';
        } else {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Complete all questions';
        }
    }
}

// Update live score display
function updateScore() {
    const scoreDisplay = document.getElementById('quiz-score');
    const completedQuestions = [
        quizAnswers.q1 !== null,
        quizAnswers.q2.trim().split(/\s+/).length >= 50,
        quizAnswers.q3 !== null
    ].filter(Boolean).length;
    
    if (scoreDisplay) {
        scoreDisplay.textContent = `Progress: ${completedQuestions}/3`;
    }
}

// Submit quiz and evaluate
function submitQuiz() {
    console.log('Submitting quiz...', quizAnswers);
    
    // Evaluate answers
    evaluateQuiz();
    
    // Show results or emotional support
    if (quizResults.score === 3) {
        showSuccessResults();
    } else {
        showEmotionalSupport();
    }
}

// Evaluate quiz answers
function evaluateQuiz() {
    quizResults.score = 0;
    quizResults.details = [];
    
    // Question 1: Multiple Choice
    const q1Correct = quizAnswers.q1 === correctAnswers.q1;
    if (q1Correct) quizResults.score++;
    
    quizResults.details.push({
        question: 1,
        type: 'Multiple Choice',
        correct: q1Correct,
        userAnswer: quizAnswers.q1,
        correctAnswer: correctAnswers.q1,
        feedback: q1Correct 
            ? 'ممتاز! البحث المدروس يستخدم معلومات إضافية لتوجيه البحث.'
            : 'الإجابة الصحيحة هي (ب). البحث المدروس يستخدم معلومات إضافية مثل الدوال الاستدلالية.'
    });
    
    // Question 2: Essay (simplified evaluation)
    const essayWords = quizAnswers.q2.trim().split(/\s+/).length;
    const hasKeywords = correctAnswers.q2.keywords.some(keyword => 
        quizAnswers.q2.includes(keyword)
    );
    const q2Correct = essayWords >= correctAnswers.q2.minWords && hasKeywords;
    
    if (q2Correct) quizResults.score++;
    
    quizResults.details.push({
        question: 2,
        type: 'Essay',
        correct: q2Correct,
        userAnswer: quizAnswers.q2,
        feedback: q2Correct
            ? 'إجابة جيدة! تظهر فهماً عميقاً لتطبيق خوارزميات البحث في التطبيقات الحقيقية.'
            : 'إجابتك تحتاج لمزيد من التفصيل. فكر في كيفية العثور على أقصر مسار أو أقل تكلفة.'
    });
    
    // Question 3: True/False
    const q3Correct = quizAnswers.q3 === correctAnswers.q3;
    if (q3Correct) quizResults.score++;
    
    quizResults.details.push({
        question: 3,
        type: 'True/False',
        correct: q3Correct,
        userAnswer: quizAnswers.q3,
        correctAnswer: correctAnswers.q3,
        feedback: q3Correct
            ? 'صحيح! خوارزمية A* تضمن الحل الأمثل عندما تكون الدالة الاستدلالية مقبولة.'
            : 'الإجابة الصحيحة هي "صحيح". A* تضمن الحل الأمثل مع دالة استدلالية مقبولة.'
    });
    
    console.log('Quiz evaluation completed:', quizResults);
}

// Show success results (all correct)
function showSuccessResults() {
    const modal = document.getElementById('results-modal');
    const resultsIcon = document.getElementById('results-icon');
    const resultsTitle = document.getElementById('results-title');
    const finalScore = document.getElementById('final-score');
    const resultsBody = document.getElementById('results-body');
    const nextAction = document.getElementById('next-action');
    
    // Set success content
    resultsIcon.textContent = '🎉';
    resultsTitle.textContent = 'ممتاز! Perfect Score!';
    finalScore.textContent = '3/3';
    
    // Generate results content
    resultsBody.innerHTML = `
        <div class="success-message">
            <p><strong>تهانينا!</strong> لقد أجبت على جميع الأسئلة بشكل صحيح!</p>
            <p><strong>Congratulations!</strong> You answered all questions correctly!</p>
        </div>
        ${generateResultDetails()}
    `;
    
    // Set next action
    nextAction.textContent = 'Continue to Lesson 2 →';
    nextAction.onclick = () => proceedToLesson2();
    
    // Show modal
    showModal(modal);
    
    // Store completion
    localStorage.setItem('quiz1Completed', 'true');
    localStorage.setItem('quiz1Score', '3');
}

// Show emotional support (some wrong answers)
function showEmotionalSupport() {
    const modal = document.getElementById('support-modal');
    const supportBody = document.getElementById('support-body');
    
    // Generate emotional support content based on wrong answers
    const wrongQuestions = quizResults.details.filter(detail => !detail.correct);
    const supportContent = generateEmotionalSupport(wrongQuestions);
    
    supportBody.innerHTML = supportContent;
    
    // Show modal
    showModal(modal);
}

// Generate emotional support content (AI-like responses)
function generateEmotionalSupport(wrongQuestions) {
    let content = `
        <div class="support-intro">
            <p>لا بأس، التعلم عملية تدريجية! دعني أساعدك على فهم المفاهيم التي تحتاج لمراجعة.</p>
            <p><em>It's okay, learning is a gradual process! Let me help you understand the concepts you need to review.</em></p>
        </div>
    `;
    
    wrongQuestions.forEach(question => {
        content += `
            <div class="support-item">
                <h4>السؤال ${question.question}:</h4>
                <p>${question.feedback}</p>
                <div class="explanation">
                    ${getDetailedExplanation(question.question)}
                </div>
            </div>
        `;
    });
    
    content += `
        <div class="encouragement">
            <p><strong>نصيحة:</strong> راجع الدرس مرة أخرى وركز على النقاط التي أخطأت فيها. التكرار مفتاح الفهم!</p>
            <p><strong>Tip:</strong> Review the lesson again and focus on the points you missed. Repetition is the key to understanding!</p>
        </div>
    `;
    
    return content;
}

// Detailed explanations for each question
function getDetailedExplanation(questionNum) {
    const explanations = {
        1: `
            <p><strong>تذكر:</strong> الفرق الأساسي بين البحث المدروس وغير المدروس هو استخدام المعلومات الإضافية (heuristics).</p>
            <ul>
                <li><strong>البحث غير المدروس:</strong> مثل DFS و BFS - لا يعرف اتجاه الهدف</li>
                <li><strong>البحث المدروس:</strong> مثل A* - يستخدم دالة استدلالية لتوجيه البحث</li>
            </ul>
        `,
        2: `
            <p><strong>في تطبيقات النقل مثل كريم:</strong></p>
            <ul>
                <li>النظام يبحث عن أقصر مسار أو أقل تكلفة</li>
                <li>يستخدم خوارزميات مثل Dijkstra أو A*</li>
                <li>يأخذ في الاعتبار الزحمة والمسافة والوقت</li>
                <li>الهدف هو تحسين تجربة المستخدم والوصول السريع</li>
            </ul>
        `,
        3: `
            <p><strong>خوارزمية A* والدالة الاستدلالية:</strong></p>
            <ul>
                <li>A* تضمن الحل الأمثل إذا كانت الدالة الاستدلالية "مقبولة"</li>
                <li>الدالة المقبولة: لا تبالغ في تقدير التكلفة للوصول للهدف</li>
                <li>هذا ما يجعل A* مفيدة في التطبيقات الحقيقية</li>
            </ul>
        `
    };
    
    return explanations[questionNum] || '';
}

// Generate detailed results
function generateResultDetails() {
    let content = '<div class="results-details">';
    
    quizResults.details.forEach(detail => {
        const statusClass = detail.correct ? 'correct' : 'incorrect';
        const icon = detail.correct ? '✅' : '❌';
        
        content += `
            <div class="result-item ${statusClass}">
                <div class="result-icon">${icon}</div>
                <div class="result-text">
                    <strong>Question ${detail.question}: ${detail.type}</strong>
                    <p>${detail.feedback}</p>
                </div>
            </div>
        `;
    });
    
    content += '</div>';
    return content;
}

// Modal management
function showModal(modal) {
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function hideModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 200);
}

// Navigation functions
function goBackToLesson() {
    window.location.href = 'lesson1.html';
}

function reviewAnswers() {
    // Close results modal and scroll to questions
    const modal = document.getElementById('results-modal');
    hideModal(modal);
    
    // Highlight correct/incorrect answers
    highlightAnswers();
}

function retakeQuiz() {
    // Reset quiz state
    quizAnswers = { q1: null, q2: '', q3: null };
    quizResults = { score: 0, total: 3, details: [] };
    
    // Reset UI
    resetQuizUI();
    
    // Close modal
    const modal = document.getElementById('support-modal');
    hideModal(modal);
}

function closeSupportModal() {
    const modal = document.getElementById('support-modal');
    hideModal(modal);
}

function proceedNext() {
    // This would navigate to lesson 2 or emotional support
    if (quizResults.score === 3) {
        proceedToLesson2();
    } else {
        showEmotionalSupport();
    }
}

function proceedToLesson2() {
    // Store completion and navigate to lesson 2
    localStorage.setItem('quiz1Passed', 'true');
    
    // For demo purposes, show an alert
    alert('🎉 Congratulations! You\'re ready for Lesson 2!\n\n(Lesson 2 would be implemented next)');
    
    // In a real app, this would navigate to lesson2.html
    // window.location.href = 'lesson2.html';
}

// Highlight answers after review
function highlightAnswers() {
    quizResults.details.forEach(detail => {
        if (detail.question === 1) {
            // Highlight correct/incorrect multiple choice options
            const options = document.querySelectorAll('#question-1 .option');
            options.forEach(option => {
                const optionValue = option.getAttribute('data-option');
                if (optionValue === detail.correctAnswer) {
                    option.classList.add('correct');
                } else if (optionValue === detail.userAnswer && !detail.correct) {
                    option.classList.add('incorrect');
                }
            });
        }
    });
}

// Reset quiz UI
function resetQuizUI() {
    // Clear all selections
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
    });
    
    document.querySelectorAll('.tf-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Clear essay
    const essay = document.getElementById('essay-answer');
    if (essay) {
        essay.value = '';
        essay.classList.remove('filled');
    }
    
    // Reset question cards
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('answered');
    });
    
    // Reset status items
    for (let i = 1; i <= 3; i++) {
        updateQuestionStatus(i, false);
    }
    
    // Reset submit button
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Complete all questions';
    }
}

// Initialize quiz
function initializeQuiz() {
    console.log('Initializing Quiz...');
    
    // Get user selections
    const level = localStorage.getItem('selectedLevel');
    const style = localStorage.getItem('selectedLearningStyle');
    
    console.log(`Quiz initialized for: ${level} level, ${style} style`);
    
    // Setup essay handlers
    setupEssayHandlers();
    
    // Setup keyboard shortcuts
    setupQuizKeyboardShortcuts();
    
    // Check for saved progress
    const savedProgress = localStorage.getItem('quiz1Progress');
    if (savedProgress) {
        // Could restore previous answers here
        console.log('Previous quiz progress found');
    }
}

// Keyboard shortcuts for quiz
function setupQuizKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        if (event.target.tagName === 'TEXTAREA') return;
        
        switch(event.key) {
            case 'Enter':
                if (!document.getElementById('submit-btn').disabled) {
                    submitQuiz();
                }
                break;
            case 'Escape':
                const modals = [
                    document.getElementById('results-modal'),
                    document.getElementById('support-modal')
                ];
                modals.forEach(modal => {
                    if (modal && modal.style.display === 'flex') {
                        hideModal(modal);
                    }
                });
                break;
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
    
    // Close modals when clicking outside
    window.onclick = function(event) {
        const modals = [
            document.getElementById('results-modal'),
            document.getElementById('support-modal')
        ];
        
        modals.forEach(modal => {
            if (event.target === modal) {
                hideModal(modal);
            }
        });
    };
});

// Export functions for external use
window.QuizHandler = {
    selectOption,
    selectTF,
    submitQuiz,
    reviewAnswers,
    retakeQuiz,
    goBackToLesson,
    getCurrentScore: () => quizResults.score,
    getQuizAnswers: () => quizAnswers
};