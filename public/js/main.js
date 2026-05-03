// ============================================
// YIMMO - Main JavaScript
// ============================================

const API_URL = '/api';
let currentFilter = 'all';
let allProjects = [];

// ============================================
// Initialisation
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializeHeader();
  loadPortfolio();
  setupFormHandlers();
  checkAdminAccess();
  loadSiteSettings();
  initAvantApres();
});

// ============================================
// Avant / Après — galerie interactive (dynamique)
// ============================================

let AP_ITEMS = []; // chargés depuis l'API

async function initAvantApres() {
  try {
    const res = await fetch(`${API_URL}/portfolio?category=avant-apres`);
    const projects = await res.json();

    // Construire les items depuis les projets
    AP_ITEMS = projects.map(p => {
      const imgs = p.images || [];
      if (imgs.length >= 2) {
        return { type: 'split', imgAvant: imgs[0], imgApres: imgs[1], title: p.title, caption: p.description };
      } else {
        return { type: 'single', img: imgs[0] || '', title: p.title, caption: p.description };
      }
    });

    const section = document.getElementById('avantapres');
    const thumbs  = document.getElementById('apThumbs');
    const main    = document.getElementById('apMain');

    if (AP_ITEMS.length === 0) {
      main.innerHTML = `<div class="ap-empty">Nos transformations arrivent bientôt…</div>`;
      return;
    }

    // Générer les vignettes
    thumbs.innerHTML = '';
    AP_ITEMS.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'ap-thumb' + (index === 0 ? ' active' : '');
      div.dataset.index = index;
      div.onclick = () => apSelect(index);

      if (item.type === 'split') {
        div.innerHTML = `
          <div class="ap-thumb-inner ap-thumb-split">
            <img src="${item.imgAvant}" alt="Avant" loading="lazy">
            <img src="${item.imgApres}" alt="Après" loading="lazy">
          </div>
          <div class="ap-thumb-label">${item.title}</div>`;
      } else {
        div.innerHTML = `
          <div class="ap-thumb-inner">
            <img src="${item.img}" alt="${item.title}" loading="lazy">
          </div>
          <div class="ap-thumb-label">${item.title}</div>`;
      }
      thumbs.appendChild(div);
    });

    // Afficher le premier item
    apSelect(0);
  } catch (err) {
    console.error('Erreur chargement avant/après:', err);
  }
}

function apSelect(index) {
  const item = AP_ITEMS[index];
  if (!item) return;

  const main = document.getElementById('apMain');
  main.style.opacity = '0';
  main.style.transform = 'scale(0.98)';

  setTimeout(() => {
    if (item.type === 'split') {
      main.innerHTML = `
        <div class="ap-main-split">
          <div class="ap-main-side">
            <div class="ap-main-badge avant">Avant</div>
            <img src="${item.imgAvant}" alt="Avant">
          </div>
          <div class="ap-main-divider">&#8594;</div>
          <div class="ap-main-side">
            <div class="ap-main-badge apres">Après</div>
            <img src="${item.imgApres}" alt="Après">
          </div>
        </div>
        <div class="ap-main-caption">
          <h3>${item.title}</h3>
          <p>${item.caption}</p>
        </div>`;
    } else {
      main.innerHTML = `
        <div class="ap-main-single">
          <img src="${item.img}" alt="${item.title}">
          <div class="ap-main-caption">
            <h3>${item.title}</h3>
            <p>${item.caption}</p>
          </div>
        </div>`;
    }

    main.style.opacity = '1';
    main.style.transform = 'scale(1)';
  }, 150);

  // Vignette active
  document.querySelectorAll('.ap-thumb').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
}

// ============================================
// Header & Navigation
// ============================================

function initializeHeader() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Menu mobile toggle
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

  // Fermer le menu au clic sur un lien
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
    });
  });

  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// ============================================
// Portfolio
// ============================================

async function loadPortfolio() {
  try {
    const response = await fetch(`${API_URL}/portfolio`);
    const projects = await response.json();

    displayPortfolioProjects(projects);
    setupFilterButtons(projects);
  } catch (error) {
    console.error('Erreur chargement portfolio:', error);
  }
}

function displayPortfolioProjects(projects = null) {
  if (projects) {
    allProjects = projects;
  }

  const container = document.getElementById('portfolioCarousels');
  container.innerHTML = '';

  // Filtrer les projets selon la sélection
  let filteredProjects = currentFilter === 'all'
    ? allProjects
    : allProjects.filter(p => p.category === currentFilter);

  if (filteredProjects.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999;">Aucun projet disponible pour cette catégorie</p>';
    return;
  }

  // Fonction pour générer le HTML d'une carte projet
  function buildProjectCard(project) {
    const images = project.images || [];
    const firstImg = images[0] || '';
    const imagesJson = JSON.stringify(images).replace(/"/g, '&quot;');
    const count = images.length;
    return `
      <div class="carousel-item">
        <div class="portfolio-item"
             onclick="openLightboxFromEl(this)"
             data-images="${imagesJson}"
             data-title="${project.title.replace(/"/g, '&quot;')}">
          <img src="${firstImg}" alt="${project.title}" class="portfolio-image" loading="lazy">
          ${count > 1 ? `<div class="portfolio-count">${count} photos</div>` : ''}
          <div class="portfolio-overlay">
            <div class="portfolio-info">
              <h3>${project.title}</h3>
              <p>${getCategoryLabel(project.category)}</p>
            </div>
          </div>
          <div class="portfolio-details">
            <h3 style="margin-top: 0;">${project.title}</h3>
            <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">${project.description.substring(0, 100)}...</p>
            <span class="portfolio-tag">${getCategoryLabel(project.category)}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Si filtre "Tous", afficher tous les projets sur une seule ligne
  if (currentFilter === 'all') {
    const carouselHTML = `
      <div class="carousel-section">
        <div class="carousel-header">
          <h3 style="margin: 0;">Tous les Projets</h3>
          <div class="carousel-controls">
            <button class="carousel-btn prev" data-category="all" aria-label="Précédent">&#8592;</button>
            <button class="carousel-btn next" data-category="all" aria-label="Suivant">&#8594;</button>
          </div>
        </div>
        <div class="carousel-container" data-category="all">
          <div class="carousel-track">
            ${filteredProjects.map(p => buildProjectCard(p)).join('')}
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', carouselHTML);
  } else {
    const categories = [...new Set(filteredProjects.map(p => p.category))];
    categories.forEach(category => {
      const categoryProjects = filteredProjects.filter(p => p.category === category);
      const carouselHTML = `
        <div class="carousel-section">
          <div class="carousel-header">
            <h3 style="margin: 0;">${getCategoryLabel(category)}</h3>
            <div class="carousel-controls">
              <button class="carousel-btn prev" data-category="${category}" aria-label="Précédent">&#8592;</button>
              <button class="carousel-btn next" data-category="${category}" aria-label="Suivant">&#8594;</button>
            </div>
          </div>
          <div class="carousel-container" data-category="${category}">
            <div class="carousel-track">
              ${categoryProjects.map(p => buildProjectCard(p)).join('')}
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', carouselHTML);
    });
  }

  // Setup carousel controls
  setupCarouselControls();
}

function getCategoryLabel(category) {
  const labels = {
    'portes': 'Portes EI30',
    'cuisines': 'Cuisines',
    'chantiers': 'Chantiers'
  };
  return labels[category] || category;
}

function setupCarouselControls() {
  const prevButtons = document.querySelectorAll('.carousel-btn.prev');
  const nextButtons = document.querySelectorAll('.carousel-btn.next');

  prevButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      scrollCarousel(category, -1);
    });
  });

  nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      scrollCarousel(category, 1);
    });
  });
}

function scrollCarousel(category, direction) {
  const carousel = document.querySelector(`.carousel-container[data-category="${category}"]`);
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const items = track.querySelectorAll('.carousel-item');
  const itemWidth = items[0]?.offsetWidth + 16; // 16px gap

  if (!itemWidth) return;

  // Calculer le défilement : montrer 3 items, scroller d'un item à la fois
  const scrollAmount = itemWidth * direction;
  const currentScroll = carousel.scrollLeft;

  carousel.scrollTo({
    left: currentScroll + scrollAmount,
    behavior: 'smooth'
  });
}

function setupFilterButtons(projects) {
  const filtersContainer = document.getElementById('portfolioFilters');
  filtersContainer.innerHTML = '';

  // Récupérer toutes les catégories uniques
  const categories = [...new Set(projects.map(p => p.category))];

  // Créer le bouton "Tous"
  const allBtn = document.createElement('button');
  allBtn.className = 'filter-btn active';
  allBtn.setAttribute('data-filter', 'all');
  allBtn.textContent = 'Tous';
  filtersContainer.appendChild(allBtn);

  // Créer un bouton pour chaque catégorie
  categories.forEach(category => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.setAttribute('data-filter', category);
    btn.textContent = getCategoryLabel(category);
    filtersContainer.appendChild(btn);
  });

  // Ajouter les event listeners
  const filterButtons = filtersContainer.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      displayPortfolioProjects();
    });
  });
}

// ============================================
// Forms
// ============================================

function setupFormHandlers() {
  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitForm(contactForm, 'contact');
    });
  }

  // Appointment form
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitForm(appointmentForm, 'appointment');
    });

    // Charger les heures disponibles quand la date change
    const dateInput = document.getElementById('apt-date');
    const timeSelect = document.getElementById('apt-time');

    if (dateInput && timeSelect) {
      dateInput.addEventListener('change', async () => {
        await loadAvailableSlots(dateInput.value, timeSelect);
      });
    }
  }
}

// Charger les heures disponibles pour une date donnée
async function loadAvailableSlots(dateString, selectElement) {
  if (!dateString) {
    selectElement.innerHTML = '<option value="">-- Aucune date sélectionnée --</option>';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/contact/available-slots/${dateString}`);
    const { slots } = await response.json();

    selectElement.innerHTML = '';

    if (slots.length === 0) {
      selectElement.innerHTML = '<option value="">-- Aucun créneau disponible cette date --</option>';
      document.getElementById('apt-slots-info').textContent = 'Aucun créneau disponible à cette date, veuillez en sélectionner une autre';
      return;
    }

    const option = document.createElement('option');
    option.value = '';
    option.text = '-- Sélectionnez une heure --';
    selectElement.appendChild(option);

    slots.forEach(slot => {
      const option = document.createElement('option');
      option.value = slot;
      option.text = slot;
      selectElement.appendChild(option);
    });

    document.getElementById('apt-slots-info').textContent = `${slots.length} créneau(x) disponible(s)`;
  } catch (error) {
    console.error('Erreur chargement créneaux:', error);
    selectElement.innerHTML = '<option value="">-- Erreur lors du chargement --</option>';
  }
}

async function submitForm(form, type) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const endpoint = type === 'contact' ? 'contact/send' : 'contact/appointment';
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      showNotification('Message envoyé avec succès!', 'success');
      form.reset();
    } else {
      showNotification('Erreur: ' + result.error, 'error');
    }
  } catch (error) {
    console.error('Erreur:', error);
    showNotification('Une erreur est survenue', 'error');
  }
}

// ============================================
// Paramètres du site
// ============================================

async function loadSiteSettings() {
  try {
    const response = await fetch(`${API_URL}/settings`);
    const s = await response.json();

    setText('heroLabel',    s.hero_label);
    setText('heroSubtitle', s.hero_subtitle);
    setText('stat1Num',     s.stat1_number);
    setText('stat1Label',   s.stat1_label);
    setText('stat2Num',     s.stat2_number);
    setText('stat2Label',   s.stat2_label);
    setText('stat3Num',     s.stat3_number);
    setText('stat3Label',   s.stat3_label);

    // À propos — chaque ligne devient un <p>
    if (s.about_text) {
      const el = document.getElementById('aboutText');
      if (el) el.innerHTML = s.about_text.split('\n').filter(l => l.trim()).map(l => `<p>${l}</p>`).join('');
    }

    // Contact
    if (s.phone) {
      const el = document.getElementById('contactPhone');
      if (el) { el.textContent = s.phone; el.href = `tel:${s.phone.replace(/\s/g, '')}`; }
    }
    if (s.email) {
      const el = document.getElementById('contactEmail');
      if (el) { el.textContent = s.email; el.href = `mailto:${s.email}`; }
    }
    if (s.whatsapp) {
      const num = s.whatsapp.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${num}?text=Bonjour%20Yimmo%21%20Je%20souhaite%20obtenir%20plus%20d%27informations.`;
      setHref('whatsappBtn',     waUrl);
      setHref('whatsappContact', waUrl);
      setHref('whatsappFooter',  waUrl);
    }
    if (s.instagram) {
      setHref('instagramFooter', s.instagram);
    }
  } catch (error) {
    console.error('Erreur chargement paramètres:', error);
  }
}

function setText(id, val) {
  if (!val) return;
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setHref(id, href) {
  if (!href) return;
  const el = document.getElementById(id);
  if (el) el.href = href;
}

// ============================================
// Admin Access
// ============================================

function checkAdminAccess() {
  const adminLink = document.getElementById('adminAccess');
  const adminModal = document.getElementById('adminModal');

  let clickCount = 0;
  let clickTimer;

  adminLink.addEventListener('click', () => {
    clickCount++;

    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      clickCount = 0;
    }, 2000);

    if (clickCount === 3) {
      clickCount = 0;
      openAdminLogin();
    }
  });

  function openAdminLogin() {
    adminModal.style.display = 'block';
    const adminForm = document.getElementById('adminForm');

    adminForm.innerHTML = `
      <form id="loginForm">
        <div class="form-group">
          <label for="admin-email">Email</label>
          <input type="email" id="admin-email" name="email" required>
        </div>
        <div class="form-group">
          <label for="admin-password">Mot de passe</label>
          <input type="password" id="admin-password" name="password" required>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Connexion</button>
      </form>
    `;

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email').value;
      const password = document.getElementById('admin-password').value;

      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
          localStorage.setItem('adminToken', result.token);
          window.location.href = '/admin';
        } else {
          showNotification('Identifiants invalides', 'error');
        }
      } catch (error) {
        showNotification('Erreur de connexion', 'error');
      }
    });
  }

  // Fermer modal au clic extérieur
  adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) {
      adminModal.style.display = 'none';
    }
  });
}

// ============================================
// Utilitaires
// ============================================

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background-color: ${type === 'success' ? '#4caf50' : '#f44336'};
    color: white;
    border-radius: 4px;
    z-index: 9999;
    font-weight: 600;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Animations CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
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
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ============================================
// Lightbox
// ============================================

let lbImages = [];
let lbIndex  = 0;

function openLightboxFromEl(el) {
  const raw = el.getAttribute('data-images');
  const title = el.getAttribute('data-title') || '';
  if (!raw) return;
  const images = JSON.parse(raw.replace(/&quot;/g, '"'));
  if (!images.length) return;
  openLightbox(images, 0, title);
}

function openLightbox(images, index, title) {
  lbImages = images;
  lbIndex  = index;
  document.getElementById('lightboxTitle').textContent = title || '';
  updateLightboxImage();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function lightboxPrev() {
  if (lbImages.length <= 1) return;
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  updateLightboxImage();
}

function lightboxNext() {
  if (lbImages.length <= 1) return;
  lbIndex = (lbIndex + 1) % lbImages.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const img     = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  const prev    = document.querySelector('.lb-prev');
  const next    = document.querySelector('.lb-next');

  img.src = lbImages[lbIndex];
  counter.textContent = lbImages.length > 1
    ? `${lbIndex + 1} / ${lbImages.length}`
    : '';

  // Masquer les flèches si une seule image
  if (lbImages.length <= 1) {
    prev.classList.add('hidden');
    next.classList.add('hidden');
  } else {
    prev.classList.remove('hidden');
    next.classList.remove('hidden');
  }
}

// Navigation clavier
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  lightboxPrev();
  if (e.key === 'ArrowRight') lightboxNext();
});
