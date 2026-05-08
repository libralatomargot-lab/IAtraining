# 📋 Plan de Projet — 4 Semaines

## 📅 Semaine 1 — Identité & Fondations

**La base de la cohérence graphique** — c'est le fondement de tous tes supports.

### À faire :

- **Palette de couleurs** (3-4 max)

  - **Couleurs principales**
    - Indigo profond `#0A0E27` — fond principal, sérieux et tech
    - Violet électrique `#7C3AED` — couleur signature, énergie/innovation
    - Cyan néon `#06B6D4` — accents, liens, CTA, effet "data/IA"

  - **Couleurs secondaires**
    - Rose magenta `#EC4899` — touche vivante, rappel "humain/neurosciences"
    - Blanc cassé `#F8FAFC` — texte sur fond sombre, espaces respirants
    - Gris ardoise `#64748B` — texte secondaire

  - Le dégradé violet → cyan sera ton élément signature transversal : hero du site, titres importants du PPT, verso de la carte.

- **Typographies** (2 maximum)

  - **Titres** : `Space Grotesk` ou `Geist` — géométrique, moderne, légèrement futuriste sans tomber dans le cliché "sci-fi"
  - **Corps** : `Inter` — ultra-lisible, neutre, professionnelle
  - **Accent** : `JetBrains Mono` — pour chiffres clés ou citations courtes, donne un côté "code/tech"
  - 💡 Google Fonts est gratuit et suffit

- **Style visuel** — choisis une direction

  - Réseau de points connectés (style constellation) en arrière-plan — évoque réseaux neuronaux + réseaux IA
  - Dégradés fluides violet/cyan sur les zones d'emphase
  - Bordures fines lumineuses (1px violet ou cyan) sur les cadres au survol — effet "néon"
  - Coins légèrement arrondis (8-12px) — moderne sans être trop "soft"
  - Icônes outline fines et géométriques (`Lucide` ou `Phosphor` en version "thin")

- **Mode dominant** - mode sombre
 On peut prévoir un site principalement sombre avec quelques sections claires pour aérer (par exemple la section formations/services).
  - Prévoir un mode clair également !

- **Logo simple**
  - Outils gratuits/abordables : Looka, Hatchful, Canva (~20€)

- **Baseline** (1 phrase clé)
  - Résume ton positionnement
  - Mets en avant ton différenciateur : **neurosciences + IA + agilité**

- **Chiffres clés** (liste complète)
  - Années d'expérience
  - Personnes formées
  - Projets menés
  - Etc.

---

## 🌐 Semaine 2 — Site Web

Construction avec un **outil no-code** (voir recommandations ci-dessous).

- Commencer par la **home**
- Puis décliner les pages secondaires avec un **template unique**

Ce que contient chaque fichier
index.html : la structure sémantique de la page avec toutes les sections (header, hero, chiffres, expertises, CTA, footer). Les icônes sont chargées via la librairie Lucide (gratuite, légère, des centaines d'icônes outline). Tu changes une icône en modifiant data-lucide="brain" par data-lucide="lightbulb" par exemple — la liste complète est sur leur site.
style.css : toute la charte graphique appliquée. En haut, des variables CSS (--violet, --cyan, --gradient, etc.) — c'est ce qui te permet de changer une couleur une seule fois et de la voir se propager partout. Le fichier est commenté section par section pour t'y retrouver facilement.
script.js : 6 animations différentes :

Compteurs animés sur les chiffres clés (de 0 à la cible, ralentit en fin de course)
Fade-in au scroll sur les modules et titres (IntersectionObserver, c'est l'API moderne et performante)
Apparition en cascade des modules (chacun avec un léger décalage)
Parallaxe léger sur le réseau de points en arrière-plan
Menu burger mobile qui s'ouvre/se ferme
Scroll fluide sur les ancres internes (#about, #services, etc.)

Personnalisation rapide
Changer une couleur : ouvre style.css, modifie en haut dans :root. Par exemple, pour adoucir le violet :
css--violet: #8B5CF6; /* au lieu de #7C3AED */
Changer les chiffres clés : dans index.html, modifie l'attribut data-count="150" (le compteur s'ajustera tout seul) et le label en dessous.
Changer une icône de module : remplace data-lucide="brain" par n'importe quelle icône de lucide.dev/icons.
Ajouter un module : copie-colle un bloc <a href="#" class="module" data-color="violet">...</a> dans index.html. Les valeurs possibles pour data-color sont violet, cyan, magenta.
Tips techniques
Pour le développement : utilise VS Code gratuitement avec l'extension Live Server (clic droit sur index.html → "Open with Live Server"). Ça recharge automatiquement le navigateur à chaque modification, gain de temps énorme.
Pour vérifier sur mobile : dans Chrome, F12 → icône téléphone en haut à gauche. Tu peux simuler n'importe quel appareil. Le site est déjà responsive, mais teste quand même.
Pour optimiser avant mise en ligne :

Compresse les images que tu ajouteras (photo de toi, logos clients) sur tinypng.com
Convertis-les en .webp quand c'est possible (poids divisé par 3-4)
Ajoute loading="lazy" sur tes balises <img> pour qu'elles ne se chargent qu'au scroll

Pour le SEO : modifie dans index.html le <title> et la <meta name="description"> avec ton vrai nom et ton positionnement. C'est ce qui apparaîtra sur Google.
Pour le formulaire de contact (étape suivante) : le bouton "Réserver un créneau" pointe pour l'instant vers mailto:. Plus tard, tu pourras le remplacer par un lien Calendly (https://calendly.com/ton-pseudo/30min) ou intégrer un vrai formulaire avec Formspree (gratuit jusqu'à 50 messages/mois).

---

## 📊 Semaine 3 — PowerPoint & Cartes de Visite

Une fois le site avancé, **réutiliser** les mêmes couleurs/polices/éléments partout.

### PowerPoint
- Créer un **template maître** (Slide Masters)
- Définir couleurs et polices une fois pour toutes
- Toutes les slides hériteront automatiquement

### Cartes de visite
- Prestataires : MOO, Vistaprint, Helloprint
- Budget : 30-60€ pour 100-250 cartes en bonne qualité

---

## ✨ Semaine 4 — Polish, Contenu, Mise en Ligne

- Relectures complètes
- **SEO de base** (titres, meta-descriptions, alt sur images)
- Tests mobiles
- Formulaire de contact
- **Nom de domaine** (10-15€/an chez OVH ou Gandi)

### 💡 Astuce gestion de projet
Crée un **Trello/Notion gratuit** avec 4 colonnes pour éviter de te disperser sur une deadline serrée.

---

---

# 🎯 Plan du Site Web — Améliorations & Tips

## 🏠 Améliorations sur la Home

### En-tête (Hero)
- ✅ **Photo professionnelle** de toi (humanise + énorme facteur de conversion)
- ✅ **CTA principal** visible immédiatement ("Prendre contact" ou "Discutons de votre projet")
- ✅ **Baseline ultra claire** en 1 phrase : qui tu aides, à quoi, comment

### Chiffres Clés
- 3-4 chiffres **max** (au-delà, ça dilue)
- **Idées** :
  - Années d'expérience
  - Personnes formées
  - Entreprises accompagnées
  - Projets agentiques livrés
- 💡 Ajouter un effet **"compteur qui monte"** au scroll (très visuel, tous les no-code le proposent)

### Architecture des Modules

**Problème** : 6 modules noient l'offre principale.

**Solution** : Regrouper par nature

| Bloc | Contenu |
|------|---------|
| **À propos** | CV/parcours (1 seul module) |
| **Mes services** 🎯 | Formations, Ateliers, Accompagnement entreprise — **orientés bénéfice client** |
| **Mes expertises** | GenIA & Agentique / Neurosciences / Agilité — **orientés thématiques** |

Cette **double entrée** couvre tous tes visiteurs :
- Ceux qui savent ce qu'ils cherchent (formation, atelier...)
- Ceux qui cherchent une compétence (IA agentique, changement...)

### Ajouts Bonus pour la Home

- **Section "Pour qui ?"** — RH, IT, dirigeants, formateurs... aide le visiteur à se projeter
- **Logos/témoignages clients** (si dispo) — preuve sociale = facteur n°1 de confiance B2B
- **Section "Mon approche"** — valorise ton ADN unique, c'est ta signature !
- **Footer enrichi** :
  - Mentions légales ⚖️ (obligatoire en France)
  - Politique de confidentialité 🔒 (RGPD)
  - Lien Calendly pour réserver directement

---

## 🛠️ Recommandations No-Code

### 🌟 Option Recommandée — **Framer**
- **Prix** : Gratuit pour démarrer, ~5-15€/mois avec domaine custom
- **Avantages** :
  - Très moderne (parfait pour l'image "IA/tech haut de gamme")
  - Animations au survol natives et faciles
  - Templates pros gratuits disponibles
  - Apprentissage rapide (2-3 jours pour débuter)

### 🔧 Alternative — **Webflow**
- **Prix** : Gratuit pour débuter, ~15€/mois avec domaine custom
- **Avantages** : Plus puissant
- **Inconvénient** : Courbe d'apprentissage plus raide

### 📱 Plus Simple — **Wix Studio** ou **Squarespace**
- **Avantages** : Mise en route facile (quelques heures), templates nombreux
- **Inconvénient** : Design moins distinctif

### ❌ À Éviter
- **WordPress** — trop technique à maintenir en solo
- **Builders ultra-basiques** (Jimdo, etc.) — design daté pour activité IA

---

## 💻 Tips Techniques Concrets

### 📲 Mobile-First
- 60-70% des visiteurs utilisent mobile
- Vérifie **systématiquement** le rendu mobile avant de valider

### ⚡ Performance
- Compresse les images avec **TinyPNG** avant upload
- Utilise **WebP** si possible
- ⚠️ Site lent = visiteurs perdus

### 🔍 SEO de Base
Sur chaque page, remplis :
- **Titre** (~60 caractères)
- **Meta-description** (~150 caractères)
- Inclure mots-clés : "consultante IA", "formation GenIA", "agents IA entreprise"

### 📝 Formulaire de Contact
- Utilise **Formspree** ou **Tally** (plans gratuits)
- ✅ Évite le formulaire natif de l'outil (garde tes leads même si tu changes de plateforme)

### 📊 Tracking
- **Plausible** — RGPD-friendly, payant mais simple
- **Google Analytics 4** — gratuit
- À installer dès le lancement

### 📅 Réservation d'Appels
- Intègre un widget **Calendly** (gratuit) dans ton bouton contact
- ⬆️ Augmente énormément le taux de prise de RDV

---

## 🎨 Cohérence Graphique Entre les 3 Supports

**Le secret** : figer 5 éléments et les répliquer partout.

### Les 5 Éléments à Standardiser

1. **Palette exacte** — codes hex/CMJN (note-les dans un fichier "charte")
2. **Typographies** — titre + corps (identiques sur les 3 supports)
3. **Style des icônes/illustrations** — toujours le même set (ex: Lucide gratuit ou Phosphor Icons)
4. **Élément graphique signature** — forme géométrique, dégradé, motif (qu'on retrouve partout)
5. **Logo** — 2-3 versions (couleur, blanc, noir)

### Créer Carte & PPT
Utilise **Canva** (gratuit, ou Pro à 12€/mois pour un mois suffira)
- Réutilise **exactement** les mêmes éléments que ton site
- Respecte la charte = cohérence maximale