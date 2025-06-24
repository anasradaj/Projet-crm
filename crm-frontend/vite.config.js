// crm-frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Projet-crm/', // <-- AJOUTEZ CETTE LIGNE !
  // Remplacez 'Projet-crm' par le nom exact de votre dépôt GitHub si différent.
  // Assurez-vous d'avoir un slash au début et à la fin.
  build: {
    outDir: 'dist', // Le répertoire de sortie de la construction
  }
});