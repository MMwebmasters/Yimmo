# 🏗️ Arborescence Complète du Site Yimmo

## 📊 Structure Hiérarchique

```
Yimmo - Menuiserie
│
├── 1. ACCUEIL (/)
│   ├── Hero Section
│   │   ├── Titre: "Menuiserie de Qualité"
│   │   ├── Tagline: "Yimmo le bras droit des propriétaires"
│   │   ├── Description
│   │   └── Boutons CTA (Réalisations, Contact)
│   │
│   └── Navigation Header (Fixed)
│       ├── Logo "Yimmo"
│       ├── Menu (Accueil, À propos, Services, Réalisations, Contact)
│       ├── Menu Mobile (Hamburger)
│       └── Lien Admin Caché 🔐
│
├── 2. À PROPOS (/section-apropos)
│   ├── Titre: "À propos de Yimmo"
│   ├── Texte description (~400 mots)
│   ├── Image sidebar
│   └── Points clés (bullets)
│
├── 3. SERVICES (/section-services)
│   ├── Titre: "Nos Services"
│   ├── Description intro
│   └── 3 Service Cards
│       ├── Card 1: Portes EI30
│       │   ├── Icône: 🚪
│       │   ├── Titre
│       │   └── Description
│       ├── Card 2: Cuisines
│       │   ├── Icône: 🍽️
│       │   ├── Titre
│       │   └── Description
│       └── Card 3: Réalisations Complètes
│           ├── Icône: ✨
│           ├── Titre
│           └── Description
│
├── 4. PORTFOLIO / RÉALISATIONS (/section-portfolio)
│   ├── Titre: "Nos Réalisations"
│   ├── Description intro
│   ├── Filtres (Tous, Portes EI30, Cuisines, Chantiers)
│   └── Galerie de Projets
│       └── [Chaque Projet]
│           ├── Image de couverture
│           ├── Titre
│           ├── Description résumée
│           ├── Catégorie (badge)
│           ├── Date
│           └── Nombre d'images
│
├── 5. RENDEZ-VOUS (/section-appointment)
│   ├── Titre: "Prendre un Rendez-vous"
│   ├── Formulaire
│   │   ├── Nom (requis)
│   │   ├── Email (requis)
│   │   ├── Téléphone (requis)
│   │   ├── Date (requis)
│   │   ├── Heure (optionnel)
│   │   ├── Message (optionnel)
│   │   └── Bouton Submit
│   └── Message de confirmation
│
├── 6. CONTACT (/section-contact)
│   ├── Titre: "Nous Contacter"
│   ├── Colonne Gauche: Infos de Contact
│   │   ├── Adresse avec icon 📍
│   │   ├── Téléphone avec icon 📞 (cliquable)
│   │   ├── Email avec icon ✉️ (cliquable)
│   │   └── WhatsApp avec icon 💬
│   └── Colonne Droite: Formulaire Contact
│       ├── Nom (requis)
│       ├── Email (requis)
│       ├── Téléphone (optionnel)
│       ├── Sujet (optionnel)
│       ├── Message (requis)
│       └── Bouton Submit
│
├── 7. FOOTER
│   ├── Colonne 1: Yimmo
│   │   ├── Description
│   │   └── Icônes réseaux (WhatsApp, Email)
│   ├── Colonne 2: Navigation
│   │   ├── Accueil
│   │   ├── À propos
│   │   ├── Services
│   │   ├── Réalisations
│   │   └── Contact
│   ├── Colonne 3: Services
│   │   ├── Portes EI30
│   │   ├── Cuisines
│   │   └── Nos réalisations
│   ├── Colonne 4: Contact
│   │   ├── Adresse
│   │   ├── Téléphone
│   │   └── Email
│   └── Bottom: Copyright
│
└── Élément Flottant: Bouton WhatsApp 💬
    └── Fixé en bas à droite

```

---

## 🎨 Palette de Couleurs

```
Primary (Noir):           #1a1a1a
Accent (Doré):            #d4af37
Light (Blanc):            #ffffff
Background Light:         #f5f5f5
Text Dark:                #333333
Border:                   #e0e0e0
Success:                  #4caf50
Danger:                   #f44336
```

---

## 📐 Responsive Breakpoints

```
Desktop:    1920px et plus
Tablet:     768px à 1024px
Mobile:     320px à 767px
```

---

## 🔐 ADMIN PANEL (Invisible aux visiteurs)

```
Admin Dashboard (/admin)
│
├── SIDEBAR (Gauche)
│   ├── Header (Logo "Yimmo")
│   └── Navigation
│       ├── 📊 Tableau de bord
│       ├── 🏗️ Projets
│       ├── ⚙️ Paramètres
│       ├── 💬 Messages
│       ├── 📅 Rendez-vous
│       └── 🚪 Déconnexion
│
└── MAIN CONTENT (Droite)
    │
    ├── SECTION 1: Tableau de Bord
    │   ├── 4 Stat Cards
    │   │   ├── Projets (nombre)
    │   │   ├── Messages (nombre)
    │   │   ├── Rendez-vous (nombre)
    │   │   └── Statut site (En ligne)
    │   └── Welcome card
    │
    ├── SECTION 2: Gestion des Projets
    │   ├── Bouton "+ Ajouter un projet"
    │   ├── Liste de projets (grid)
    │   │   └── [Chaque Projet]
    │   │       ├── Image de preview
    │   │       ├── Titre
    │   │       ├── Catégorie
    │   │       ├── Description résumée
    │   │       ├── Nombres d'images
    │   │       ├── Date
    │   │       ├── Bouton Modifier
    │   │       └── Bouton Supprimer
    │   │
    │   └── MODAL: Ajouter/Modifier Projet
    │       ├── Titre du projet
    │       ├── Description (textarea)
    │       ├── Catégorie (select)
    │       ├── Images (URLs séparées par virgules)
    │       ├── Bouton Enregistrer
    │       └── Bouton Annuler
    │
    ├── SECTION 3: Paramètres du Site
    │   ├── Fieldset: Informations Générales
    │   │   ├── Nom de l'entreprise
    │   │   ├── Slogan
    │   │   ├── Adresse
    │   │   ├── Téléphone
    │   │   └── Email
    │   ├── Fieldset: Contenu du Site
    │   │   ├── Texte "À propos" (textarea)
    │   │   ├── Texte "Services" (textarea)
    │   │   └── Autres contenus
    │   └── Bouton "Enregistrer les paramètres"
    │
    ├── SECTION 4: Messages de Contact
    │   ├── Liste des messages
    │   │   └── [Chaque Message]
    │   │       ├── Nom du visiteur
    │   │       ├── Email (avec badge New/Lu)
    │   │       ├── Téléphone
    │   │       ├── Sujet
    │   │       ├── Message complet
    │   │       ├── Date/Heure
    │   │       ├── Bouton "Marquer comme lu"
    │   │       └── Bouton "Copier email"
    │   └── (Vide si aucun message)
    │
    └── SECTION 5: Rendez-vous
        ├── Liste des rendez-vous demandés
        │   └── [Chaque Rendez-vous]
        │       ├── Nom du client
        │       ├── Email
        │       ├── Téléphone
        │       ├── Date préférée (badge Pending/Confirmed)
        │       ├── Heure préférée
        │       ├── Message du projet
        │       ├── Date de demande
        │       ├── Bouton "Confirmer"
        │       └── Bouton "Contacter via WhatsApp"
        └── (Vide si aucun rendez-vous)

```

---

## 🗂️ Fichiers & Dossiers

```
yimmo/
│
├── PUBLIC/                      [Fichiers accessibles au navigateur]
│   ├── index.html              [Site public principal]
│   ├── admin.html              [Panneau admin (sécurisé)]
│   │
│   ├── CSS/
│   │   ├── styles.css          [Styles du site public]
│   │   └── admin.css           [Styles du panneau admin]
│   │
│   └── JS/
│       ├── main.js             [JS du site public]
│       └── admin.js            [JS du panneau admin]
│
├── ROUTES/                      [API endpoints]
│   ├── auth.js                 [Authentification]
│   ├── admin.js                [Gestion admin (projets, settings)]
│   ├── portfolio.js            [Récupération réalisations]
│   ├── contact.js              [Formulaires contact/rendez-vous]
│   └── settings.js             [Paramètres publics du site]
│
├── CONFIG/
│   └── database.js             [Configuration SQLite]
│
├── MIDDLEWARE/
│   └── auth.js                 [Vérification tokens JWT]
│
├── server.js                   [Serveur Express principal]
├── package.json                [Dépendances npm]
├── .env                        [Variables d'environnement]
├── .env.example                [Template .env]
├── .gitignore                  [Fichiers à ignorer]
│
└── DOCUMENTATION/
    ├── README.md                       [Doc complète]
    ├── GUIDE_ADMIN_SIMPLIFIE.md       [Pour utilisateurs non-tech]
    ├── CONTENU_REDACTIONNEL.md        [Tous les textes]
    ├── EXEMPLES_PROJETS.md            [Projets exemple]
    ├── SYNTHESE_COMPLETE.md           [Résumé complet]
    ├── CHECKLIST_VERIFICATION.md      [Tests à faire]
    ├── DEMARRAGE_RAPIDE.txt           [Setup 5 minutes]
    └── ARBORESCENCE_SITE.md           [Ce fichier]

```

---

## 🔄 Flux de Données

### Visite Publique

```
Visiteur arrive sur http://localhost:3000
    ↓
[index.html] charge
    ↓
[main.js] récupère:
    - /api/portfolio → Liste des projets
    - /api/settings → Paramètres du site
    ↓
Affichage du site complet
    ↓
Visiteur peut:
  - Voir les projets
  - Filtrer par catégorie
  - Remplir formulaire contact
  - Remplir formulaire rendez-vous
    ↓
Données sauvegardées en DB
```

### Session Admin

```
Admin: Clic triple sur 🔐
    ↓
[Login Modal] s'ouvre
    ↓
/api/auth/login (email, password)
    ↓
JWT Token généré
    ↓
[admin.html] charge avec token
    ↓
[admin.js] effectue requêtes vers:
    - /api/admin/projects
    - /api/admin/settings
    - /api/admin/contacts
    - /api/admin/appointments
    ↓
Admin peut modifier
    ↓
Requêtes PUT/POST vers API
    ↓
DB mise à jour
    ↓
Site public mis à jour en temps réel
```

---

## 📊 Schéma Base de Données

```
PROJECTS
├── id (PK)
├── title
├── description
├── category (portes/cuisines/chantiers)
├── images (JSON array)
├── date_created
└── updated_at

ADMIN_USERS
├── id (PK)
├── email (UNIQUE)
├── password (hashed)
├── name
└── created_at

SITE_SETTINGS
├── id (PK)
├── key (UNIQUE) [company_name, address, phone, email, about_text, etc.]
├── value
└── updated_at

CONTACTS
├── id (PK)
├── name
├── email
├── phone
├── subject
├── message
├── date_created
└── status (new/read)

APPOINTMENTS
├── id (PK)
├── name
├── email
├── phone
├── preferred_date
├── preferred_time
├── message
├── date_created
└── status (pending/confirmed)
```

---

## 🎯 Points de Personnalisation

### Sans Coder (via Admin)
- ✅ Projets (CRUD complet)
- ✅ Textes (À propos, Services)
- ✅ Paramètres (adresse, téléphone, email)
- ✅ Images des projets

### Facile (HTML/CSS)
- ✅ Logo (remplacer "Yimmo")
- ✅ Couleurs (variables CSS)
- ✅ Fonts (import Google Fonts)
- ✅ Sections du site (ajouter/supprimer)

### Avancé (JavaScript)
- ✅ Nouvelles fonctionnalités
- ✅ Intégrations (Analytics, Email, etc.)
- ✅ Optimisations

---

## ✨ Cas d'Usage

### Scenario 1: Ajouter un Projet
```
Admin:
1. Va dans 🏗️ Projets
2. Clique "+ Ajouter un projet"
3. Remplit le formulaire
4. Clique "Enregistrer"
        ↓
Visiteur:
- Voit immédiatement le projet sur Réalisations
- Peut le filtrer par catégorie
```

### Scenario 2: Gérer un Message
```
Visiteur:
1. Remplit formulaire Contact
2. Soumet

Admin:
1. Reçoit notification
2. Va dans 💬 Messages
3. Lit le message
4. Clique "Copier email"
5. Répond via son client email
        ↓
Visiteur:
- Reçoit une réponse personnalisée
```

### Scenario 3: Confirmer un Rendez-vous
```
Visiteur:
1. Remplit formulaire Rendez-vous
2. Soumet une demande

Admin:
1. Reçoit notification
2. Va dans 📅 Rendez-vous
3. Voit la demande
4. Clique "Contacter"
5. WhatsApp s'ouvre avec le client
6. Discute et confirme
7. Clique "Confirmer" dans admin
        ↓
Visiteur:
- Voit sa demande confirmée (si admin récupère son email)
```

---

## 📱 Responsive Layout

### Desktop (1920px)
- Sidebar 280px fixe
- Main content s'étend
- 3 colonnes pour grilles

### Tablette (768-1024px)
- Sidebar top horizontal
- Main content full width
- 2 colonnes pour grilles
- Menus adaptés

### Mobile (320-767px)
- Sidebar hidden (hamburger)
- Main content full width
- 1 colonne pour grilles
- Texte et boutons agrandis

---

**Version:** 1.0
**Date:** 2024
**Pour:** Yimmo SARL
