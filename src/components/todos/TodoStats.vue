<script setup lang="ts">
const props = defineProps<{
  activeCount: number;
  dueTodayCount: number;
  overdueCount: number;
}>();
</script>

<template>
  <section
    class="sm:rounded-4xl sm:border sm:border-white/70 sm:bg-white/85 sm:p-4 sm:shadow-[0_20px_80px_-40px_rgba(10,61,72,0.45)] sm:backdrop-blur xl:p-6"
  >
    <div class="grid grid-cols-3 gap-2 sm:gap-3">
      <div
        class="rounded-2xl border border-teal-100 bg-teal-50/78 px-3 py-2 sm:bg-teal-50/80 sm:px-4 sm:py-2.5"
      >
        <p class="text-xxs uppercase tracking-[0.22em] text-teal-700">Active</p>
        <p
          class="mt-0.5 text-xl font-semibold leading-none text-slate-900 sm:mt-1 sm:text-2xl sm:leading-normal"
        >
          {{ props.activeCount }}
        </p>
      </div>
      <div
        class="rounded-2xl border border-amber-100 bg-amber-50/78 px-3 py-2 sm:bg-amber-50/80 sm:px-4 sm:py-2.5"
      >
        <p class="text-xxs uppercase tracking-[0.22em] text-amber-700">Due today</p>
        <p
          class="mt-0.5 text-xl font-semibold leading-none text-slate-900 sm:mt-1 sm:text-2xl sm:leading-normal"
        >
          {{ props.dueTodayCount }}
        </p>
      </div>
      <div
        class="rounded-2xl border border-rose-100 bg-rose-50/78 px-3 py-2 sm:bg-rose-50/80 sm:px-4 sm:py-2.5"
      >
        <p class="text-xxs uppercase tracking-[0.22em] text-rose-700">Overdue</p>
        <p
          class="mt-0.5 text-xl font-semibold leading-none text-slate-900 sm:mt-1 sm:text-2xl sm:leading-normal"
        >
          {{ props.overdueCount }}
        </p>
      </div>
    </div>
  </section>
</template>
