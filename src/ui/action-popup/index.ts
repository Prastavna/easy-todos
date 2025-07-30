import ui from "@nuxt/ui/vue-plugin";
import { createApp } from "vue";
import { appRouter } from "../../router";
import { pinia } from "../../utils/pinia";
import App from "./App.vue";
import "./index.css";

appRouter.addRoute({
	path: "/",
	name: "Home",
	component: () => import("./views/Home.vue"),
});
appRouter.addRoute({
	path: "/settings",
	name: "Settings",
	component: () => import("./views/Settings.vue"),
});

const app = createApp(App).use(ui).use(pinia).use(appRouter);
app.mount("#app");
