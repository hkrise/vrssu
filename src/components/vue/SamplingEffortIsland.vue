<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { howToExplore } from '../../data/copy';
import type { SurveyRecord } from '../../lib/surveyStats';
import SamplingPlotPanel from './SamplingPlotPanel.vue';

const records = ref<SurveyRecord[] | null>(null);
const error = ref('');

onMounted(async () => {
  try {
    const mod = await import('../../data/taitam.json');
    records.value = mod.default as SurveyRecord[];
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load sample data.';
  }
});
</script>

<template>
  <div>
    <p v-if="!records && !error" class="caption animate-pulse">Loading Tai Tam sample data…</p>
    <p v-if="error" class="text-base text-red-700">{{ error }}</p>
    <SamplingPlotPanel
      v-if="records"
      :records="records"
      :show-tour="true"
      :intro-html="howToExplore.textBeforePlot"
      storage-key="vrssu-plot-taitam"
    />
  </div>
</template>
