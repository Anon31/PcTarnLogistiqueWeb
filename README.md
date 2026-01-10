# 🛡️ Protection Civile du Tarn - Logistique & Opérationnel

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Status](https://img.shields.io/badge/status-In%20Development-yellow)

Plateforme de gestion logistique et opérationnelle centralisée pour la Protection Civile du Tarn.
Ce projet s'inscrit dans le cadre de la validation du titre **Expert en Architecture et Développement Logiciel**.

## 🎯 Objectifs du Projet

- **Digitalisation :** Remplacement des processus papier par une solution Web/PWA.
- **Gestion de Stock :** Suivi multi-sites, gestion des péremptions, traçabilité.
- **Opérationnel :** Checklists de départ en mission (Véhicules/Lots) et retours d'intervention.
- **Maintenance :** Remontée et suivi des anomalies matérielles.

## 🏗️ Architecture Technique

Ce projet est conçu comme un **Monorepo** regroupant l'ensemble de la stack technique.

| Couche              | Technologie                                                                                                | Description                                       |
|:--------------------|:-----------------------------------------------------------------------------------------------------------|:--------------------------------------------------|
| **Frontend**        | ![Angular](https://img.shields.io/badge/-Angular-DD0031?logo=angular&logoColor=white)                      | Application PWA (Angular v21+), Angular Material. |
| **Backend**         | ![NestJS](https://img.shields.io/badge/-NestJS-E0234E?logo=nestjs&logoColor=white)                         | API RESTful architecture modulaire.               |
| **Base de données** | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white)             | Hébergée via Supabase/Docker.                     |
| **CI/CD**           | ![GitHub Actions](https://img.shields.io/badge/-GitHub_Actions-2088FF?logo=github-actions&logoColor=white) | Intégration et déploiement continus.              |

## 🌳 Convention de Nommage des Branches Git

| Type           | Description                                                      | Exemples                           |
|----------------|------------------------------------------------------------------|------------------------------------|
| **`feat`**     | Nouvelle fonctionnalité ou évolution majeure.                    | `feat/front/login-page`            |
| **`fix`**      | Correction de bug.                                               | `fix/back/navbar-responsiveness`   |
| **`hotfix`**   | Correction urgente en production (contourne le cycle normal).    | `hotfix/api/security-patch`        |
| **`docs`**     | Modification de la documentation uniquement.                     | `docs/readme-update`               |
| **`chore`**    | Maintenance technique (config, build, CI/CD) sans impact métier. | `chore/docker/update-node-version` |
| **`refactor`** | Réécriture de code sans changement de fonctionnalité.            | `refactor/front/auth-service`      |
| **`test`**     | Ajout ou modification de tests.                                  | `test/e2e/login-flow`              |
| **`cicd`**     | Maintenance GitHub, Docker, déploiement (compose, CI/CD).        | `cicd/docker/compose`              |

## 🧪 **Convention des Commits (Standard "[Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)")**

Structure : `type(scope): description`

**Scopes recommandés :**  `front`, `back`, `api`, `ui`, `db`, `auth`, `stock`, `vehicule`, `signalement`.

| Type         | Usage                   | Exemple concret (Projet Protection Civile)                  |
|--------------|-------------------------|-------------------------------------------------------------|
| **feat**     | Nouvelle fonctionnalité | `feat(front): ajout du scan de code-barres pour les lots`   |
| **fix**      | Correction de bug       | `fix(vehicule): correction du calcul de la date de CT`      |
| **docs**     | Documentation           | `docs(api): mise à jour du swagger pour les signalements`   |
| **style**    | Formatage, CSS          | `style(ui): harmonisation des boutons aux couleurs PC81`    |
| **refactor** | Amélioration code       | `refactor(db): optimisation de la requête des consommables` |
| **test**     | Tests unitaires/E2E     | `test(auth): ajout des tests de validation de rôle`         |
| **chore**    | Maintenance/Config      | `chore(front): mise à jour de Prisma en v5.x`               |
| **cicd**     | Déploiement/Docker      | `cicd(docker): mise à jour du compose`                      |

## 🚀 Installation et Démarrage  (Mettre à jour)

### Prérequis
- Node.js (v24.0.0)
- NPM (v11.7.0)
- Docker Desktop (Dernière version 4.55.0)

### Lancer le projet

```bash
# Cloner le dépôt
git clone https://github.com/Anon31/PcTarnLogistiqueWeb.git

# Installation Backend
cd backend
npm install
npm run start:dev

# Installation Frontend
cd frontend
npm install
ng serve