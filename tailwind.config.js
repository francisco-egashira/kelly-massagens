/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                luxury: {
                    gold: '#c5a880',    // Soft elegant champagne gold
                    goldDark: '#b2936a',
                    dark: '#1a1816',    // Deep premium background option
                    cream: '#faf8f5',   // Serene warm white canvas
                    stone: '#7c756d'    // Muted luxury body text
                }
            },
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'],
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}

