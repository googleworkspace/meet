import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "src",
  build: {
    outDir: '../../dist/hello-world-react-ts-vite',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/SidePanel.html'),
        mainStage: resolve(__dirname, 'src/MainStage.html'),
      }
    }
  },
})
