import type { ManifestV3Export } from "@crxjs/vite-plugin";
import packageJson from "./package.json" with { type: "json" };

export default {
  manifest_version: 3,
  name: packageJson.name,
  description: packageJson.description,
  version: packageJson.version,
  icons: {
    16: "icons/icon16.png",
    32: "icons/icon32.png",
    48: "icons/icon48.png",
    128: "icons/icon128.png"
  },
  permissions: ["storage"],
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
  action: {
    default_popup: "popup.html",
    default_title: packageJson.name,
  },
  options_page: "app.html",
} satisfies ManifestV3Export;
