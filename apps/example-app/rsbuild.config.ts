import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { hiveFormPlugin } from 'hiveform/plugin';

export default defineConfig({
  plugins: [
    pluginReact(),
    hiveFormPlugin({
      debug: true, // Enable debug logging
    }),
  ],
});
