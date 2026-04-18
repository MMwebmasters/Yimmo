// ============================================
// YIMMO ADMIN — JavaScript
// ============================================

const API_URL = '/api';
let adminToken = localStorage.getItem('adminToken');

// State for response modal
let currentResponseId   = null;
let currentResponseEmail = null;
let currentResponseAction = null;

// State for project edit (kept existing images)
let keptImages = [];

// ============================================
// Initialisation
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  if (!adminToken) {
    window.location.href = '/login';
    return;
  }

  verifyToken();
  initializeSidebar();
  setupLogout();
  setupDashboard();
  setupProjects();
  setupAvantApres();
  setupSettings();
  setupMessages();
  setupAppointments();
  updateTime();
  setInterval(updateTime, 1000);

  // Close responseModal on backdrop click
  document.getElementById('responseModal').addEventListener('click', (e) => {
    if (e.target.id === 'responseModal') closeResponseModal();
  });
});

// ============================================
// Authentification
// ============================================

async function verifyToken() {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!response.ok) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    } else {
      const data = await response.json();
      document.getElementById('userName').textContent = data.user.name || data.user.email;
    }
  } catch (error) {
    console.error('Erreur vérification:', error);
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  }
}

function setupLogout() {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  });
}

// ============================================
// Sidebar Navigation
// ============================================

function initializeSidebar() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.getAttribute('data-section');
      showSection(section);
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function showSection(sectionName) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById(`${sectionName}-section`);
  if (section) {
    section.classList.add('active');
    document.getElementById('sectionTitle').textContent = getSectionTitle(sectionName);
  }
}

function getSectionTitle(sectionName) {
  const titles = {
    dashboard: 'Tableau de bord',
    projects: 'Gestion des Projets',
    avantapres: 'Avant / Après',
    settings: 'Paramètres du Site',
    messages: 'Messages de Contact',
    appointments: 'Rendez-vous'
  };
  return titles[sectionName] || sectionName;
}

function updateTime() {
  const now = new Date();
  const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('currentTime').textContent = time;
}

// ============================================
// Dashboard
// ============================================

async function setupDashboard() {
  await loadDashboardStats();
}

async function loadDashboardStats() {
  try {
    const [projects, contacts, appointments] = await Promise.all([
      fetch(`${API_URL}/admin/projects`, { headers: { 'Authorization': `Bearer ${adminToken}` } }).then(r => r.json()),
      fetch(`${API_URL}/admin/contacts`, { headers: { 'Authorization': `Bearer ${adminToken}` } }).then(r => r.json()),
      fetch(`${API_URL}/admin/appointments`, { headers: { 'Authorization': `Bearer ${adminToken}` } }).then(r => r.json())
    ]);

    document.getElementById('projectCount').textContent = projects.length;
    document.getElementById('messageCount').textContent = contacts.length;
    document.getElementById('appointmentCount').textContent = appointments.length;

    // Nav badges
    const newMessages = contacts.filter(c => c.status === 'new').length;
    const pendingAppts = appointments.filter(a => a.status === 'pending').length;

    const msgBadge = document.getElementById('newMessagesBadge');
    if (newMessages > 0) {
      msgBadge.textContent = newMessages;
      msgBadge.style.display = '';
    } else {
      msgBadge.style.display = 'none';
    }

    const apptBadge = document.getElementById('pendingApptBadge');
    if (pendingAppts > 0) {
      apptBadge.textContent = pendingAppts;
      apptBadge.style.display = '';
    } else {
      apptBadge.style.display = 'none';
    }
  } catch (error) {
    console.error('Erreur chargement stats:', error);
  }
}

// ============================================
// Projects Management
// ============================================

async function setupProjects() {
  document.getElementById('addProjectBtn').addEventListener('click', openProjectModal);
  document.getElementById('projectForm').addEventListener('submit', saveProject);
  document.getElementById('project-images').addEventListener('change', updateImagePreview);

  document.getElementById('projectModal').addEventListener('click', (e) => {
    if (e.target.id === 'projectModal') closeProjectModal();
  });

  await loadProjects();
}

async function loadProjects() {
  try {
    const response = await fetch(`${API_URL}/admin/projects`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const projects = await response.json();

    const list = document.getElementById('projectsList');
    list.innerHTML = '';

    if (projects.length === 0) {
      list.innerHTML = '<p style="text-align:center;color:#999;padding:2rem;">Aucun projet. Cliquez sur "+ Nouveau projet" pour commencer.</p>';
      return;
    }

    projects.forEach(project => {
      const images = project.images ? JSON.parse(project.images) : [];
      const thumb = images.length > 0 ? images[0] : null;
      const desc = project.description || '';
      const shortDesc = desc.length > 100 ? desc.substring(0, 100) + '…' : desc;
      const dateStr = project.date_created ? new Date(project.date_created).toLocaleDateString('fr-FR') : '';

      const thumbHtml = thumb
        ? `<div class="project-thumb"><img src="${thumb}" alt="${project.title}" loading="lazy"></div>`
        : `<div class="project-thumb"><div class="project-thumb-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Aucune photo</span>
           </div></div>`;

      const html = `
        <div class="project-card">
          ${thumbHtml}
          <div class="project-body">
            <h4>${project.title}</h4>
            <span class="project-category">${project.category}</span>
            <p>${shortDesc}</p>
            <p class="project-meta">${images.length} photo${images.length !== 1 ? 's' : ''} &bull; ${dateStr}</p>
          </div>
          <div class="project-footer">
            <button class="btn btn-outline btn-sm" onclick="editProject(${project.id})">Modifier</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id})">Supprimer</button>
          </div>
        </div>
      `;
      list.insertAdjacentHTML('beforeend', html);
    });
  } catch (error) {
    console.error('Erreur chargement projets:', error);
  }
}

function onCategoryChange(val) {
  document.getElementById('apHint').style.display = val === 'avant-apres' ? '' : 'none';
}

function openProjectModal() {
  keptImages = [];
  document.getElementById('projectModalTitle').textContent = 'Ajouter un projet';
  document.getElementById('projectForm').reset();
  document.getElementById('projectForm').removeAttribute('data-id');
  document.getElementById('imagePreview').innerHTML = '';
  document.getElementById('existingImages').style.display = 'none';
  document.getElementById('existingImagesList').innerHTML = '';
  document.getElementById('apHint').style.display = 'none';
  document.getElementById('projectModal').classList.add('active');
}

function closeProjectModal() {
  document.getElementById('projectModal').classList.remove('active');
  document.getElementById('imagePreview').innerHTML = '';
  document.getElementById('existingImages').style.display = 'none';
  document.getElementById('existingImagesList').innerHTML = '';
  keptImages = [];
}

function updateImagePreview() {
  const filesInput = document.getElementById('project-images');
  const previewDiv = document.getElementById('imagePreview');
  previewDiv.innerHTML = '';

  if (!filesInput.files || filesInput.files.length === 0) return;

  Array.from(filesInput.files).forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const item = document.createElement('div');
      item.className = 'preview-item';

      const img = document.createElement('img');
      img.src = e.target.result;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preview-remove';
      btn.innerHTML = '&times;';
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        const dt = new DataTransfer();
        Array.from(filesInput.files).forEach((f, i) => {
          if (i !== index) dt.items.add(f);
        });
        filesInput.files = dt.files;
        updateImagePreview();
      });

      item.appendChild(img);
      item.appendChild(btn);
      previewDiv.appendChild(item);
    };
    reader.readAsDataURL(file);
  });
}

function renderExistingImages(images) {
  keptImages = [...images];
  const list = document.getElementById('existingImagesList');
  const wrapper = document.getElementById('existingImages');

  if (images.length === 0) {
    wrapper.style.display = 'none';
    return;
  }
  wrapper.style.display = '';
  list.innerHTML = '';

  images.forEach((url, index) => {
    const item = document.createElement('div');
    item.className = 'preview-item';
    item.dataset.index = index;

    const img = document.createElement('img');
    // Base64 or URL
    img.src = url;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preview-remove';
    btn.innerHTML = '&times;';
    btn.addEventListener('click', () => {
      keptImages = keptImages.filter(u => u !== url);
      item.remove();
      if (keptImages.length === 0) wrapper.style.display = 'none';
    });

    item.appendChild(img);
    item.appendChild(btn);
    list.appendChild(item);
  });
}

async function saveProject(e) {
  e.preventDefault();

  const id = document.getElementById('projectForm').getAttribute('data-id');
  const title = document.getElementById('project-title').value;
  const description = document.getElementById('project-description').value;
  const category = document.getElementById('project-category').value;
  const filesInput = document.getElementById('project-images');

  // Convert new files to base64
  const newImages = [];
  if (filesInput.files && filesInput.files.length > 0) {
    for (let file of filesInput.files) {
      const reader = new FileReader();
      await new Promise(resolve => {
        reader.onload = (ev) => { newImages.push(ev.target.result); resolve(); };
        reader.readAsDataURL(file);
      });
    }
  }

  // Merge kept existing images with new ones
  const images = [...keptImages, ...newImages];
  const data = { title, description, category, images };

  try {
    const endpoint = id ? `${API_URL}/admin/projects/${id}` : `${API_URL}/admin/projects`;
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      showNotification('Projet enregistré avec succès', 'success');
      closeProjectModal();
      loadProjects();
      loadApItems();
      loadDashboardStats();
    } else {
      showNotification("Erreur lors de l'enregistrement", 'error');
    }
  } catch (error) {
    console.error('Erreur save project:', error);
    showNotification('Erreur serveur', 'error');
  }
}

async function editProject(id) {
  try {
    const response = await fetch(`${API_URL}/portfolio/${id}`);
    const project = await response.json();

    const images = project.images || [];

    document.getElementById('project-title').value = project.title;
    document.getElementById('project-description').value = project.description;
    document.getElementById('project-category').value = project.category;
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('project-images').value = '';
    document.getElementById('apHint').style.display = project.category === 'avant-apres' ? '' : 'none';

    renderExistingImages(images);

    document.getElementById('projectModalTitle').textContent = 'Modifier le projet';
    document.getElementById('projectForm').setAttribute('data-id', id);
    document.getElementById('projectModal').classList.add('active');
  } catch (error) {
    console.error('Erreur chargement projet:', error);
    showNotification('Impossible de charger le projet', 'error');
  }
}

async function deleteProject(id) {
  if (!confirm('Supprimer définitivement ce projet ?')) return;

  try {
    const response = await fetch(`${API_URL}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (response.ok) {
      showNotification('Projet supprimé', 'success');
      loadProjects();
      loadDashboardStats();
    } else {
      showNotification('Erreur lors de la suppression', 'error');
    }
  } catch (error) {
    console.error('Erreur suppression:', error);
  }
}

// ============================================
// Avant / Après
// ============================================

function setupAvantApres() {
  loadApItems();
}

async function loadApItems() {
  try {
    const res = await fetch(`${API_URL}/admin/projects`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const all = await res.json();
    const items = all.filter(p => p.category === 'avant-apres');

    const list = document.getElementById('apList');
    list.innerHTML = '';

    if (items.length === 0) {
      list.innerHTML = '<p style="text-align:center;color:#999;padding:2rem;">Aucune transformation. Cliquez sur "+ Ajouter une transformation" pour commencer.</p>';
      return;
    }

    items.forEach(project => {
      const images = project.images ? JSON.parse(project.images) : [];
      const isSplit = images.length >= 2;
      const thumb = images[0] || null;

      const thumbHtml = thumb
        ? `<div class="project-thumb">${isSplit
            ? `<div style="display:flex;height:100%;"><img src="${images[0]}" style="flex:1;object-fit:cover;height:100%;"><img src="${images[1]}" style="flex:1;object-fit:cover;height:100%;"></div>`
            : `<img src="${images[0]}" alt="${project.title}" loading="lazy">`
          }</div>`
        : `<div class="project-thumb"><div class="project-thumb-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg><span>Aucune photo</span>
           </div></div>`;

      const typeLabel = isSplit ? 'Avant / Après côte à côte' : 'Image unique';

      list.insertAdjacentHTML('beforeend', `
        <div class="project-card">
          ${thumbHtml}
          <div class="project-body">
            <h4>${project.title}</h4>
            <span class="project-category">${typeLabel}</span>
            <p>${(project.description || '').substring(0, 100)}${(project.description || '').length > 100 ? '…' : ''}</p>
            <p class="project-meta">${images.length} photo${images.length !== 1 ? 's' : ''}</p>
          </div>
          <div class="project-footer">
            <button class="btn btn-outline btn-sm" onclick="editProject(${project.id})">Modifier</button>
            <button class="btn btn-danger btn-sm" onclick="deleteApItem(${project.id})">Supprimer</button>
          </div>
        </div>
      `);
    });
  } catch (err) {
    console.error('Erreur chargement avant/après:', err);
  }
}

function openApModal() {
  // Réutilise le modal projet en forçant la catégorie avant-apres
  keptImages = [];
  document.getElementById('projectModalTitle').textContent = 'Ajouter une transformation Avant / Après';
  document.getElementById('projectForm').reset();
  document.getElementById('projectForm').removeAttribute('data-id');
  document.getElementById('projectForm').dataset.fromAp = '1';
  document.getElementById('project-category').value = 'avant-apres';
  document.getElementById('imagePreview').innerHTML = '';
  document.getElementById('existingImages').style.display = 'none';
  document.getElementById('existingImagesList').innerHTML = '';
  document.getElementById('apHint').style.display = '';
  document.getElementById('projectModal').classList.add('active');
}

async function deleteApItem(id) {
  if (!confirm('Supprimer cette transformation ?')) return;
  try {
    const res = await fetch(`${API_URL}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.ok) {
      showNotification('Transformation supprimée', 'success');
      loadApItems();
    }
  } catch (err) {
    console.error('Erreur suppression:', err);
  }
}

// ============================================
// Settings
// ============================================

async function setupSettings() {
  document.getElementById('settingsForm').addEventListener('submit', saveSettings);
  await loadSettings();
}

async function loadSettings() {
  try {
    const response = await fetch(`${API_URL}/admin/settings`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const settings = await response.json();
    Object.keys(settings).forEach(key => {
      const input = document.querySelector(`[data-key="${key}"]`);
      if (input) input.value = settings[key] || '';
    });
  } catch (error) {
    console.error('Erreur chargement settings:', error);
  }
}

async function saveSettings(e) {
  e.preventDefault();
  const settings = document.querySelectorAll('[data-key]');
  const promises = [];

  settings.forEach(setting => {
    promises.push(
      fetch(`${API_URL}/admin/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ key: setting.getAttribute('data-key'), value: setting.value })
      })
    );
  });

  try {
    await Promise.all(promises);
    showNotification('Paramètres sauvegardés avec succès', 'success');
  } catch (error) {
    console.error('Erreur save settings:', error);
    showNotification('Erreur lors de la sauvegarde', 'error');
  }
}

// ============================================
// Messages
// ============================================

async function setupMessages() {
  await loadMessages();
}

async function loadMessages() {
  try {
    const response = await fetch(`${API_URL}/admin/contacts`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const contacts = await response.json();

    const list = document.getElementById('messagesList');
    list.innerHTML = '';

    if (contacts.length === 0) {
      list.innerHTML = '<p style="text-align:center;color:#999;padding:2rem;">Aucun message reçu</p>';
      return;
    }

    contacts.forEach(msg => {
      const isNew = msg.status === 'new';
      const html = `
        <div class="message-card ${isNew ? '' : 'read'}">
          <div class="message-card-header">
            <h4>${escapeHtml(msg.name)}</h4>
            <span class="badge ${isNew ? 'badge-new' : 'badge-read'}">${isNew ? 'Nouveau' : 'Lu'}</span>
          </div>
          <div class="message-meta">
            <div><strong>Email :</strong> <a href="mailto:${escapeHtml(msg.email)}">${escapeHtml(msg.email)}</a></div>
            ${msg.phone ? `<div><strong>Téléphone :</strong> <a href="tel:${escapeHtml(msg.phone)}">${escapeHtml(msg.phone)}</a></div>` : ''}
            ${msg.subject ? `<div><strong>Sujet :</strong> ${escapeHtml(msg.subject)}</div>` : ''}
            <div><strong>Reçu le :</strong> ${new Date(msg.date_created).toLocaleDateString('fr-FR')}</div>
          </div>
          <div class="message-body">${escapeHtml(msg.message)}</div>
          <div class="message-footer">
            ${isNew ? `<button class="btn btn-outline btn-sm" onclick="markAsRead(${msg.id})">Marquer comme lu</button>` : ''}
            <button class="btn btn-ghost btn-sm" onclick="copyEmail('${escapeHtml(msg.email)}')">Copier l'email</button>
            <a class="btn btn-ghost btn-sm" href="mailto:${escapeHtml(msg.email)}">Répondre</a>
          </div>
        </div>
      `;
      list.insertAdjacentHTML('beforeend', html);
    });
  } catch (error) {
    console.error('Erreur chargement messages:', error);
  }
}

async function markAsRead(id) {
  try {
    await fetch(`${API_URL}/admin/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'read' })
    });
    loadMessages();
    loadDashboardStats();
  } catch (error) {
    console.error('Erreur markAsRead:', error);
  }
}

function copyEmail(email) {
  navigator.clipboard.writeText(email);
  showNotification('Email copié dans le presse-papier', 'success');
}

// ============================================
// Appointments
// ============================================

async function setupAppointments() {
  await loadAppointments();
}

async function loadAppointments() {
  try {
    const response = await fetch(`${API_URL}/admin/appointments`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const appointments = await response.json();
    allAppointments = appointments;

    const list = document.getElementById('appointmentsList');
    list.innerHTML = '';

    if (appointments.length === 0) {
      list.innerHTML = '<p style="text-align:center;color:#999;padding:2rem;">Aucune demande de rendez-vous</p>';
      return;
    }

    appointments.forEach(apt => {
      const statusClass = apt.status === 'pending' ? 'pending' : apt.status === 'confirmed' ? 'confirmed' : 'refused';
      const statusLabel = apt.status === 'pending' ? 'En attente' : apt.status === 'confirmed' ? 'Confirmé' : 'Refusé';
      const dateLabel = apt.preferred_date ? new Date(apt.preferred_date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—';

      const waIcon = `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style="vertical-align:middle;margin-right:4px;">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
      </svg>`;

      const nameEsc = escapeAttr(apt.name);
      const emailEsc = escapeAttr(apt.email);
      const phoneEsc = escapeAttr(apt.phone || '');

      const html = `
        <div class="appointment-card ${statusClass}">
          <div class="appointment-card-header">
            <h4>${escapeHtml(apt.name)}</h4>
            <span class="badge badge-${statusClass}">${statusLabel}</span>
          </div>
          <div class="appointment-info-grid">
            <div class="appt-info-item">
              <div class="appt-info-label">Email</div>
              <div class="appt-info-value"><a href="mailto:${escapeHtml(apt.email)}">${escapeHtml(apt.email)}</a></div>
            </div>
            <div class="appt-info-item">
              <div class="appt-info-label">Téléphone</div>
              <div class="appt-info-value"><a href="tel:${escapeHtml(apt.phone || '')}">${escapeHtml(apt.phone || '—')}</a></div>
            </div>
            <div class="appt-info-item">
              <div class="appt-info-label">Date souhaitée</div>
              <div class="appt-info-value">${dateLabel}</div>
            </div>
            <div class="appt-info-item">
              <div class="appt-info-label">Heure souhaitée</div>
              <div class="appt-info-value">${escapeHtml(apt.preferred_time || '—')}</div>
            </div>
          </div>
          ${apt.message ? `<div class="appointment-body">${escapeHtml(apt.message)}</div>` : ''}
          ${apt.response_message ? `
            <div class="appointment-response">
              <div class="appointment-response-label">Votre réponse envoyée</div>
              ${escapeHtml(apt.response_message)}
            </div>` : ''}
          <div class="appointment-footer">
            ${apt.status === 'pending' ? `
              <button class="btn btn-success btn-sm" onclick="openResponseModal(${apt.id}, '${emailEsc}', '${nameEsc}', 'confirm')">Confirmer</button>
              <button class="btn btn-danger btn-sm" onclick="openResponseModal(${apt.id}, '${emailEsc}', '${nameEsc}', 'refuse')">Refuser</button>
            ` : `
              <button class="btn btn-outline btn-sm" onclick="openResponseModal(${apt.id}, '${emailEsc}', '${nameEsc}', 'confirm')">Modifier la réponse</button>
            `}
            ${apt.phone ? `<button class="btn btn-ghost btn-sm" onclick="contactApptWhatsApp('${phoneEsc}')">${waIcon}WhatsApp</button>` : ''}
          </div>
        </div>
      `;
      list.insertAdjacentHTML('beforeend', html);
    });
  } catch (error) {
    console.error('Erreur chargement rendez-vous:', error);
  }
}

// ============================================
// Response Modal (Appointments)
// ============================================

function openResponseModal(id, email, name, action) {
  currentResponseId = id;
  currentResponseEmail = email;
  currentResponseAction = action;

  const title = action === 'confirm' ? `Confirmer le RDV de ${name}` : `Refuser le RDV de ${name}`;
  const subtitle = action === 'confirm'
    ? `Un email de confirmation sera affiché pour : ${email}`
    : `Un email de refus sera affiché pour : ${email}`;

  document.getElementById('responseModalTitle').textContent = title;
  document.getElementById('responseModalSubtitle').textContent = subtitle;
  document.getElementById('responseText').value = '';

  const confirmBtn = document.getElementById('responseConfirmBtn');
  const refuseBtn  = document.getElementById('responseRefuseBtn');

  if (action === 'confirm') {
    confirmBtn.style.display = '';
    refuseBtn.style.display  = 'none';
  } else {
    confirmBtn.style.display = 'none';
    refuseBtn.style.display  = '';
  }

  document.getElementById('responseModal').classList.add('active');
}

function closeResponseModal() {
  document.getElementById('responseModal').classList.remove('active');
  currentResponseId = null;
  currentResponseEmail = null;
  currentResponseAction = null;
}

// (responseModal backdrop click is wired in the main DOMContentLoaded below)

async function sendResponse() {
  const responseText = document.getElementById('responseText').value.trim();

  if (!responseText) {
    showNotification('Veuillez entrer un message', 'error');
    return;
  }

  if (!currentResponseId) return;

  try {
    const newStatus = currentResponseAction === 'confirm' ? 'confirmed' : 'refused';

    await fetch(`${API_URL}/admin/appointments/${currentResponseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: newStatus, response_message: responseText })
    });

    // Build a mailto link to help admin send the email
    const subject = currentResponseAction === 'confirm'
      ? 'Confirmation de votre rendez-vous — Yimmo'
      : 'Votre demande de rendez-vous — Yimmo';
    const body = `Bonjour,\n\n${responseText}\n\nCordialement,\nL'équipe Yimmo`;
    const mailtoLink = `mailto:${currentResponseEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const label = currentResponseAction === 'confirm' ? 'confirmé' : 'refusé';
    showNotification(`Rendez-vous ${label} avec succès`, 'success');

    closeResponseModal();
    loadAppointments();
    loadDashboardStats();

    // Open email client automatically
    window.location.href = mailtoLink;
  } catch (error) {
    console.error('Erreur sendResponse:', error);
    showNotification("Erreur lors de l'envoi", 'error');
  }
}

function contactApptWhatsApp(phone) {
  const message = 'Bonjour, je vous contacte de la part de Yimmo concernant votre demande de rendez-vous.';
  const phoneClean = phone.replace(/[^0-9+]/g, '');
  window.open(`https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`, '_blank');
}

// ============================================
// Notifications
// ============================================

function showNotification(message, type = 'info') {
  const notif = document.createElement('div');
  notif.className = `notif ${type === 'success' ? 'success' : type === 'error' ? 'error' : ''}`;
  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.classList.add('hide');
    setTimeout(() => notif.remove(), 400);
  }, 3500);
}

// ============================================
// Helpers
// ============================================

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ============================================
// Calendar
// ============================================

let allAppointments = [];
let currentCalendarMonth = new Date();
const weekDays   = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

function toggleView(view) {
  const listView     = document.getElementById('listView');
  const calendarView = document.getElementById('calendarView');
  const listBtn      = document.getElementById('viewListBtn');
  const calBtn       = document.getElementById('viewCalendarBtn');

  if (view === 'list') {
    listView.style.display     = 'block';
    calendarView.style.display = 'none';
    listBtn.classList.replace('btn-outline', 'btn-primary');
    calBtn.classList.replace('btn-primary', 'btn-outline');
  } else {
    listView.style.display     = 'none';
    calendarView.style.display = 'block';
    listBtn.classList.replace('btn-primary', 'btn-outline');
    calBtn.classList.replace('btn-outline', 'btn-primary');
    renderCalendar();
  }
}

function previousMonth() {
  currentCalendarMonth = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1);
  renderCalendar();
}

function nextMonth() {
  currentCalendarMonth = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1);
  renderCalendar();
}

function renderCalendar() {
  const year  = currentCalendarMonth.getFullYear();
  const month = currentCalendarMonth.getMonth();

  document.getElementById('calendarTitle').textContent = `${monthNames[month]} ${year}`;

  const firstDay     = new Date(year, month, 1);
  const lastDay      = new Date(year, month + 1, 0);
  const daysInMonth  = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';

  weekDays.forEach(day => {
    const header = document.createElement('div');
    header.className = 'calendar-weekday';
    header.textContent = day;
    grid.appendChild(header);
  });

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevLastDay = new Date(year, month, 0).getDate();
    grid.appendChild(createCalendarDayElement(prevLastDay - i, true));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    grid.appendChild(createCalendarDayElement(day, false, dateStr));
  }

  const totalDays = grid.children.length - 7;
  const remaining = 35 - totalDays;
  for (let day = 1; day <= remaining; day++) {
    grid.appendChild(createCalendarDayElement(day, true));
  }
}

function createCalendarDayElement(day, isOtherMonth, dateStr) {
  const dayEl = document.createElement('div');
  dayEl.className = 'calendar-day' + (isOtherMonth ? ' other-month' : '');

  const num = document.createElement('div');
  num.className = 'calendar-day-number';
  num.textContent = day;
  dayEl.appendChild(num);

  if (!isOtherMonth && dateStr) {
    const dayApts = allAppointments.filter(a => a.preferred_date === dateStr);
    if (dayApts.length > 0) {
      const aptDiv = document.createElement('div');
      aptDiv.className = 'calendar-day-appointments';
      dayApts.slice(0, 3).forEach(apt => {
        const dot = document.createElement('div');
        dot.className = `calendar-day-indicator ${apt.status}`;
        aptDiv.appendChild(dot);
      });
      if (dayApts.length > 3) {
        const more = document.createElement('div');
        more.style.cssText = 'font-size:0.7rem;color:#999;';
        more.textContent = `+${dayApts.length - 3}`;
        aptDiv.appendChild(more);
      }
      dayEl.appendChild(aptDiv);
    }
  }

  return dayEl;
}
