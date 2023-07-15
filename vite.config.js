

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import stylelint from 'vite-plugin-stylelint';
import svgLoader from 'vite-svg-loader';
import Unocss from 'unocss/vite';
import { resolve } from 'path';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: process.env.VITE_BASE_PUBLIC_PATH,
    plugins: [
      eslint({ cache: false }),
      stylelint(),
      svgLoader(),
      vue(),
      Unocss({})
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  });
};