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
    components: {
        toast: {
            root: {
                width: '24rem',
                borderRadius: '12px',
                borderWidth: '1px',
                transitionDuration: '0.4s',
            },
            colorScheme: {
                light: {
                    // --- SUCCESS (Light) - Validé ---
                    success: {
                        background: 'rgba(209, 250, 229, 0.95)',
                        color: '#047857',
                        detailColor: '#065f46',
                        borderColor: 'rgba(16, 185, 129, 0.5)',
                        shadow: '0 8px 30px rgba(16, 185, 129, 0.2)',
                    },
                    // --- INFO (Light) - Bleu Ciel Frais ---
                    info: {
                        // Avant: Blanc vitré
                        // Après: Bleu ciel soutenu (Blue 100)
                        background: 'rgba(219, 234, 254, 0.95)',
                        color: '#1e40af', // Bleu roi foncé
                        detailColor: '#1e3a8a',
                        borderColor: 'rgba(59, 130, 246, 0.5)', // Bordure plus visible
                        shadow: '0 8px 30px rgba(59, 130, 246, 0.2)',
                    },
                    // --- WARN (Light) - Orange Crème ---
                    warn: {
                        // Avant: Blanc vitré
                        // Après: Orange crème (Orange 100)
                        background: 'rgba(255, 237, 213, 0.95)',
                        color: '#9a3412', // Orange brûlé foncé
                        detailColor: '#7c2d12',
                        borderColor: 'rgba(249, 115, 22, 0.5)',
                        shadow: '0 8px 30px rgba(249, 115, 22, 0.2)',
                    },
                    // --- ERROR (Light) - Rose Rouge ---
                    error: {
                        // Avant: Blanc vitré
                        // Après: Rouge rose pâle (Red 100)
                        background: 'rgba(254, 226, 226, 0.95)',
                        color: '#991b1b', // Rouge sang
                        detailColor: '#7f1d1d',
                        borderColor: 'rgba(239, 68, 68, 0.5)',
                        shadow: '0 8px 30px rgba(239, 68, 68, 0.2)',
                    },
                },
                dark: {
                    // --- SUCCESS (Dark) - Validé ---
                    success: {
                        background:
                            'linear-gradient(145deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.4) 100%)',
                        color: '#d1fae5',
                        detailColor: '#a7f3d0',
                        borderColor: 'rgba(52, 211, 153, 0.6)',
                        shadow: '0 4px 25px rgba(16, 185, 129, 0.25)',
                    },
                    // --- INFO (Dark) - Bleu Cyber Lumineux ---
                    info: {
                        // Dégradé partant d'un bleu électrique transparent
                        background:
                            'linear-gradient(145deg, rgba(59, 130, 246, 0.15) 0%, rgba(30, 58, 138, 0.4) 100%)',
                        color: '#dbeafe', // Bleu très clair
                        detailColor: '#bfdbfe',
                        borderColor: 'rgba(96, 165, 250, 0.6)', // Bordure néon
                        shadow: '0 4px 25px rgba(59, 130, 246, 0.25)',
                    },
                    // --- WARN (Dark) - Orange Feu Doux ---
                    warn: {
                        // Dégradé partant d'un orange vif transparent
                        background:
                            'linear-gradient(145deg, rgba(249, 115, 22, 0.15) 0%, rgba(124, 45, 18, 0.4) 100%)',
                        color: '#ffedd5', // Orange très clair
                        detailColor: '#fed7aa',
                        borderColor: 'rgba(251, 146, 60, 0.6)', // Bordure néon
                        shadow: '0 4px 25px rgba(249, 115, 22, 0.25)',
                    },
                    // --- ERROR (Dark) - Rouge Alerte ---
                    error: {
                        // Dégradé partant d'un rouge vif transparent
                        background:
                            'linear-gradient(145deg, rgba(239, 68, 68, 0.15) 0%, rgba(127, 29, 29, 0.4) 100%)',
                        color: '#ffe4e6', // Rose très clair
                        detailColor: '#fecdd3',
                        borderColor: 'rgba(248, 113, 113, 0.6)', // Bordure néon
                        shadow: '0 4px 25px rgba(239, 68, 68, 0.25)',
                    },
                },
            },
        },
        progressspinner: {
            colorScheme: {
                light: {
                    root: {
                        colorOne: '{secondary.500}',
                        colorTwo: '{secondary.600}',
                        colorThree: '{secondary.400}',
                        colorFour: '{secondary.500}',
                    },
                },
                dark: {
                    root: {
                        colorOne: '#fb923c',
                        colorTwo: '#f97316',
                        colorThree: '#fdba74',
                        colorFour: '#fb923c',
                    },
                },
            },
        },
        panelmenu: {
            // --- STRUCTURE UNIQUEMENT (Pas de couleurs ici pour éviter les erreurs de type) ---
            root: {
                gap: '0.25rem', // Espace vertical entre les éléments
            },
            item: {
                // Cible les liens des sous-menus
                padding: '0.35rem 1rem', // Padding vertical réduit
                borderRadius: '12px',
            },
            submenu: {
                indent: '1rem',
            },
            // NOTE : On ne déclare PAS 'header' ni 'focusColor' en objet ici.
            // Tout est géré dans le CSS pour garantir le switch Light/Dark sans conflit.
        },
    },
});
