import autoprefixer from 'autoprefixer'

// Try to use the new @tailwindcss/postcss plugin for Tailwind 4.x compatibility
let tailwindPlugin;
try {
  const { default: postcss } = await import('@tailwindcss/postcss')
  tailwindPlugin = postcss
} catch {
  // Fallback to traditional tailwindcss plugin for Tailwind 3.x
  const { default: tailwindcss } = await import('tailwindcss')
  tailwindPlugin = tailwindcss
}

export default {
  plugins: [
    tailwindPlugin,
    autoprefixer,
  ],
}