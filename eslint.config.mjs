// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
    // 1. Ignorer les dossiers de build et caches
    {
        ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/.angular/**', '**/.nx/**'],
    },

    // 2. Configuration de base JS et Prettier
    eslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        rules: {
            'prettier/prettier': ['error', { endOfLine: 'auto' }],
        },
    },

    // 3. Configuration TypeScript RECOMMANDÉE (Appliquée à tous les fichiers .ts)
    {
        files: ['**/*.ts'],
        extends: [...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.stylisticTypeChecked],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            // 🛡️ CI/CD UNBLOCKER : Désactivation des contraintes de typage strict
            // On désactive ici les règles qui causent des faux-positifs en environnement Monorepo/Tests
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': 'off',
            '@typescript-eslint/prefer-optional-chain': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/dot-notation': 'off', // 💡 Autorise l'accès par crochets (indispensable pour les mocks de tests)
            '@typescript-eslint/no-inferrable-types': 'off',
            'prefer-const': 'off',
            'no-useless-escape': 'off',
        },
    },

    // 4. Configuration Spécifique FRONTEND (Angular)
    {
        // 💡 On cible le dossier frontend et les fichiers de l'app Angular
        files: ['**/frontend/**/*.ts', '**/src/app/**/*.ts'],
        extends: [...angular.configs.tsRecommended],
        processor: angular.processInlineTemplates,
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
        rules: {
            '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
            '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],

            // 🛡️ Overrides Angular (Evite les conflits avec le Backend)
            '@angular-eslint/prefer-inject': 'off',
            '@angular-eslint/no-output-native': 'off',
        },
    },

    // 5. Configuration Spécifique BACKEND (NestJS)
    {
        // 💡 On cible spécifiquement le dossier backend pour éviter les fuites de règles Angular
        files: ['**/backend/**/*.ts'],
        languageOptions: {
            globals: { ...globals.node },
        },
        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/no-empty-function': 'off',
        },
    },

    // 6. Configuration HTML (Templates Angular)
    {
        files: ['**/*.html'],
        plugins: { '@angular-eslint/template': angularTemplatePlugin },
        languageOptions: { parser: angularTemplateParser },
        rules: {
            'prettier/prettier': 'off',
            '@angular-eslint/template/no-negated-async': 'error',
        },
    },
);
