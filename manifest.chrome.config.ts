import type { ManifestV3Export } from "@crxjs/vite-plugin";

import manifestConfig from "./manifest.config";

export default {
  ...manifestConfig,
} satisfies ManifestV3Export;
