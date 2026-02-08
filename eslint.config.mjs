// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import unusedImports from 'eslint-plugin-unused-imports';
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
    // 2. Configuration de base JS
    eslint.configs.recommended,
    // 3. Prettier GLOBAL (On le place AVANT les overrides spécifiques pour pouvoir le surcharger)
    eslintPluginPrettierRecommended,
    {
        rules: {
            // On force les fins de ligne auto pour éviter les conflits Windows/Linux
            'prettier/prettier': ['error', { endOfLine: 'auto' }],
        },
    },
    // 4. Configuration TypeScript RECOMMANDÉE (Type Checked)
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
    // 5. Configuration Spécifique FRONTEND (Angular)
    {
        files: ['frontend/pc-tarn-logistique-web/**/*.ts'],
        extends: [...angular.configs.tsRecommended],
        processor: angular.processInlineTemplates,
        languageOptions: {
            globals: { ...globals.browser },
            parserOptions: {
                project: ['frontend/pc-tarn-logistique-web/tsconfig.json'],
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
            '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
        },
    },
    // 6. Configuration Spécifique BACKEND (NestJS)
    {
        files: ['backend/pc-tarn-logistique-api/**/*.ts'],
        languageOptions: {
            globals: { ...globals.node },
            parserOptions: {
                project: ['backend/pc-tarn-logistique-api/tsconfig.json'],
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-unsafe-argument': 'warn',
        },
    },
    // 7. RÈGLES GLOBALES CLEAN CODE (Prioritaires sur le TS de base)
    {
        files: ['**/*.ts'],
        plugins: {
            'unused-imports': unusedImports,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-floating-promises': 'warn',
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
    // 8. Configuration HTML (Angular Templates)
    // PLACÉ À LA FIN pour écraser la config Prettier globale sur les fichiers HTML
    {
        files: ['**/*.html'],
        plugins: {
            '@angular-eslint/template': angularTemplatePlugin,
        },
        languageOptions: {
            parser: angularTemplateParser,
        },
        rules: {
            // On a décidé que Prettier ne touche pas au HTML
            'prettier/prettier': 'off',

            // Exemples de règles utiles
            '@angular-eslint/template/no-negated-async': 'error',
        },
    },
);
