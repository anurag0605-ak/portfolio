// --- Hamburger Menu Toggle ---
const menuToggleBtn = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const menuIcon = menuToggleBtn.querySelector('i');
menuToggleBtn.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  if (navMenu.classList.contains('active')) {
    menuIcon.className = 'fa-solid fa-xmark';
  } else {
    menuIcon.className = 'fa-solid fa-bars';
  }
});
// Close nav menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    menuIcon.className = 'fa-solid fa-bars';
  });
});


// --- Theme (Dark / Light) Mode Toggle ---
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('i');
// Check stored theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);
if (savedTheme === 'light') {
  themeIcon.className = 'fa-solid fa-sun';
} else {
  themeIcon.className = 'fa-solid fa-moon';
}
themeToggleBtn.addEventListener('click', () => {
  const isLight = document.body.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.body.setAttribute('data-theme', 'dark');
    themeIcon.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.setAttribute('data-theme', 'light');
    themeIcon.className = 'fa-solid fa-sun';
    localStorage.setItem('theme', 'light');
  }
});


// --- Portfolio Category Filter ---
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
    if (window.refreshPortfolioCarousel) window.refreshPortfolioCarousel();
  });
});
// --- Typewriter / Role Cycling Effect ---
const typewriterEl = document.getElementById('typewriter-text');
const roles = [
  'UI/UX Designer',
  'Content Creator',
  'Frontend Developer',
  'AI/ML Engineer',
  
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 120;
const deleteSpeed = 55;
const pauseAfterType = 1600;
const pauseAfterDelete = 400;
function typeRole() {
  const currentRole = roles[roleIndex];
  if (isDeleting) {
    typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeRole, pauseAfterDelete);
      return;
    }
    setTimeout(typeRole, deleteSpeed);
  } else {
    typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeRole, pauseAfterType);
      return;
    }
    setTimeout(typeRole, typeSpeed);
  }
}
typeRole();

// --- Skills Dynamic Data & Smooth Animation ---
const skillsData = [
    { name: "HTML & CSS", percentage: 95 },
    { name: "JavaScript", percentage: 80 },
    { name: "Canva", percentage: 85 },
    { name: "Adobe Illustrator", percentage: 60 },
    { name: "Adobe Premiere", percentage: 70 },
    { name: "Adobe Illustrator", percentage: 60 },
    { name: "Adobe ", percentage: 70 }
    
    
    
];

const radius = 42;
const circumference = 2 * Math.PI * radius; // ~263.89

function renderSkills() {
    const skillsContainer = document.getElementById('skills-grid');
    if (!skillsContainer) return;

    skillsContainer.innerHTML = skillsData.map(skill => `
        <div class="skill-card">
            <div class="progress-ring">
                <svg class="progress-svg" viewBox="0 0 100 100">
                    <circle class="progress-bg" cx="50" cy="50" r="${radius}"></circle>
                    <circle 
                        class="progress-bar" 
                        cx="50" 
                        cy="50" 
                        r="${radius}" 
                        style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${circumference};"
                        data-target-offset="${circumference - (skill.percentage / 100) * circumference}"
                    >
                    </circle>
                </svg>
                <span class="skill-percentage" data-target="${skill.percentage}">0%</span>
            </div>
            <h3 class="skill-name">${skill.name}</h3>
        </div>
    `).join('');
}

function animateSkill(card) {
    const progressBar = card.querySelector('.progress-bar');
    const percentText = card.querySelector('.skill-percentage');
    const targetOffset = progressBar.getAttribute('data-target-offset');
    const targetPercentage = parseInt(percentText.getAttribute('data-target'), 10);

    // Animate SVG Circle Gauge
    progressBar.style.strokeDashoffset = targetOffset;

    // Animate Percentage Counter Text
    let currentPercentage = 0;
    const duration = 1000; // 1 second
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const increment = targetPercentage / steps;

    const timer = setInterval(() => {
        currentPercentage += increment;
        if (currentPercentage >= targetPercentage) {
            percentText.textContent = targetPercentage + '%';
            clearInterval(timer);
        } else {
            percentText.textContent = Math.ceil(currentPercentage) + '%';
        }
    }, intervalTime);
}

// Trigger animation when the Skills section scrolls into view
function initSkillsObserver() {
    renderSkills();

    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    let animated = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                const skillCards = skillsSection.querySelectorAll('.skill-card');
                skillCards.forEach(card => animateSkill(card));
                animated = true; // Prevents re-triggering repeatedly
            }
        });
    }, { threshold: 0.3 });

    observer.observe(skillsSection);
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', initSkillsObserver);

// --- Mobile Services Carousel ---
function initServicesCarousel() {
    const carousel = document.querySelector('.services-grid');
    const track = carousel && carousel.querySelector('.services-track');
    const cards = track ? Array.from(track.querySelectorAll('.service-card')) : [];
    const controls = document.querySelector('.services-controls');
    const dotsContainer = document.querySelector('.services-dots');
    if (!carousel || !track || !cards.length || !controls || !dotsContainer) return;

    let currentIndex = 0;
    let autoplayTimer;
    let touchStartX = 0;
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'services-dot';
        dot.setAttribute('aria-label', `Show service ${index + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(index);
            restartAutoplay();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function goToSlide(index) {
        currentIndex = (index + cards.length) % cards.length;
        track.style.transform = mobileQuery.matches
            ? `translateX(-${currentIndex * 100}%)`
            : '';
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === currentIndex);
        });
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    function startAutoplay() {
        stopAutoplay();
        if (mobileQuery.matches && cards.length > 1) {
            autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), 4000);
        }
    }

    function restartAutoplay() {
        startAutoplay();
    }

    controls.querySelector('.services-arrow-prev').addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        restartAutoplay();
    });
    controls.querySelector('.services-arrow-next').addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        restartAutoplay();
    });
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);
    carousel.addEventListener('touchstart', event => {
        touchStartX = event.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });
    carousel.addEventListener('touchend', event => {
        const swipeDistance = event.changedTouches[0].screenX - touchStartX;
        if (Math.abs(swipeDistance) > 40) {
            goToSlide(currentIndex + (swipeDistance < 0 ? 1 : -1));
        }
        startAutoplay();
    }, { passive: true });
    mobileQuery.addEventListener('change', () => {
        goToSlide(currentIndex);
        startAutoplay();
    });

    goToSlide(0);
    startAutoplay();
}

document.addEventListener('DOMContentLoaded', initServicesCarousel);

function initSkillsCarousel() {
    const carousel = document.querySelector('.skills-carousel');
    const track = document.getElementById('skills-grid');
    const cards = track ? Array.from(track.querySelectorAll('.skill-card')) : [];
    const controls = document.querySelector('.skills-controls');
    const dotsContainer = document.querySelector('.skills-dots');
    if (!carousel || !track || !cards.length || !controls || !dotsContainer) return;

    let currentIndex = 0;
    let autoplayTimer;
    let touchStartX = 0;
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'skills-dot';
        dot.setAttribute('aria-label', `Show skill ${index + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(index);
            restartAutoplay();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function goToSlide(index) {
        currentIndex = (index + cards.length) % cards.length;
        track.style.transform = mobileQuery.matches
            ? `translateX(-${currentIndex * 100}%)`
            : '';
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === currentIndex);
        });
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    function startAutoplay() {
        stopAutoplay();
        if (mobileQuery.matches && cards.length > 1) {
            autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), 4000);
        }
    }

    function restartAutoplay() {
        startAutoplay();
    }

    controls.querySelector('.skills-arrow-prev').addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        restartAutoplay();
    });
    controls.querySelector('.skills-arrow-next').addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        restartAutoplay();
    });
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('touchstart', event => {
        touchStartX = event.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });
    carousel.addEventListener('touchend', event => {
        const swipeDistance = event.changedTouches[0].screenX - touchStartX;
        if (Math.abs(swipeDistance) > 40) {
            goToSlide(currentIndex + (swipeDistance < 0 ? 1 : -1));
        }
        startAutoplay();
    }, { passive: true });
    mobileQuery.addEventListener('change', () => {
        goToSlide(currentIndex);
        startAutoplay();
    });

    goToSlide(0);
    startAutoplay();
}

document.addEventListener('DOMContentLoaded', initSkillsCarousel);

function initPortfolioCarousel() {
    const carousel = document.querySelector('.project-grid');
    const track = carousel && carousel.querySelector('.project-track');
    const cards = track ? Array.from(track.querySelectorAll('.project-card')) : [];
    const controls = document.querySelector('.project-controls');
    const dotsContainer = document.querySelector('.project-dots');
    if (!carousel || !track || !cards.length || !controls || !dotsContainer) return;

    let currentIndex = 0;
    let autoplayTimer;
    let touchStartX = 0;
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    function getVisibleCards() {
        return cards.filter(card => card.style.display !== 'none');
    }

    function renderDots() {
        dotsContainer.innerHTML = '';
        getVisibleCards().forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'project-dot';
            dot.setAttribute('aria-label', `Show project ${index + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(index);
                restartAutoplay();
            });
            dotsContainer.appendChild(dot);
        });
    }

    function goToSlide(index) {
        const visibleCards = getVisibleCards();
        currentIndex = visibleCards.length ? (index + visibleCards.length) % visibleCards.length : 0;
        const selectedCard = visibleCards[currentIndex];
        track.style.transform = mobileQuery.matches && selectedCard
            ? `translateX(-${selectedCard.offsetLeft}px)`
            : '';
        Array.from(dotsContainer.children).forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === currentIndex);
        });
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    function startAutoplay() {
        stopAutoplay();
        if (mobileQuery.matches && getVisibleCards().length > 1) {
            autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), 4000);
        }
    }

    function restartAutoplay() {
        startAutoplay();
    }

    controls.querySelector('.project-arrow-prev').addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        restartAutoplay();
    });
    controls.querySelector('.project-arrow-next').addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        restartAutoplay();
    });
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('touchstart', event => {
        touchStartX = event.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });
    carousel.addEventListener('touchend', event => {
        const swipeDistance = event.changedTouches[0].screenX - touchStartX;
        if (Math.abs(swipeDistance) > 40) {
            goToSlide(currentIndex + (swipeDistance < 0 ? 1 : -1));
        }
        startAutoplay();
    }, { passive: true });
    mobileQuery.addEventListener('change', () => {
        goToSlide(currentIndex);
        startAutoplay();
    });

    window.refreshPortfolioCarousel = () => {
        renderDots();
        goToSlide(0);
        startAutoplay();
    };
    window.refreshPortfolioCarousel();
}

document.addEventListener('DOMContentLoaded', initPortfolioCarousel);
