import { useColorMode } from "@vueuse/core";
import { defineStore } from "pinia";

export type Theme = "light" | "dark";

interface AppConfigState {
	theme: Theme;
}

export const useAppConfig = defineStore("app-config", {
	state: (): AppConfigState => ({
		theme: "light",
	}),
	persist: true,
	actions: {
		toggleTheme() {
			const newTheme = this.theme === "light" ? "dark" : "light";
			useColorMode().value = newTheme;
			this.theme = newTheme;
		},
	},
});
