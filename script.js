// Loading screen
window.addEventListener('load', function() {
    setTimeout(() => {
        document.getElementById('loading').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 500);
    }, 1000);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = Math.random() * 0.3 + 's';
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all elements that should animate
document.querySelectorAll('.service-card, .comparison-card').forEach(el => {
    observer.observe(el);
});

// Enhanced header background and rainbow border on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Old contact form removed - now using quiz form only

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
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
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
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
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Mobile menu toggle (if needed)
const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
        const nav = document.querySelector('nav');
        const navLinks = document.querySelector('.nav-links');
        
        if (!document.querySelector('.mobile-menu-btn')) {
            const mobileBtn = document.createElement('button');
            mobileBtn.className = 'mobile-menu-btn';
            mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileBtn.style.cssText = 'background: none; border: none; font-size: 1.5rem; color: #333; cursor: pointer;';
            
            nav.appendChild(mobileBtn);
            
            mobileBtn.addEventListener('click', () => {
                navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'white';
                navLinks.style.flexDirection = 'column';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            });
        }
    }
};

window.addEventListener('resize', createMobileMenu);
createMobileMenu();

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
        // Hide the quiz form
        quizForm.style.display = 'none';
        
        // Show not qualified message
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
        } else {
            nextBtn.style.display = 'inline-block';
            finishBtn.style.display = 'none';
        }

        updateProgress();
    }

    nextBtn.addEventListener('click', function() {
        // Check if current question is answered
        if (!isCurrentQuestionAnswered()) {
            showNotification('Veuillez répondre à la question avant de continuer.', 'error');
            return;
        }
        
        // Check for immediate disqualification
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
        // Collect quiz answers
        const formData = new FormData(quizForm);
        const answers = {};
        
        // Process form data
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

        // Check qualification first
        const isQualified = checkQualification(answers);
        
        if (isQualified) {
            // Show qualified form for contact details
            showQualificationResult(true, answers);
            // Store answers for later use when form is submitted
            localStorage.setItem('quizAnswers', JSON.stringify(answers));
        } else {
            // Show not qualified message
            showQualificationResult(false, answers);
        }
    });

    function checkQualification(answers) {
        // Direct disqualification checks - no points system
        
        // Disqualifying answers:
        if (answers.timeline === 'research-only' || answers.timeline === '3-plus-months') {
            return false; // Just researching or too far in future
        }
        
        if (answers.budget === 'ne-sais-pas') {
            return false; // No budget commitment
        }
        
        if (answers.location === 'non') {
            return false; // Can't travel to clinic
        }
        
        // If they selected "autre" budget but didn't specify or gave invalid amount
        if (answers.budget === 'autre') {
            if (!answers.budget_custom || !answers.budget_custom.trim()) {
                return false; // Selected "autre" but didn't specify
            }
            const customBudget = parseInt(answers.budget_custom.replace(/[^\d]/g, ''));
            if (!customBudget || customBudget <= 0) {
                return false; // Invalid custom budget
            }
        }
        
        // If they pass all disqualification checks, they are qualified
        return true;
    }

    function showQualificationResult(isQualified, answers) {
        // Hide the quiz form
        quizForm.style.display = 'none';
        
        if (isQualified) {
            // Show qualified form directly
            document.getElementById('qualifiedForm').style.display = 'block';
            document.getElementById('notQualifiedMessage').style.display = 'none';
            
            // Pre-fill form with quiz summary
            const summaryMessage = createQuizSummary(answers);
            const messageField = document.getElementById('qualifiedMessage');
            if (messageField) {
                messageField.value = summaryMessage;
            }
        } else {
            // Show not qualified message
            document.getElementById('qualifiedForm').style.display = 'none';
            document.getElementById('notQualifiedMessage').style.display = 'block';
        }
    }

    function showCongratulationsPopup(callback) {
        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        // Create popup content
        const popup = document.createElement('div');
        popup.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.4s ease;
            position: relative;
        `;

        popup.innerHTML = `
            <div style="margin-bottom: 30px;">
                <div style="
                    width: 120px;
                    height: 120px;
                    background: #8BC34A;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                    box-shadow: 0 10px 30px rgba(139, 195, 74, 0.3);
                    animation: checkPulse 1s ease-in-out infinite alternate;
                ">
                    <i class="fas fa-check" style="font-size: 4rem; color: white;"></i>
                </div>
            </div>
            <h2 style="color: #8BC34A; margin-bottom: 20px; font-size: 2rem;">Parfait !</h2>
            <p style="color: #1a1a1a; font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px;">
                Votre demande a été envoyée avec succès. Notre équipe vous contactera dans les plus brefs délais pour planifier votre consultation !
            </p>
        `;

        // Add animations to head
        if (!document.querySelector('#popup-animations')) {
            const style = document.createElement('style');
            style.id = 'popup-animations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(50px);
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0);
                    }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes checkPulse {
                    0% { 
                        transform: scale(1);
                        box-shadow: 0 10px 30px rgba(139, 195, 74, 0.3);
                    }
                    100% { 
                        transform: scale(1.05);
                        box-shadow: 0 15px 40px rgba(139, 195, 74, 0.4);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Auto-close popup after 3 seconds
        setTimeout(() => {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(overlay);
                callback(); // Show the form
            }, 300);
        }, 3000);

        // Append to body
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
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

    function showCompletionMessage() {
        const completionHTML = `
            <div class="quiz-completion">
                <div class="completion-icon">✅</div>
                <h3>Merci pour vos réponses !</h3>
                <p>Nous allons maintenant vous rediriger vers le formulaire de contact pour finaliser votre demande de consultation.</p>
                <div class="completion-loader">
                    <div class="loader"></div>
                </div>
            </div>
        `;
        
        quizForm.innerHTML = completionHTML;
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
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(this);
            formData.append('timestamp', new Date().toLocaleString('fr-FR'));
            formData.append('source', 'Quiz qualifié');
            
            // Get quiz answers from localStorage
            const quizAnswers = localStorage.getItem('quizAnswers');
            
            // Submit to Google Sheets
            const sheetsData = new FormData();
            
            // Add selected contact form data (excluding email and age)
            for (let [key, value] of formData.entries()) {
                if (key !== 'email' && key !== 'age') {
                    sheetsData.append(key, value);
                }
            }
            
            // Add selected quiz data from localStorage
            if (quizAnswers) {
                const answers = JSON.parse(quizAnswers);
                
                // Question 1: Improvements (join multiple selections)
                if (answers.improvement) {
                    const improvements = Array.isArray(answers.improvement) ? answers.improvement : [answers.improvement];
                    sheetsData.append('quiz_improvement', improvements.join(', '));
                }
                
                // Question 4: Timeline
                if (answers.timeline) {
                    sheetsData.append('quiz_timeline', answers.timeline);
                }
                
                // Question 5: Budget + custom budget if applicable
                if (answers.budget) {
                    let budgetValue = answers.budget;
                    if (answers.budget === 'autre' && answers.budget_custom) {
                        budgetValue = `autre: ${answers.budget_custom}`;
                    }
                    sheetsData.append('quiz_budget', budgetValue);
                }
            }
            
            // Google Apps Script Web App URL
            const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzCFAAdmC7DVMLDCFwNvnvpJXHpmmtIMnyZmc-K93heXyPEnPNfoD7uQLtBkiah3vcmwQ/exec';
            
            // Add source to identify quiz submissions
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
                // Track successful lead with Facebook Pixel
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'Qualified Quiz Lead',
                        content_category: 'Smile Design',
                        value: 50.00,
                        currency: 'USD'
                    });
                }
                
                // Show congratulations popup after successful submission
                showCongratulationsPopup(() => {
                    // Show success message in the form after popup is closed
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
                });
                
                // Clear quiz answers from localStorage
                localStorage.removeItem('quizAnswers');
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Une erreur est survenue. Veuillez réessayer ou nous appeler au 05 22 25 28 87.', 'error');
                
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }
});

// Contact form pre-fill removed - now using quiz integrated form only

// Testimonials Carousel
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
        // Move the track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
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
    
    // Button event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Dot event listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Auto-play carousel
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
});