# ✅ Checklist de Vérification - Yimmo

## 🔧 Installation & Configuration

### Avant le démarrage
- [ ] Node.js installé (version 14+)
  ```bash
  node --version  # Doit afficher v14.x ou plus
  ```

- [ ] npm installé
  ```bash
  npm --version  # Doit afficher 6.x ou plus
  ```

- [ ] Accédez au bon répertoire
  ```bash
  cd "c:\Users\moham\OneDrive\Bureau\Web Vitrine\yimmo"
  ```

### Installation des dépendances
- [ ] Exécutez `npm install`
- [ ] Pas d'erreurs critiques dans la sortie
- [ ] Dossier `node_modules/` créé
- [ ] Fichier `package-lock.json` créé

### Configuration .env
- [ ] Fichier `.env` créé (basé sur `.env.example`)
- [ ] `PORT=3000` défini
- [ ] `JWT_SECRET` changé (clé complexe)
- [ ] `ADMIN_PASSWORD` changé (mot de passe fort)
- [ ] `ADMIN_EMAIL=Yousri@yimmosarl.com` (ou votre email)

### Base de données
- [ ] Première exécution crée `database.db`
- [ ] Tables créées automatiquement:
  - [ ] `projects`
  - [ ] `admin_users`
  - [ ] `site_settings`
  - [ ] `contacts`
  - [ ] `appointments`
- [ ] Admin créé automatiquement avec vos credentials

---

## 🌐 Lancement du Serveur

### Démarrage
- [ ] Commande: `npm start`
- [ ] Message de démarrage visible
- [ ] Console affiche: "Serveur Yimmo démarré sur http://localhost:3000"
- [ ] Console affiche: "✓ Base de données connectée"
- [ ] Console affiche: "✓ Compte admin créé"

### Pas d'erreurs
- [ ] Aucune erreur en rouge dans la console
- [ ] Port 3000 n'est pas utilisé (vérifiez avec `netstat -ano | findstr :3000`)

---

## 🌍 Site Public - Tests

### Accès
- [ ] http://localhost:3000 charge sans erreur
- [ ] Page 100% chargée en < 2 secondes

### Structure & Contenu
- [ ] Header visible avec logo "Yimmo"
- [ ] Navigation fonctionne (Accueil, À propos, Services, Réalisations, Contact)
- [ ] Section Hero affichée
- [ ] Section À propos visible
- [ ] Section Services avec 3 cartes
- [ ] Section Portfolio (sans projets initialement)
- [ ] Section Rendez-vous visible
- [ ] Section Contact avec formulaire
- [ ] Footer complet avec informations

### Fonctionnalités
- [ ] Menu mobile fonctionne (sur mobile/réduit)
- [ ] Boutons CTA cliquables
- [ ] Scroll fluide vers sections
- [ ] Bouton WhatsApp 💬 en bas à droite
- [ ] Clic sur WhatsApp ouvre la bonne conversation
- [ ] Lien téléphone fonctionne
- [ ] Lien email fonctionne

### Formulaires
**Contact:**
- [ ] Tous les champs présents
- [ ] Validation (requis marqués *)
- [ ] Soumission sans erreur
- [ ] Message de confirmation
- [ ] Message reçu en admin

**Rendez-vous:**
- [ ] Tous les champs présents
- [ ] Date widget fonctionne
- [ ] Heure widget fonctionne
- [ ] Soumission sans erreur
- [ ] Message de confirmation

### Responsive Design
- [ ] **Desktop (1920px)** - Layout correct
- [ ] **Tablette (768px)** - Layout adapté
- [ ] **Mobile (320px)** - Pas de débordement
- [ ] Textes lisibles sur petit écran
- [ ] Boutons cliquables sur mobile
- [ ] Images bien proportionnées partout

### Performance
- [ ] Chargement < 2 secondes
- [ ] Pas de lag lors du scroll
- [ ] Animations fluides (pas de saccades)
- [ ] Console JS sans erreurs (F12)

---

## 🔐 Admin Panel - Tests

### Accès à l'Admin
- [ ] Allez sur le site public
- [ ] Allez en bas (footer visible)
- [ ] Passez la souris sur le footer
- [ ] Petit cadenas 🔐 apparaît en bas à droite
- [ ] Cliquez **3 fois rapidement** sur le cadenas
- [ ] Modal de connexion apparaît
- [ ] Modal a les champs Email et Mot de passe

### Connexion
- [ ] Entrez email: `Yousri@yimmosarl.com`
- [ ] Entrez password: (celui défini dans .env)
- [ ] Cliquez "Connexion"
- [ ] Modal se ferme
- [ ] Redirection vers /admin
- [ ] Page admin charge

### Interface Admin
- [ ] Sidebar visible à gauche
- [ ] Menu items visibles (Dashboard, Projets, Paramètres, Messages, Rendez-vous)
- [ ] Main content à droite
- [ ] Header avec titre et heure actuelle
- [ ] Bouton Déconnexion visible

### Tableau de Bord
- [ ] 4 cartes statistiques visibles
- [ ] Compteurs affichent 0 (initial)
- [ ] Bienvenue message visible

### Gestion des Projets
- [ ] Cliquez sur "🏗️ Projets"
- [ ] Bouton "+ Ajouter un projet" visible
- [ ] Liste vide au démarrage
- [ ] **Ajouter un projet:**
  - [ ] Formulaire s'ouvre
  - [ ] Remplissez titre: "Projet Test"
  - [ ] Remplissez description: "Description test"
  - [ ] Sélectionnez catégorie: "portes"
  - [ ] Laissez images vide
  - [ ] Cliquez "Enregistrer"
  - [ ] Projet apparaît dans la liste
  - [ ] Message de succès affiché

- [ ] **Modifier le projet:**
  - [ ] Cliquez "Modifier" sur le projet
  - [ ] Modal s'ouvre avec les données
  - [ ] Changez le titre
  - [ ] Cliquez "Enregistrer"
  - [ ] Projet mis à jour
  - [ ] Le titre a changé immédiatement

- [ ] **Supprimer le projet:**
  - [ ] Cliquez "Supprimer" sur le projet
  - [ ] Confirmation demandée
  - [ ] Cliquez "OK"
  - [ ] Projet disparu de la liste

- [ ] **Vérifier sur site public:**
  - [ ] Allez sur http://localhost:3000
  - [ ] Allez à "Réalisations"
  - [ ] Portfolio vide
  - [ ] Retournez à l'admin
  - [ ] Ajoutez à nouveau un projet
  - [ ] Vérifiez qu'il apparaît sur le site public
  - [ ] Filtres fonctionnent

### Paramètres du Site
- [ ] Cliquez sur "⚙️ Paramètres"
- [ ] Tous les champs affichés
- [ ] Champs pré-remplis avec valeurs par défaut
- [ ] **Modifier un paramètre:**
  - [ ] Changez une valeur (ex: address)
  - [ ] Cliquez "Enregistrer les paramètres"
  - [ ] Message de succès
  - [ ] Sur site public, allez à "Contact"
  - [ ] La nouvelle adresse est affichée

### Messages de Contact
- [ ] Cliquez sur "💬 Messages"
- [ ] Liste vide initialement
- [ ] **Tester formulaire de contact:**
  - [ ] Allez sur site public → Contact
  - [ ] Remplissez le formulaire
  - [ ] Soumettez
  - [ ] Message de succès
  - [ ] Retournez admin → Messages
  - [ ] Nouveau message visible
  - [ ] Email, nom, message corrects

- [ ] **Actions sur le message:**
  - [ ] Cliquez "Marquer comme lu"
  - [ ] Statut change de "Nouveau" à "Lu"
  - [ ] Cliquez "Copier email"
  - [ ] Email copié au presse-papiers

### Rendez-vous
- [ ] Cliquez sur "📅 Rendez-vous"
- [ ] Liste vide initialement
- [ ] **Tester formulaire rendez-vous:**
  - [ ] Allez sur site public → Rendez-vous
  - [ ] Remplissez le formulaire
  - [ ] Mettez une date future
  - [ ] Soumettez
  - [ ] Message de succès
  - [ ] Retournez admin → Rendez-vous
  - [ ] Nouveau rendez-vous visible
  - [ ] Statut = "En attente"

- [ ] **Actions sur le rendez-vous:**
  - [ ] Cliquez "Confirmer"
  - [ ] Statut change à "Confirmé"
  - [ ] Cliquez "Contacter"
  - [ ] WhatsApp s'ouvre avec le client

### Déconnexion
- [ ] Cliquez "🚪 Déconnexion"
- [ ] Redirigé vers site public
- [ ] Tentez d'accéder /admin directement
- [ ] Redirigé vers site public (token expiré)

---

## 🔒 Sécurité - Tests

### Authentification
- [ ] Essayez /admin sans token → redirection
- [ ] Essayez /api/admin/projects sans token → erreur 401
- [ ] Token JWT fonctionne (visible en localStorage)
- [ ] Logout = token supprimé

### Mot de passe Admin
- [ ] Essayez credentials incorrects → erreur
- [ ] Essayez mot de passe vide → erreur
- [ ] Essayez email invalide → erreur

### CORS
- [ ] API répond aux appels du frontend
- [ ] Pas d'erreurs CORS dans console

---

## 🗄️ Base de Données - Vérification

### Fichier DB
- [ ] Fichier `database.db` créé
- [ ] Taille > 0 bytes
- [ ] Accessible en lecture/écriture

### Tables (via SQLite viewer ou admin)
- [ ] Table `projects` existe et a vos projets
- [ ] Table `admin_users` existe avec admin
- [ ] Table `site_settings` existe avec paramètres
- [ ] Table `contacts` existe avec messages reçus
- [ ] Table `appointments` existe avec rendez-vous

---

## 📱 Tests Complets

### Scenario 1: Nouveau Visiteur
1. [ ] Visite le site (localhost:3000)
2. [ ] Parcourt les sections
3. [ ] Voit les projets (si y'en a)
4. [ ] Soumet un formulaire de contact
5. [ ] Reçoit confirmation

### Scenario 2: Admin Gère le Site
1. [ ] Accède à l'admin (clic triple 🔐)
2. [ ] Se connecte
3. [ ] Ajoute 3 projets (portes, cuisine, chantier)
4. [ ] Modifie les paramètres
5. [ ] Voit les messages entrants
6. [ ] Gère les rendez-vous

### Scenario 3: Visiteur sur Mobile
1. [ ] Ouvre le site sur smartphone/tablette
2. [ ] Site s'affiche correctement
3. [ ] Menu mobile fonctionne
4. [ ] Portfolio filtre bien
5. [ ] Formulaires remplissables
6. [ ] WhatsApp fonctionne

---

## 🚀 Avant Mise en Ligne

- [ ] Changez JWT_SECRET (.env)
- [ ] Changez ADMIN_PASSWORD (.env)
- [ ] Testez tous les formulaires
- [ ] Vérifiez tous les liens WhatsApp
- [ ] Vérifiez adresse/email/téléphone corrects
- [ ] Ajoutez vos vrais projets
- [ ] Optimisez les images
- [ ] Configurez HTTPS
- [ ] Faites une sauvegarde de database.db
- [ ] Testez en condition réelle

---

## 📋 Résultats Finaux

### Site Public ✅
- Tous les tests passent
- Responsive sur tous les appareils
- Formulaires fonctionnels
- Performance bonne
- Pas d'erreurs JS

### Admin Panel ✅
- Connexion sécurisée
- Tous les CRUD fonctionnent
- Changements en temps réel
- Interface intuitive

### Base de Données ✅
- Données persistent
- Pas d'erreurs SQL
- Sauvegardes possibles

### Déploiement ✅
- Prêt à aller en production
- Documentation complète
- Pas de dépendances manquantes

---

## 🎉 Félicitations!

Si tous les tests passent, votre site est:
- ✅ Fonctionnel
- ✅ Sécurisé
- ✅ Prêt à la production
- ✅ Facile à gérer

**Félicitations! 🚀**

---

**Document:** Checklist Vérification Yimmo
**Date:** 2024
