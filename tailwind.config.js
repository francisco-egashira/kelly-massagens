/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sage: {
                    50: '#f4f7f5',
                    100: '#e6ede9',
                    600: '#607d6b',
                    700: '#4d6456',
                }
            }
        },
    },
    plugins: [],
}
