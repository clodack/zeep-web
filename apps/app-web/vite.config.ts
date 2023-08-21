import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { getClientEnvironments} from 'zeep-scripts/env.mjs';

// https://vitejs.dev/config/
export default () => {
  const { stringified: envs } = getClientEnvironments();

  return defineConfig({
    plugins: [react()],
    define: {
      ...envs,
    }
  });
}
