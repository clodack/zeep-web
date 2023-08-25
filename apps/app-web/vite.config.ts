import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import macrosPlugin from 'vite-plugin-babel-macros';

import { getClientEnvironments} from 'zeep-scripts/env.mjs';

// https://vitejs.dev/config/
export default () => {
  const { stringified: envs } = getClientEnvironments();

  return defineConfig({
    plugins: [
      react(),
      macrosPlugin(),
    ],
    define: {
      ...envs,
    },
  });
}
