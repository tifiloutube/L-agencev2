# 🏡 L’Agence — Plateforme de gestion immobilière

## 📖 Description

**L’Agence** est une plateforme **SaaS** de mise en relation dans l’immobilier.  
Elle permet aux utilisateurs de rechercher des biens, publier des annonces, contacter des agents, simuler des crédits et gérer des abonnements.

Le projet est développé en **Next.js** avec une **architecture serverless**, et repose sur :

- **PostgreSQL (Neon)**
- **Prisma**
- **Stripe** (paiements)
- **Mailjet** (emails)
- **Vercel** (déploiement & stockage)

---

## 🏗️ Architecture

- **Frontend & Backend** : Next.js 14 (App Router)
- **ORM** : Prisma
- **Base de données** : PostgreSQL hébergée sur Neon
- **Authentification** : NextAuth (Email + OAuth)
- **Paiements** : Stripe
- **Emails** : Mailjet
- **Stockage fichiers** : Vercel Blob Storage
- **Monitoring** : Sentry
- **CI/CD** : GitHub Actions + Vercel

---

## 📂 Organisation du code

app/ # Pages Next.js (App Router)
components/ # Composants réutilisables (UI, formulaires, etc.)
lib/ # Helpers, utils et configs
prisma/ # Schéma Prisma + migrations
tests/ # Tests unitaires Jest

yaml
Copier
Modifier

---

## ⚙️ Installation locale

### 1. Prérequis
- Node.js >= 18
- Yarn

2. Installer les dépendances
```bash
   yarn install
```

3. Générer le client Prisma & exécuter les migrations
```bash
   yarn prisma generate
   yarn prisma migrate dev
```

4. Lancer le projet
```bash
yarn dev
```


👉 Disponible sur http://localhost:3000.