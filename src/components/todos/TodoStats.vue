<script setup lang="ts">
const props = defineProps<{
  activeCount: number
  dueTodayCount: number
  overdueCount: number
  compact?: boolean
}>()
</script>

<template>
  <section :class="props.compact ? '' : 'rounded-4xl border border-white/70 bg-white/85 p-4 shadow-[0_20px_80px_-40px_rgba(10,61,72,0.45)] backdrop-blur xl:p-6'">
    <div :class="props.compact ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-3 gap-2 sm:gap-3'">
      <div :class="props.compact ? 'rounded-2xl border border-teal-100 bg-teal-50/78 px-3 py-2.5' : 'rounded-2xl border border-teal-100 bg-teal-50/80 px-4 py-3'">
        <p class="text-xxs uppercase tracking-[0.22em] text-teal-700">Active</p>
        <p :class="props.compact ? 'mt-1 text-2xl font-semibold leading-none text-slate-900' : 'mt-2 text-3xl font-semibold text-slate-900'">{{ props.activeCount }}</p>
      </div>
      <div :class="props.compact ? 'rounded-2xl border border-amber-100 bg-amber-50/78 px-3 py-2.5' : 'rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3'">
        <p class="text-xxs uppercase tracking-[0.22em] text-amber-700">Due today</p>
        <p :class="props.compact ? 'mt-1 text-2xl font-semibold leading-none text-slate-900' : 'mt-2 text-3xl font-semibold text-slate-900'">{{ props.dueTodayCount }}</p>
      </div>
      <div :class="props.compact ? 'rounded-2xl border border-rose-100 bg-rose-50/78 px-3 py-2.5' : 'rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3'">
        <p class="text-xxs uppercase tracking-[0.22em] text-rose-700">Overdue</p>
        <p :class="props.compact ? 'mt-1 text-2xl font-semibold leading-none text-slate-900' : 'mt-2 text-3xl font-semibold text-slate-900'">{{ props.overdueCount }}</p>
      </div>
    </div>
  </section>
</template>
