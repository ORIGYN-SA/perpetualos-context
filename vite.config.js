import { defineConfig } from 'vite';
import Checker from 'vite-plugin-checker';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default defineConfig({
  plugins: [nodeResolve(), commonjs(), Checker({ typescript: true })],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'PerpetualOSContext',
      formats: ['cjs'],
    },
    rollupOptions: {
      output: {
        dir: 'dist-vite',
      },
    },
  },
});
