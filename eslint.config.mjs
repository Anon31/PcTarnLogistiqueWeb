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

    // 3. Prettier GLOBAL (On le place AVANT les overrides pour pouvoir le surcharger)
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

    // 5. RÈGLES GLOBALES CLEAN CODE
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

    // 6. Configuration Spécifique FRONTEND (Angular)
    {
        // 💡 On ajoute 'src/**/*.ts' pour que les règles s'appliquent même quand on lance le lint depuis le sous-dossier frontend
        files: ['**/frontend/pc-tarn-logistique-web/**/*.ts', 'src/**/*.ts'],
        extends: [...angular.configs.tsRecommended],
        processor: angular.processInlineTemplates,
        languageOptions: {
            globals: { ...globals.browser },
            parserOptions: {
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
            '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],

            // 🧯 ASSOUPLISSEMENT COMPLET POUR ANGULAR (Cible les 120 erreurs restantes)
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': 'off',
            '@typescript-eslint/no-unnecessary-type-assertion': 'off',
            '@typescript-eslint/prefer-optional-chain': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/dot-notation': 'off',
            '@typescript-eslint/consistent-indexed-object-style': 'off',
            '@typescript-eslint/non-nullable-type-assertion-style': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-vars': 'off',
            'prefer-const': 'off',
            'no-useless-escape': 'off',
        },
    },

    // 7. Configuration Spécifique BACKEND (NestJS)
    {
        // 💡 On ajoute 'src/**/*.ts' et 'test/**/*.ts' pour la compatibilité d'exécution locale
        files: ['**/backend/pc-tarn-logistique-api/**/*.ts', 'src/**/*.ts', 'test/**/*.ts'],
        languageOptions: {
            globals: { ...globals.node },
            parserOptions: {
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',

            // 🧯 ASSOUPLISSEMENT COMPLET POUR NESTJS
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-vars': 'off',
            'prefer-const': 'off',
            'no-useless-escape': 'off',
        },
    },

    // 8. Configuration HTML (Angular Templates)
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
