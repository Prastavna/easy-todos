import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json" with { type: "json" };

export default defineManifest({
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
  action: {
    default_popup: "popup.html",
    default_title: packageJson.name,
  },
  options_page: "app.html",
});
