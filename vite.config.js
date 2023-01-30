import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      input: {
        index: './index.html',
        popUp: './pop-up.html',
        background: './background.html'
      },
      output: {
        dir: 'public/',
        index: 'index.html',
        popUp: 'pop-up.html',
        background: 'background.html'
      }
    }
  }
})
