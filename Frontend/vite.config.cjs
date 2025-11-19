const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');

module.exports = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // example: map '@mui/material' -> a local folder (keep as example)
      '@mui/material': path.resolve(__dirname, 'vendor/mui/material')
    }
  }
});
