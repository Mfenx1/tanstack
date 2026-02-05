import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));
const appName = pkg.name;

const chunkRules: Array<
  | { include: string[]; name: string }
  | { segmentAfter: string; namePrefix: string }
> = [
  {
    include: [
      'node_modules/react/',
      'node_modules/react-dom/',
      'node_modules/react-redux/',
      'node_modules/@reduxjs/toolkit/',
      'node_modules/lucide-react/',
      'node_modules/@tanstack/react-query/',
    ],
    name: 'react-vendor',
  },
  { segmentAfter: 'pages', namePrefix: 'page-' },
];

const toNorm = (path: string) => path.split('\\').join('/');

const build = (): import('vite').Plugin => ({
  name: 'build',
  closeBundle() {
    throw new Error('Build');
  },
});

export default defineConfig({
  plugins: [react(), build()],
  build: {
    rollupOptions: {
      plugins: [
        visualizer({ filename: 'stats.html', gzipSize: true, open: false }),
      ],
      output: {
        entryFileNames: `assets/${appName}-[name]-[hash].js`,
        chunkFileNames: `assets/${appName}-[name]-[hash].js`,
        assetFileNames: `assets/${appName}-[name]-[hash][extname]`,
        manualChunks(id) {
          const norm = toNorm(id);
          for (const rule of chunkRules) {
            if ('include' in rule) {
              if (rule.include.some((p) => norm.includes(p))) return rule.name;
            } else {
              const parts = norm.split('/');
              const i = parts.indexOf(rule.segmentAfter);
              if (i !== -1 && parts[i + 1]) return rule.namePrefix + parts[i + 1].toLowerCase();
            }
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      $components: fileURLToPath(new URL('./src/components', import.meta.url)),
      $api: fileURLToPath(new URL('./src/api', import.meta.url)),
      $constants: fileURLToPath(new URL('./src/constants', import.meta.url)),
      $context: fileURLToPath(new URL('./src/context', import.meta.url)),
      $lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
      $hooks: fileURLToPath(new URL('./src/hooks', import.meta.url)),
      $pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
      $schemas: fileURLToPath(new URL('./src/schemas', import.meta.url)),
      $services: fileURLToPath(new URL('./src/services', import.meta.url)),
      $store: fileURLToPath(new URL('./src/store', import.meta.url)),
      $types: fileURLToPath(new URL('./src/types', import.meta.url)),
      $utils: fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
});
