<script setup lang="ts">
import { computed } from "vue";
import { useAppConfig } from "../stores/app-config";

const appConfig = useAppConfig();
const theme = computed(() => appConfig.theme);
</script>

<template>
  <UButton
    :icon="theme === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
    color="neutral"
    variant="ghost"
    @click="appConfig.toggleTheme()"
    :title="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`"
    aria-label="Toggle color mode"
  />
</template>