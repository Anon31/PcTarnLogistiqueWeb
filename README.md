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

| Couche | Technologie | Description |
| :--- | :--- | :--- |
| **Frontend** | ![Angular](https://img.shields.io/badge/-Angular-DD0031?logo=angular&logoColor=white) | Application PWA (Angular v18+), Angular Material. |
| **Backend** | ![NestJS](https://img.shields.io/badge/-NestJS-E0234E?logo=nestjs&logoColor=white) | API RESTful architecture modulaire. |
| **Base de données** | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white) | Hébergée via Supabase/Docker. |
| **CI/CD** | ![GitHub Actions](https://img.shields.io/badge/-GitHub_Actions-2088FF?logo=github-actions&logoColor=white) | Intégration et déploiement continus. |

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v20+)
- Docker (pour la BDD locale)

### Lancer le projet /!\ Mettre à jour

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