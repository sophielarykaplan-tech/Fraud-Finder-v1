import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // example: map '@mui/material' -> a local folder
      '@mui/material': path.resolve(__dirname, 'vendor/mui/material')
    }
  }
});