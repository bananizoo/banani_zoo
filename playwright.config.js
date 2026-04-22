const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: 'https://bananizoo.vercel.app',
    headless: true
  }
});
