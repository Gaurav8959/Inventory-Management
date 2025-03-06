import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
const PORT = '3000';
  return {
    server: {
      proxy: {
        '/api': 'http://localhost:8009',
  
        },
      port: PORT,
    },
    
    
    define: {
      global: 'window',
    },
    resolve: {
      alias: [{ find: 'src', replacement: '/src' }],
    },
    css: {
      preprocessorOptions: {
        scss: { charset: false },
        less: { charset: false },
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    plugins: [react(), jsconfigPaths()],
  };
});
