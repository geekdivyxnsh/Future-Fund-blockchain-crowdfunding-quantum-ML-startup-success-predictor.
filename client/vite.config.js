import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  optimizeDeps: {
    include: ['buffer'],
    exclude: [
      '@safe-global/safe-ethers-adapters',
      '@safe-global/safe-core-sdk',
      '@safe-global/safe-ethers-lib'
    ]
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: (id) => {
        return id.includes('@safe-global') || id.includes('@safe-{')
      }
    }
  },
  base: '/',
});
