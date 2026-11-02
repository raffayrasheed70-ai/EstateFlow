import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// `base: './'` makes the built files use relative paths, so the same build
// works on GitHub Pages (https://<user>.github.io/<repo>/), Netlify, Vercel,
// or any static host without editing this file.
// The app uses HashRouter (URLs look like /#/properties), so no server-side
// SPA rewrite rules are needed either. See README.md for details.
export default defineConfig({
  base: './',
  plugins: [react()],
})
