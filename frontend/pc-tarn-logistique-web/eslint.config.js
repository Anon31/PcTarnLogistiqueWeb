/* global require, __dirname, module */
const { pathToFileURL } = require('node:url');
const path = require('node:path');

/**
 * 🌉 Fichier pont (Bridge) CommonJS pour l'architecture Monorepo.
 * * Pourquoi ce format spécifique ?
 * 1. Angular (via ng lint) s'attend à trouver le fichier ici.
 * 2. Le package.json d'Angular n'a pas "type": "module", donc Node.js lit ce fichier en CommonJS (require/module.exports).
 * 3. Le dossier parent contient un espace (".FIL ROUGE").
 * Sous Windows, l'import dynamique ES Module plante (Cannot find module) s'il y a un espace non encodé.
 * Solution : On calcule le chemin absolu, on l'encode proprement en URL file:// (qui gère les espaces),
 * et on exporte la configuration via une Promesse (pleinement supporté par ESLint 9+).
 */

// 1. Calcul du chemin absolu vers le fichier à la racine
const rootConfigPath = path.resolve(__dirname, '../../eslint.config.mjs');

// 2. Encodage propre du chemin (gère le %20 pour l'espace dans .FIL ROUGE)
const rootConfigUrl = pathToFileURL(rootConfigPath).href;

// 3. Export de la configuration de la racine
module.exports = (async () => {
    const { default: rootConfig } = await import(rootConfigUrl);
    return rootConfig;
})();
