import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), devtoolsJson()],

  // Dev server proxy to avoid CORS between :5173 and :8000
  server: {
    proxy: {
      // Proxy API Platform endpoints
      '/api': {
        target: process.env.PUBLIC_API_BASE ?? process.env.PUBLIC_API_URL ?? 'http://localhost:8000',
        changeOrigin: true
      },
      // (Optional) if uploaded media from Symfony (e.g., /media/*)
      '/media': {
        target: process.env.PUBLIC_API_BASE ?? process.env.PUBLIC_API_URL ?? 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },

  // DO NOT use define for PUBLIC_* in SvelteKit; use $env/static/public instead.
  // Keeping test config as-is.
  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: './vite.config.ts',
        test: {
          name: 'client',
          environment: 'browser',
          browser: {
            enabled: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }]
          },
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**'],
          setupFiles: ['./vitest-setup-client.ts']
        }
      },
      {
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
        }
      }
    ]
  }
});
