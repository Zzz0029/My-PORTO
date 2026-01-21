/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cyber-blue': '#0070f3',
                'matrix-green': '#00ff41',
                'dark-bg': '#050505',
            },
            fontFamily: {
                sans: ['Inter', 'Montserrat', 'sans-serif'],
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'scan': 'scan 2s linear infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #0070f3, 0 0 10px #0070f3' },
                    '100%': { boxShadow: '0 0 10px #0070f3, 0 0 20px #0070f3, 0 0 30px #0070f3' },
                },
                scan: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
            },
        },
    },
    plugins: [
        require('tailwind-scrollbar-hide'),
    ],
}
