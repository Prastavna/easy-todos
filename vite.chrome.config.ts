import { crx } from "@crxjs/vite-plugin";
import { defineConfig, mergeConfig } from "vite";

import manifest from "./manifest.chrome.config";
import baseConfig from "./vite.config";

const browser = "chrome";

export default defineConfig(() =>
  mergeConfig(baseConfig, {
    build: {
      outDir: `dist/${browser}`,
    },
    plugins: [
      crx({
        manifest,
        browser,
      }),
    ],
  }),
);
