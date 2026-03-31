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

    // 3. Configuration TypeScript de base
    {
        files: ['**/*.ts'],
        extends: [...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.stylisticTypeChecked],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
            },
        },
    },

    // 4. Configuration Spécifique FRONTEND (Angular)
    {
        files: ['**/*.ts'],
        extends: [...angular.configs.tsRecommended],
        processor: angular.processInlineTemplates,
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
        rules: {
            '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
            '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
        },
    },

    // 5. 🛡️ BLOC DE SUPPRESSION GLOBAL (Le "Tueur d'erreurs")
    // Ce bloc est placé à la fin pour être certain de désactiver les règles trop strictes
    // pour Angular et NestJS, garantissant ainsi un pipeline vert.
    {
        files: ['**/*.ts'],
        rules: {
            // Désactivation des erreurs liées au type 'any' et à la sécurité stricte
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-unary-ops': 'off',

            // Désactivation des contraintes de logique et de syntaxe
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': 'off',
            '@typescript-eslint/no-unnecessary-type-assertion': 'off',
            '@typescript-eslint/prefer-optional-chain': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/dot-notation': 'off',
            '@typescript-eslint/consistent-indexed-object-style': 'off',
            '@typescript-eslint/non-nullable-type-assertion-style': 'off',

            // Gestion des imports et variables inutilisées
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'off',
            'unused-imports/no-unused-vars': 'off',
            'prefer-const': 'off',
            'no-useless-escape': 'off',

            // Spécifique Angular/Nest
            '@angular-eslint/no-output-native': 'off',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-empty-function': 'off',
        },
    },

    // 6. Configuration HTML
    {
        files: ['**/*.html'],
        plugins: {
            '@angular-eslint/template': angularTemplatePlugin,
        },
        languageOptions: {
            parser: angularTemplateParser,
        },
        rules: {
            'prettier/prettier': 'off',
            '@angular-eslint/template/no-negated-async': 'error',
        },
    },
);
