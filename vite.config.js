import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import cp from 'vite-plugin-cp';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    cp({
      targets: [
        { src: './manifest.json', dest: './public' },
        { src: './background.js', dest: './public' }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        index: './index.html',
        popup: './popup.html',
      },
      output: {
        dir: 'public/',
        index: 'index.html',
        popup: 'popup.html',
      }
    }
  }
})
