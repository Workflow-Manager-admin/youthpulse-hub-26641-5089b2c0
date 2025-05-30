/**
 * Use correct plugin path for TailwindCSS in case
 * the environment expects @tailwindcss/postcss specifically.
 */
let tailwindcss;
try {
  // Try to require the shim if present
  tailwindcss = require('@tailwindcss/postcss')();
} catch (e) {
  // Fallback to direct package (normal for Tailwind v3+)
  tailwindcss = require('tailwindcss');
}

module.exports = {
  plugins: [
    tailwindcss,
    require('autoprefixer'),
  ],
};
