import type { ManifestV3Export } from "@crxjs/vite-plugin";

import manifestConfig from "./manifest.config";

export default {
  ...manifestConfig,
  background: {
    scripts: ["src/background.ts"],
    type: "module",
    persistent: false,
  },
} satisfies ManifestV3Export;
