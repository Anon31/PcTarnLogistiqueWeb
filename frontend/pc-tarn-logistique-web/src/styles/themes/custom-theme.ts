import Material from '@primeuix/themes/material';
import { definePreset } from '@primeuix/themes';

// Nom de variable	                        Description
// --p-primary-color	                    Couleur principale (emerald.500, ou autre)
// --p-primary-color-hover	                Couleur au hover
// --p-primary-color-active	                Couleur active (clic)
// --p-primary-color-inverse	            Texte sur fond primaire
// --p-highlight-background	                Fond de sélection
// --p-highlight-focus-background	        Fond focusé
// --p-highlight-color	                    Texte sur fond sélection
// --p-highlight-focus-color	            Texte sur fond focusé

export const CustomTheme = definePreset(Material, {
    semantic: {
        primary: {
            50: 'var(--primary-50)',
            100: 'var(--primary-100)',
            200: 'var(--primary-200)',
            300: 'var(--primary-300)',
            400: 'var(--primary-400)',
            500: 'var(--primary-500)',
            600: 'var(--primary-600)',
            700: 'var(--primary-700)',
            800: 'var(--primary-800)',
            900: 'var(--primary-900)',
            950: 'var(--primary-950)',
        },
        secondary: {
            50: 'var(--secondary-50)',
            100: 'var(--secondary-100)',
            200: 'var(--secondary-200)',
            300: 'var(--secondary-300)',
            400: 'var(--secondary-400)',
            500: 'var(--secondary-500)',
            600: 'var(--secondary-600)',
            700: 'var(--secondary-700)',
            800: 'var(--secondary-800)',
            900: 'var(--secondary-900)',
            950: 'var(--secondary-950)',
        },
        colorScheme: {
            light: {
                primary: {
                    color: 'var(--primary-500)',
                    inverseColor: '#ffffff',
                    hoverColor: 'var(--primary-600)',
                    activeColor: 'var(--primary-700)',
                },
                highlight: {
                    background: 'var(--primary-50)',
                    focusBackground: 'var(--primary-100)',
                    color: 'var(--primary-900)',
                    focusColor: 'var(--primary-950)',
                },
            },
            dark: {
                // --- CONFIGURATION DARK MODE "BLEU NUIT" ---
                surface: {
                    0: 'var(--primary-950)', // Fond principal (Bleu très sombre)
                    50: 'var(--primary-900)', // Cartes / Menus
                    100: 'var(--primary-800)', // Survol
                    200: 'var(--primary-700)', // Bordures
                    300: 'var(--primary-600)',
                    400: 'var(--primary-500)',
                    500: 'var(--primary-400)',
                    600: 'var(--primary-300)',
                    700: 'var(--primary-200)',
                    800: 'var(--primary-100)',
                    900: 'var(--primary-50)', // Texte principal
                    950: '#ffffff', // Texte accentué
                },
                // On adapte la couleur Primaire pour qu'elle ressorte sur le fond bleu
                primary: {
                    color: 'var(--primary-400)',
                    inverseColor: 'var(--primary-950)', // Texte foncé sur le bouton
                    hoverColor: 'var(--primary-300)',
                    activeColor: 'var(--primary-200)',
                },
                // Highlight subtil
                highlight: {
                    background: 'rgba(255,255,255,0.1)',
                    focusBackground: 'rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    focusColor: '#ffffff',
                },
            },
        },
    },
    // Surcharger des composants spécifiques ici si besoin
    // components: { ... }
});
