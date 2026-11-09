import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/dek71-dashboard/', // GitHub Pages project URL
  plugins: [react()],
});
