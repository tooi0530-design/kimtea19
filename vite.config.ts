import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');
  
  // Ensure API_KEY is a string (even if empty) to prevent JSON.stringify from handling undefined
  const apiKey = env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY for the browser environment
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});