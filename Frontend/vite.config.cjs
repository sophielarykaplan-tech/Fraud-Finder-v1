const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');

module.exports = defineConfig({
  plugins: [react()],
  // No custom alias by default. If you need to map packages to local
  // folders (for a local fork), add aliases here. Leaving empty avoids
  // accidentally shadowing official packages like '@mui/material'.
});
