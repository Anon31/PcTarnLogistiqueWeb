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
                surface: {
                    0: 'var(--primary-950)',
                    50: 'var(--primary-900)',
                    100: 'var(--primary-800)',
                    200: 'var(--primary-700)',
                    300: 'var(--primary-600)',
                    400: 'var(--primary-500)',
                    500: 'var(--primary-400)',
                    600: 'var(--primary-300)',
                    700: 'var(--primary-200)',
                    800: 'var(--primary-100)',
                    900: 'var(--primary-50)',
                    950: '#ffffff',
                },
                primary: {
                    color: 'var(--primary-400)',
                    inverseColor: 'var(--primary-950)',
                    hoverColor: 'var(--primary-300)',
                    activeColor: 'var(--primary-200)',
                },
                highlight: {
                    background: 'rgba(255,255,255,0.1)',
                    focusBackground: 'rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    focusColor: '#ffffff',
                },
            },
        },
    },
    components: {
        tag: {
            root: {
                borderRadius: '8px',
            },
            colorScheme: {
                light: {
                    success: { background: 'rgba(209, 250, 229, 0.85)', color: '#047857' },
                    info: { background: 'rgba(219, 234, 254, 0.85)', color: '#1e40af' },
                    warn: { background: 'rgba(255, 237, 213, 0.85)', color: '#9a3412' },
                    danger: { background: 'rgba(254, 226, 226, 0.85)', color: '#991b1b' },
                },
                dark: {
                    // Émeraude pur et intense
                    success: {
                        background:
                            'linear-gradient(145deg, rgba(16, 185, 129, 0.2) 0%, rgba(2, 44, 34, 0.6) 100%)',
                        color: '#a7f3d0',
                    },
                    info: {
                        background:
                            'linear-gradient(145deg, rgba(59, 130, 246, 0.15) 0%, rgba(30, 58, 138, 0.4) 100%)',
                        color: '#dbeafe',
                    },
                    warn: {
                        background:
                            'linear-gradient(145deg, rgba(249, 115, 22, 0.15) 0%, rgba(124, 45, 18, 0.4) 100%)',
                        color: '#ffedd5',
                    },
                    // Rubis profond et lumineux
                    danger: {
                        background:
                            'linear-gradient(145deg, rgba(225, 29, 72, 0.2) 0%, rgba(76, 5, 25, 0.6) 100%)',
                        color: '#ffe4e6',
                    },
                },
            },
        },
        datatable: {
            columnTitle: {
                fontWeight: '500',
            },
            sortIcon: {
                size: '0.5rem',
            },
            colorScheme: {
                light: {
                    header: {
                        background: 'transparent',
                        borderColor: '{surface.200}',
                        color: '{text.muted}',
                    },
                    headerCell: {
                        background: 'transparent',
                        hoverBackground: '{surface.50}',
                        borderColor: '{surface.200}',
                    },
                    bodyCell: {
                        borderColor: '{surface.200}',
                    },
                    row: {
                        // 🚨 Toujours transparent pour laisser transparaître le Glassmorphism de la carte
                        background: 'transparent',
                        color: '{text.main}',
                        // 🚨 Utilisation d'une couleur pleine très claire (pastel) pour éviter les bugs de transparence sur blanc
                        hoverBackground: 'var(--secondary-50)',
                        hoverColor: 'var(--secondary-600)',
                    },
                },
                dark: {
                    header: {
                        background: 'transparent',
                        borderColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff',
                    },
                    headerCell: {
                        background: 'transparent',
                        color: '#ffffff',
                        hoverBackground: 'rgba(255, 255, 255, 0.03)',
                        borderColor: 'rgba(255, 255, 255, 0.05)',
                    },
                    bodyCell: {
                        borderColor: 'rgba(255, 255, 255, 0.05)',
                        // selectedBorderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    row: {
                        background: 'transparent',
                        color: '#ffffff', // Texte pur blanc Web3
                        // 🚨 Code HEX avec opacité (26 = 15%) pour éviter que PrimeNG ne casse le rgba()
                        hoverBackground: '#F0870026',
                        hoverColor: 'var(--secondary-400)',
                    },
                },
                // light: {
                //     header: {
                //         background: 'transparent',
                //         color: '{text.muted}',
                //     },
                //     row: {
                //         background: 'var(--primary-500)',
                //         color: 'var(--primary-color-text)',
                //         hoverBackground: 'rgba(240, 135, 0, 0.1)',
                //         hoverColor: 'var(--secondary-400)',
                //     },
                // },
                // dark: {
                //     header: {
                //         background: 'transparent',
                //         color: '#ffffff',
                //     },
                //     row: {
                //         color: '#fff',
                //         background: 'transparent',
                //         hoverBackground: 'rgba(240, 135, 0, 0.1)',
                //         hoverColor: 'var(--secondary-400)',
                //     },
                // },
            },
        },
        toast: {
            root: {
                width: '24rem',
                borderRadius: '12px',
                borderWidth: '1px',
                transitionDuration: '0.4s',
            },
            colorScheme: {
                light: {
                    // --- SUCCESS (Light) ---
                    success: {
                        background: 'rgba(209, 250, 229, 0.95)',
                        color: '#047857',
                        detailColor: '#065f46',
                        borderColor: 'rgba(16, 185, 129, 0.5)',
                        shadow: '0 8px 30px rgba(16, 185, 129, 0.2)',
                    },
                    // --- INFO (Light) - Bleu Ciel Frais ---
                    info: {
                        background: 'rgba(219, 234, 254, 0.95)',
                        color: '#1e40af', // Bleu roi foncé
                        detailColor: '#1e3a8a',
                        borderColor: 'rgba(59, 130, 246, 0.5)', // Bordure plus visible
                        shadow: '0 8px 30px rgba(59, 130, 246, 0.2)',
                    },
                    // --- WARN (Light) - Orange Crème ---
                    warn: {
                        background: 'rgba(255, 237, 213, 0.95)',
                        color: '#9a3412', // Orange brûlé foncé
                        detailColor: '#7c2d12',
                        borderColor: 'rgba(249, 115, 22, 0.5)',
                        shadow: '0 8px 30px rgba(249, 115, 22, 0.2)',
                    },
                    // --- ERROR (Light) - Rose Rouge ---
                    error: {
                        background: 'rgba(254, 226, 226, 0.95)',
                        color: '#991b1b', // Rouge sang
                        detailColor: '#7f1d1d',
                        borderColor: 'rgba(239, 68, 68, 0.5)',
                        shadow: '0 8px 30px rgba(239, 68, 68, 0.2)',
                    },
                },
                dark: {
                    // --- SUCCESS (Dark) ---
                    success: {
                        background:
                            'linear-gradient(145deg, rgba(16, 185, 129, 0.2) 0%, rgba(2, 44, 34, 0.6) 100%)',
                        color: '#a7f3d0',
                        detailColor: '#6ee7b7',
                        borderColor: 'rgba(52, 211, 153, 0.8)',
                        shadow: '0 4px 30px rgba(16, 185, 129, 0.35)',
                    },
                    info: {
                        // Dégradé partant d'un bleu électrique transparent
                        background:
                            'linear-gradient(145deg, rgba(59, 130, 246, 0.15) 0%, rgba(30, 58, 138, 0.4) 100%)',
                        color: '#dbeafe', // Bleu très clair
                        detailColor: '#bfdbfe',
                        borderColor: 'rgba(96, 165, 250, 0.6)', // Bordure néon
                        shadow: '0 4px 25px rgba(59, 130, 246, 0.25)',
                    },
                    warn: {
                        // Dégradé partant d'un orange vif transparent
                        background:
                            'linear-gradient(145deg, rgba(249, 115, 22, 0.15) 0%, rgba(124, 45, 18, 0.4) 100%)',
                        color: '#ffedd5', // Orange très clair
                        detailColor: '#fed7aa',
                        borderColor: 'rgba(251, 146, 60, 0.6)', // Bordure néon
                        shadow: '0 4px 25px rgba(249, 115, 22, 0.25)',
                    },
                    error: {
                        background:
                            'linear-gradient(145deg, rgba(225, 29, 72, 0.2) 0%, rgba(76, 5, 25, 0.6) 100%)',
                        color: '#ffe4e6',
                        detailColor: '#fda4af',
                        borderColor: 'rgba(251, 113, 133, 0.8)',
                        shadow: '0 4px 30px rgba(225, 29, 72, 0.35)',
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
    },
});
