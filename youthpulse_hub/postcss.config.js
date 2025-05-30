let tailwindcss;
try {
  // Try to require the correct Tailwind/PostCSS plugin (as recommended for Tailwind v3+)
  tailwindcss = require('@tailwindcss/postcss')();
} catch (e) {
  throw new Error("Please ensure @tailwindcss/postcss is installed. Run: npm install @tailwindcss/postcss");
}

module.exports = {
  plugins: [
    tailwindcss,
    require('autoprefixer')
  ],
};
