import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
	manifest_version: 3,
	name: "Easy Todos",
	version: "0.0.1",
	action: {
		default_popup: "src/ui/action-popup/index.html",
	},
	permissions: ["storage"],
	host_permissions: ["<all_urls>"],
	content_security_policy: {
		extension_pages:
			"script-src 'self' http://localhost:5173; worker-src 'self' http://localhost:5173; connect-src 'self' https://api.iconify.design https://api.simplesvg.com ws://localhost:5173 http://localhost:5173; object-src 'self'; style-src 'self' 'unsafe-inline';",
	},

	web_accessible_resources: [{
		resources: [
			"src/ui/action-popup/index.html",
			"src/ui/action-popup/index.css",
			"src/ui/action-popup/index.ts",
			"*.worker.js"
		],
		matches: ["<all_urls>"],
		use_dynamic_url: true,
	}]
});
