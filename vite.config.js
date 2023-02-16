import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import cp from 'vite-plugin-cp'

// https://vitejs.dev/config/
// https://github.com/fengxinming/vite-plugins/tree/main/packages/vite-plugin-cp
export default defineConfig({
  plugins: [
    svelte(),
    cp({
      targets: [
        { src: './manifest.json', dest: './public' },
        { src: './background.js', dest: './public' },
        { src: './src/assets/icons/icon16.png', dest: './public/assets/icons' },
        { src: './src/assets/icons/icon48.png', dest: './public/assets/icons' },
        {
          src: './src/assets/icons/icon128.png',
          dest: './public/assets/icons',
        },
      ],
    }),
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
      },
    },
  },
})
