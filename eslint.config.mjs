// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
    // 1. Ignorer les dossiers de build et caches
    {
        ignores: [
            '**/dist/**',
            '**/node_modules/**',
            '**/coverage/**',
            '**/.angular/**',
            '**/.nx/**',
        ],
    },

    // 2. Configuration de base JS
    eslint.configs.recommended,

    // 3. Configuration TypeScript RECOMMANDÉE (Type Checked)
    // On applique ces règles uniquement aux fichiers TS
    {
        files: ['**/*.ts'],
        extends: [
            ...tseslint.configs.recommendedTypeChecked, // Recommandation officielle pour TS avec typage
            ...tseslint.configs.stylisticTypeChecked, // Règles de style TS
        ],
        languageOptions: {
            parserOptions: {
                projectService: true, // Active le nouveau service de projet (plus rapide)
                tsconfigRootDir: __dirname,
            },
        },
    },

    // 4. Configuration Spécifique FRONTEND (Angular)
    {
        files: ['frontend/pc-tarn-logistique-web/**/*.ts'],
        extends: [...angular.configs.tsRecommended],
        processor: angular.processInlineTemplates,
        languageOptions: {
            globals: { ...globals.browser },
            parserOptions: {
                // Chemin explicite pour le frontend
                project: ['frontend/pc-tarn-logistique-web/tsconfig.json'],
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            '@angular-eslint/directive-selector': [
                'error',
                { type: 'attribute', prefix: 'app', style: 'camelCase' },
            ],
            '@angular-eslint/component-selector': [
                'error',
                { type: 'element', prefix: 'app', style: 'kebab-case' },
            ],
        },
    },

    // 5. Configuration Spécifique BACKEND (NestJS)
    {
        files: ['backend/pc-tarn-logistique-api/**/*.ts'],
        languageOptions: {
            globals: { ...globals.node },
            parserOptions: {
                // Chemin explicite pour le backend
                project: ['backend/pc-tarn-logistique-api/tsconfig.json'],
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            // Règles "relax" typiques NestJS
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            // Parfois NestJS utilise des injections non sécurisées, on peut assouplir si besoin
            '@typescript-eslint/no-unsafe-argument': 'warn',
        },
    },

    // 6. Configuration HTML (Angular Templates)
    {
        files: ['**/*.html'],
        extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
        rules: {},
    },

    // 7. RÈGLES GLOBALES CLEAN CODE (Prioritaires)
    // Appliquées à TOUS les fichiers TS (Front et Back)
    {
        files: ['**/*.ts'],
        plugins: {
            'unused-imports': unusedImports,
        },
        rules: {
            // 🚫 Interdire le type 'any'
            '@typescript-eslint/no-explicit-any': 'error',

            // ⚠️ Règles Type-Checked supplémentaires (Activées par recommendedTypeChecked)
            '@typescript-eslint/no-floating-promises': 'warn', // Attraper les promesses non gérées

            // 🧹 Suppression automatique des variables/imports inutilisés
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },

    // 8. Prettier (Toujours en dernier)
    eslintPluginPrettierRecommended,
    {
        rules: {
            'prettier/prettier': ['error', { endOfLine: 'auto' }],
        },
    },
);
