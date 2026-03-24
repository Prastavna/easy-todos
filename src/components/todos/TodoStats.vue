<script setup lang="ts">
defineProps<{
  activeCount: number
  dueTodayCount: number
  overdueCount: number
}>()
</script>

<template>
  <section class="rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-[0_20px_80px_-40px_rgba(10,61,72,0.45)] backdrop-blur xl:p-6">
    <div class="grid gap-3 sm:grid-cols-3">
      <div class="rounded-2xl border border-teal-100 bg-teal-50/80 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.24em] text-teal-700">Active</p>
        <p class="mt-2 text-3xl font-semibold text-slate-900">{{ activeCount }}</p>
      </div>
      <div class="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.24em] text-amber-700">Due today</p>
        <p class="mt-2 text-3xl font-semibold text-slate-900">{{ dueTodayCount }}</p>
      </div>
      <div class="rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3">
        <p class="text-xs uppercase tracking-[0.24em] text-rose-700">Overdue</p>
        <p class="mt-2 text-3xl font-semibold text-slate-900">{{ overdueCount }}</p>
      </div>
    </div>
  </section>
</template>
