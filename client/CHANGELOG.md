# Changelog
Toutes les modifications notables de ce projet sont consignées dans ce fichier.  
Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

## [1.0.0] - 2025-08-08
### Version stable (MVP)
- Livraison officielle de l’application en production.
- Fonctionnalités principales validées : authentification, gestion des biens, messagerie interne, abonnements Stripe, affichage Mapbox.
- Documentation technique et cahier de recettes finalisés.

---

## [0.7.0] - 2025-07
### Nouvelles fonctionnalités
- Intégration **Stripe** : abonnements, annulation et suivi du statut.
- Mise en place du **système de chat interne** entre acheteurs et vendeurs.
- Optimisation de l’affichage des biens sur la carte (**Mapbox**).
- Ajout de validations de sécurité et corrections mineures sur Prisma.

---

## [0.6.0] - 2025-06
### Nouvelles fonctionnalités
- Fonction **supprimer un bien**.
- Fonction **modifier un bien**.
- Améliorations de l’interface utilisateur (UX).
- Déploiement continu configuré sur **Vercel**.

---

## [0.5.0] - 2025-05
### Nouvelles fonctionnalités
- **Voir un bien par ID** avec détails et images.
- Ajout de la **page liste des biens**.
- Optimisation des performances (build + Lighthouse > 90).

---

## [0.4.0] - 2025-04
### Nouvelles fonctionnalités
- **Publier un bien immobilier** avec titre, description, prix et images.
- Mise en place des premiers **tests unitaires Jest**.
- Déploiement CI/CD initial sur GitHub + Vercel.

---

## [0.3.0] - 2025-03
### Nouvelles fonctionnalités
- **Modification de compte utilisateur** (nom, email, mot de passe).
- Vérifications de sécurité (hash mots de passe avec bcrypt).
- Ajout des rôles de base utilisateurs (client, agent).

---

## [0.2.0] - 2025-02
### Nouvelles fonctionnalités
- **Création de compte et connexion utilisateur** avec NextAuth.
- Mise en place de Prisma + PostgreSQL (via Neon).
- Configuration de l’authentification session + JWT.

---

## [0.1.0] - 2025-01
### Début du développement
- Initialisation du projet **Next.js (serverless)**.
- Mise en place du dépôt GitHub et intégration avec Vercel.
- Installation des dépendances principales : Next, Prisma, NextAuth, Stripe, Mapbox.