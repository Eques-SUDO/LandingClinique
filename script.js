// Loading screen - simplified
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
});

// Notification system - simplified
function showNotification(message, type) {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 20px 25px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        font-weight: 500;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Quiz functionality
document.addEventListener('DOMContentLoaded', function() {
    const quizForm = document.getElementById('dentalQuiz');
    if (!quizForm) return;

    const questions = document.querySelectorAll('.quiz-question');
    const nextBtn = document.querySelector('.quiz-next');
    const prevBtn = document.querySelector('.quiz-prev');
    const finishBtn = document.querySelector('.quiz-finish');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    let currentQuestion = 1;
    const totalQuestions = questions.length;

    function updateProgress() {
        const percentage = (currentQuestion / totalQuestions) * 100;
        progressFill.style.width = percentage + '%';
        progressText.textContent = `Question ${currentQuestion} sur ${totalQuestions}`;
    }

    function isCurrentQuestionAnswered() {
        const currentQuestionDiv = document.querySelector(`[data-question="${currentQuestion}"]`);
        
        // Check for radio buttons
        const radioInputs = currentQuestionDiv.querySelectorAll('input[type="radio"]');
        if (radioInputs.length > 0) {
            return Array.from(radioInputs).some(input => input.checked);
        }
        
        // Check for checkboxes
        const checkboxInputs = currentQuestionDiv.querySelectorAll('input[type="checkbox"]');
        if (checkboxInputs.length > 0) {
            return Array.from(checkboxInputs).some(input => input.checked);
        }
        
        return false;
    }

    function isCurrentQuestionDisqualifying() {
        const currentQuestionDiv = document.querySelector(`[data-question="${currentQuestion}"]`);
        
        // Question 4: Timeline
        if (currentQuestion === 4) {
            const timelineInput = currentQuestionDiv.querySelector('input[name="timeline"]:checked');
            if (timelineInput && (timelineInput.value === 'research-only' || timelineInput.value === '3-plus-months')) {
                return true;
            }
        }
        
        // Question 5: Budget
        if (currentQuestion === 5) {
            const budgetInput = currentQuestionDiv.querySelector('input[name="budget"]:checked');
            if (budgetInput && budgetInput.value === 'ne-sais-pas') {
                return true;
            }
        }
        
        // Question 6: Location
        if (currentQuestion === 6) {
            const locationInput = currentQuestionDiv.querySelector('input[name="location"]:checked');
            if (locationInput && locationInput.value === 'non') {
                return true;
            }
        }
        
        return false;
    }

    function showImmediateDisqualification() {
        quizForm.style.display = 'none';
        document.getElementById('qualifiedForm').style.display = 'none';
        document.getElementById('notQualifiedMessage').style.display = 'block';
    }

    function showQuestion(questionNumber) {
        questions.forEach(q => q.classList.remove('active'));
        const targetQuestion = document.querySelector(`[data-question="${questionNumber}"]`);
        if (targetQuestion) {
            targetQuestion.classList.add('active');
        }

        // Update navigation buttons
        if (questionNumber === 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'inline-block';
        }
        
        if (questionNumber === totalQuestions) {
            nextBtn.style.display = 'none';
            finishBtn.style.display = 'inline-block';
            const callbackInfo = document.querySelector('.callback-info');
            if (callbackInfo) {
                callbackInfo.style.display = 'flex';
            }
        } else {
            nextBtn.style.display = 'inline-block';
            finishBtn.style.display = 'none';
            const callbackInfo = document.querySelector('.callback-info');
            if (callbackInfo) {
                callbackInfo.style.display = 'none';
            }
        }

        updateProgress();
    }

    nextBtn.addEventListener('click', function() {
        if (!isCurrentQuestionAnswered()) {
            showNotification('Veuillez répondre à la question avant de continuer.', 'error');
            return;
        }
        
        if (isCurrentQuestionDisqualifying()) {
            showImmediateDisqualification();
            return;
        }
        
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            showQuestion(currentQuestion);
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentQuestion > 1) {
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    });

    finishBtn.addEventListener('click', function() {
        const formData = new FormData(quizForm);
        const answers = {};
        
        for (let [key, value] of formData.entries()) {
            if (answers[key]) {
                if (Array.isArray(answers[key])) {
                    answers[key].push(value);
                } else {
                    answers[key] = [answers[key], value];
                }
            } else {
                answers[key] = value;
            }
        }

        const isQualified = checkQualification(answers);
        
        if (isQualified) {
            showQualificationResult(true, answers);
            localStorage.setItem('quizAnswers', JSON.stringify(answers));
        } else {
            showQualificationResult(false, answers);
        }
    });

    function checkQualification(answers) {
        if (answers.timeline === 'research-only' || answers.timeline === '3-plus-months') {
            return false;
        }
        
        if (answers.budget === 'ne-sais-pas') {
            return false;
        }
        
        if (answers.location === 'non') {
            return false;
        }
        
        if (answers.budget === 'autre') {
            if (!answers.budget_custom || !answers.budget_custom.trim()) {
                return false;
            }
            const customBudget = parseInt(answers.budget_custom.replace(/[^\d]/g, ''));
            if (!customBudget || customBudget <= 0) {
                return false;
            }
        }
        
        return true;
    }

    function showQualificationResult(isQualified, answers) {
        quizForm.style.display = 'none';
        
        if (isQualified) {
            document.getElementById('qualifiedForm').style.display = 'block';
            document.getElementById('notQualifiedMessage').style.display = 'none';
            
            const summaryMessage = createQuizSummary(answers);
            const messageField = document.getElementById('qualifiedMessage');
            if (messageField) {
                messageField.value = summaryMessage;
            }
        } else {
            document.getElementById('qualifiedForm').style.display = 'none';
            document.getElementById('notQualifiedMessage').style.display = 'block';
        }
    }

    function createQuizSummary(answers) {
        let summary = "Résumé du questionnaire:\n\n";
        
        if (answers.improvement) {
            const improvements = Array.isArray(answers.improvement) ? answers.improvement : [answers.improvement];
            summary += "Améliorations souhaitées: " + improvements.join(', ') + "\n";
        }
        
        if (answers.pain) {
            summary += "Douleur actuelle: " + answers.pain + "\n";
        }
        
        if (answers.impact) {
            summary += "Impact quotidien: " + answers.impact + "/10\n";
        }
        
        if (answers.budget) {
            summary += "Budget: " + answers.budget + "\n";
        }
        
        if (answers.location) {
            summary += "Déplacement à Casablanca: " + answers.location + "\n";
        }
        
        return summary;
    }

    // Initialize quiz
    showQuestion(1);
    
    // Handle qualified form submission
    const qualifiedForm = document.getElementById('qualifiedContactForm');
    if (qualifiedForm) {
        qualifiedForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.qualified-submit');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            const formData = new FormData(this);
            formData.append('timestamp', new Date().toLocaleString('fr-FR'));
            formData.append('source', 'Quiz qualifié');
            
            const quizAnswers = localStorage.getItem('quizAnswers');
            
            const sheetsData = new FormData();
            
            for (let [key, value] of formData.entries()) {
                if (key !== 'email' && key !== 'age') {
                    sheetsData.append(key, value);
                }
            }
            
            if (quizAnswers) {
                const answers = JSON.parse(quizAnswers);
                
                if (answers.improvement) {
                    const improvements = Array.isArray(answers.improvement) ? answers.improvement : [answers.improvement];
                    sheetsData.append('quiz_improvement', improvements.join(', '));
                }
                
                if (answers.timeline) {
                    sheetsData.append('quiz_timeline', answers.timeline);
                }
                
                if (answers.budget) {
                    let budgetValue = answers.budget;
                    if (answers.budget === 'autre' && answers.budget_custom) {
                        budgetValue = `autre: ${answers.budget_custom}`;
                    }
                    sheetsData.append('quiz_budget', budgetValue);
                }
            }
            
            const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzCFAAdmC7DVMLDCFwNvnvpJXHpmmtIMnyZmc-K93heXyPEnPNfoD7uQLtBkiah3vcmwQ/exec';
            
            sheetsData.append('source', 'Quiz qualifié');
            
            fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                body: sheetsData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'Qualified Quiz Lead',
                        content_category: 'Smile Design',
                        value: 50.00,
                        currency: 'USD'
                    });
                }
                
                this.innerHTML = `
                    <div class="form-success">
                        <div class="success-icon">🎉</div>
                        <h3>Demande envoyée avec succès !</h3>
                        <p>Nous vous contacterons très bientôt pour programmer votre consultation.</p>
                        <div class="next-steps">
                            <h4>Prochaines étapes :</h4>
                            <ul>
                                <li>✅ Confirmation par SMS ou appel dans les 24h</li>
                                <li>📅 Programmation de votre consultation</li>
                                <li>🏥 Visite à notre clinique à Casablanca</li>
                            </ul>
                        </div>
                    </div>
                `;
                
                localStorage.removeItem('quizAnswers');
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Une erreur est survenue. Veuillez réessayer ou nous appeler au 05 22 25 28 87.', 'error');
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }
});

// Testimonials Carousel - simplified
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.dot');
    
    if (!track || !slides.length) return;
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.style.background = '#8BC34A';
            } else {
                dot.style.background = 'rgba(255,255,255,0.5)';
            }
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Auto-play carousel
    setInterval(nextSlide, 5000);
});