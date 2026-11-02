<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { Chart, SeriesErrorbarOptions, SeriesLineOptions } from 'highcharts';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import {
  computeEffortSeries,
  seriesForSpecies,
  uniqueSpecies,
  type SurveyRecord,
} from '../../lib/surveyStats';
import { applyLightTheme, baseChartOptions } from '../../lib/chartOptions';

const props = withDefaults(
  defineProps<{
    records: SurveyRecord[];
    showTour?: boolean;
    introHtml?: string;
    storageKey?: string;
  }>(),
  { showTour: false, introHtml: '', storageKey: 'vrssu-plot' },
);

type Mode = 'sd' | 'se' | 'both' | 'none';
type HC = typeof import('highcharts');

const STORAGE_TOUR = `${props.storageKey}-tour-dismissed`;

const speciesList = computed(() => uniqueSpecies(props.records));
const selectedSpecies = ref('');
const effortNumber = ref(0);
const mode = ref<Mode>('sd');
const chartsReady = ref(false);
const chartError = ref('');
const tableOpen = ref(false);
const sdEl = ref<HTMLElement | null>(null);
const seEl = ref<HTMLElement | null>(null);

let HighchartsMod: HC | null = null;
let sdChart: Chart | null = null;
let seChart: Chart | null = null;

const speciesSeries = computed(() =>
  selectedSpecies.value ? seriesForSpecies(props.records, selectedSpecies.value) : [],
);
const maxQuadrats = computed(() => speciesSeries.value.length);

function loadPersisted() {
  if (typeof sessionStorage === 'undefined') return;
  try {
    const raw = sessionStorage.getItem(props.storageKey);
    if (!raw) return;
    const saved = JSON.parse(raw) as {
      species?: string;
      effort?: number;
      mode?: Mode;
    };
    if (saved.species) selectedSpecies.value = saved.species;
    if (typeof saved.effort === 'number') effortNumber.value = saved.effort;
    if (saved.mode) mode.value = saved.mode;
  } catch {
    /* ignore corrupt storage */
  }
}

function persist() {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(
    props.storageKey,
    JSON.stringify({
      species: selectedSpecies.value,
      effort: effortNumber.value,
      mode: mode.value,
    }),
  );
}

watch(
  speciesList,
  (list) => {
    if (!list.length) return;
    if (!selectedSpecies.value || !list.includes(selectedSpecies.value)) {
      selectedSpecies.value = list[0];
    }
  },
  { immediate: true },
);

watch(selectedSpecies, () => {
  if (effortNumber.value > maxQuadrats.value) {
    effortNumber.value = maxQuadrats.value;
  }
  persist();
});

watch(maxQuadrats, (max) => {
  if (effortNumber.value > max) effortNumber.value = max;
});

watch([effortNumber, mode], () => {
  persist();
});

const effortStats = computed(() => {
  const counts = speciesSeries.value.slice(0, effortNumber.value).map((d) => d.cnt);
  return computeEffortSeries(counts);
});

const tableRows = computed(() => {
  const means = effortStats.value.means;
  return means.map((mean, i) => {
    const sdBand = effortStats.value.errorSD[i];
    const seBand = effortStats.value.errorSE[i];
    const sd = sdBand ? Math.abs(sdBand[0] - mean) : 0;
    const se = seBand ? Math.abs(seBand[0] - mean) : 0;
    return {
      n: i + 1,
      mean,
      sd,
      se,
      count: speciesSeries.value[i]?.cnt ?? 0,
    };
  });
});

const latest = computed(() => {
  const rows = tableRows.value;
  return rows.length ? rows[rows.length - 1] : null;
});

const titleHtml = computed(() =>
  selectedSpecies.value
    ? `Sampling effort for <span class="species-name">${selectedSpecies.value}</span>`
    : 'Select a species to begin',
);

const modeLabel = computed(() => {
  switch (mode.value) {
    case 'sd':
      return 'mean ± SD';
    case 'se':
      return 'mean ± SE';
    case 'both':
      return 'mean ± SD and ± SE';
    default:
      return 'hidden plots';
  }
});

const chartSummary = computed(() => {
  if (!selectedSpecies.value || !latest.value || effortNumber.value === 0) {
    return 'No sampling effort selected yet. Choose a species and increase the number of quadrats.';
  }
  const { mean, sd, se } = latest.value;
  return (
    `For ${selectedSpecies.value} with ${effortNumber.value} quadrat` +
    `${effortNumber.value === 1 ? '' : 's'}, the running mean is ${mean.toFixed(2)}` +
    ` (SD ${sd.toFixed(2)}, SE ${se.toFixed(2)}). ` +
    `Currently showing ${modeLabel.value}. Use the export menu on each chart to download an image or CSV.`
  );
});

async function ensureHighcharts() {
  if (HighchartsMod) return HighchartsMod;
  const mod = await import('highcharts');
  HighchartsMod = (mod.default ?? mod) as HC;
  await import('highcharts/highcharts-more');
  await import('highcharts/modules/exporting');
  await import('highcharts/modules/export-data');
  await import('highcharts/modules/accessibility');
  await import('highcharts/modules/no-data-to-display');
  applyLightTheme(HighchartsMod);
  return HighchartsMod;
}

async function renderCharts() {
  if (typeof window === 'undefined') return;
  await nextTick();

  if (mode.value === 'none') {
    sdChart?.destroy();
    seChart?.destroy();
    sdChart = null;
    seChart = null;
    chartsReady.value = true;
    return;
  }

  try {
    const HC = await ensureHighcharts();
    chartError.value = '';

    if (mode.value === 'sd' || mode.value === 'both') {
      const opts = baseChartOptions('Mean (± SD)', mode.value === 'both' ? 280 : 420);
      opts.title = { text: titleHtml.value, useHTML: true };
      if (opts.series?.[0] && 'data' in opts.series[0]) {
        (opts.series[0] as SeriesLineOptions).data = [...effortStats.value.means];
      }
      if (opts.series?.[1] && 'data' in opts.series[1]) {
        (opts.series[1] as SeriesErrorbarOptions).data = [...effortStats.value.errorSD];
      }
      if (sdEl.value) {
        if (sdChart) {
          sdChart.update(opts, true, true);
        } else {
          sdChart = HC.chart(sdEl.value, opts);
        }
      }
    } else if (sdChart) {
      sdChart.destroy();
      sdChart = null;
    }

    if (mode.value === 'se' || mode.value === 'both') {
      const opts = baseChartOptions('Mean (± SE)', mode.value === 'both' ? 280 : 420);
      opts.title = {
        text: mode.value === 'both' ? undefined : titleHtml.value,
        useHTML: true,
      };
      if (opts.series?.[0] && 'data' in opts.series[0]) {
        (opts.series[0] as SeriesLineOptions).data = [...effortStats.value.means];
      }
      if (opts.series?.[1] && 'data' in opts.series[1]) {
        (opts.series[1] as SeriesErrorbarOptions).data = [...effortStats.value.errorSE];
      }
      if (seEl.value) {
        if (seChart) {
          seChart.update(opts, true, true);
        } else {
          seChart = HC.chart(seEl.value, opts);
        }
      }
    } else if (seChart) {
      seChart.destroy();
      seChart = null;
    }

    chartsReady.value = true;
  } catch (err) {
    chartError.value = err instanceof Error ? err.message : 'Failed to load charts.';
    chartsReady.value = true;
  }
}

watch([mode, effortStats, titleHtml], () => {
  void renderCharts();
});

function bump(delta: number) {
  effortNumber.value = Math.min(maxQuadrats.value, Math.max(0, effortNumber.value + delta));
}

function setMode(next: Mode) {
  mode.value = next;
}

function downloadActiveChart() {
  const chart = mode.value === 'se' ? seChart : sdChart ?? seChart;
  if (!chart || typeof chart.exportChart !== 'function') {
    chartError.value =
      'Show a plot first, then use Download chart PNG or the chart menu (☰) to export.';
    return;
  }
  chartError.value = '';
  chart.exportChart(
    {
      type: 'image/png',
      filename: `vrssu-${(selectedSpecies.value || 'plot').replace(/\s+/g, '_')}`,
    },
    {},
  );
}

function maybeStartTour() {
  if (!props.showTour) return;
  if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(STORAGE_TOUR) === '1') {
    return;
  }
  const d = driver({
    showProgress: true,
    onDestroyed: () => {
      sessionStorage.setItem(STORAGE_TOUR, '1');
    },
    steps: [
      {
        element: '#introStep1',
        popover: { title: '① Select species', description: 'Choose a target species from the list.' },
      },
      {
        element: '#introStep2',
        popover: {
          title: '② Set sampling effort',
          description: 'Increase the number of quadrats with +/− or type a value.',
        },
      },
      {
        element: '#introStep3',
        popover: {
          title: '③ Choose a plot type',
          description: 'Show mean ± SD, ± SE, or both. Plots update as you change effort.',
        },
      },
    ],
  });
  d.drive();
}

onMounted(() => {
  loadPersisted();
  if (!selectedSpecies.value && speciesList.value.length) {
    selectedSpecies.value = speciesList.value[0];
  }
  if (effortNumber.value === 0 && maxQuadrats.value > 0) {
    effortNumber.value = Math.min(5, maxQuadrats.value);
  }
  void renderCharts().then(maybeStartTour);
});

onBeforeUnmount(() => {
  sdChart?.destroy();
  seChart?.destroy();
  sdChart = null;
  seChart = null;
});
</script>

<template>
  <div class="space-y-6">
    <div v-if="introHtml" class="prose-edu" v-html="introHtml" />

    <p
      v-if="!records.length"
      class="rounded-xl border border-dashed border-tide-900/20 bg-white px-4 py-6 text-base text-muted"
    >
      No survey records are loaded yet.
    </p>

    <ol v-else class="space-y-4">
      <li id="introStep1" class="panel space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="flex h-7 w-7 items-center justify-center rounded-full bg-tide-700 text-sm font-bold text-white"
            aria-hidden="true"
          >1</span>
          <p class="text-sm font-bold uppercase tracking-[0.12em] text-tide-600">Choose species</p>
        </div>
        <label for="species-select" class="block text-lg font-semibold text-tide-900">
          Target species
        </label>
        <select
          id="species-select"
          v-model="selectedSpecies"
          class="species-name w-full max-w-xl rounded-lg border border-tide-900/15 bg-white px-3 py-3 text-base"
        >
          <option v-for="name in speciesList" :key="name" :value="name" class="species-name">
            {{ name }}
          </option>
        </select>
        <p class="caption">{{ speciesList.length }} species available in this dataset.</p>
      </li>

      <li id="introStep2" class="panel space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="flex h-7 w-7 items-center justify-center rounded-full bg-tide-700 text-sm font-bold text-white"
            aria-hidden="true"
          >2</span>
          <p class="text-sm font-bold uppercase tracking-[0.12em] text-tide-600">Sampling effort</p>
        </div>
        <label for="effort" class="block text-lg font-semibold text-tide-900">
          Number of quadrats to include
        </label>
        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            class="btn-secondary min-w-12 px-4 py-3"
            aria-label="Decrease sampling effort by one quadrat"
            @click="bump(-1)"
          >
            −
          </button>
          <input
            id="effort"
            v-model.number="effortNumber"
            type="number"
            min="0"
            :max="maxQuadrats"
            class="w-24 rounded-lg border border-tide-900/15 px-2 py-3 text-center text-lg"
          />
          <button
            type="button"
            class="btn-secondary min-w-12 px-4 py-3"
            aria-label="Increase sampling effort by one quadrat"
            @click="bump(1)"
          >
            +
          </button>
          <span class="text-base text-muted">of {{ maxQuadrats }} available</span>
        </div>
        <input
          class="mt-1 w-full max-w-xl accent-tide-700"
          type="range"
          min="0"
          :max="maxQuadrats"
          :value="effortNumber"
          aria-label="Sampling effort slider"
          @input="effortNumber = Number(($event.target as HTMLInputElement).value)"
        />
        <p class="caption">
          Watch how the running mean and uncertainty change as you include more quadrats.
        </p>
      </li>

      <li id="introStep3" class="panel space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="flex h-7 w-7 items-center justify-center rounded-full bg-tide-700 text-sm font-bold text-white"
            aria-hidden="true"
          >3</span>
          <p class="text-sm font-bold uppercase tracking-[0.12em] text-tide-600">Plot type</p>
        </div>
        <p id="plot-type-label" class="text-lg font-semibold text-tide-900">Display</p>
        <div
          class="flex flex-wrap gap-2"
          role="group"
          aria-labelledby="plot-type-label"
        >
          <button
            type="button"
            :aria-pressed="mode === 'sd'"
            :class="[
              mode === 'sd' ? 'btn-primary ring-2 ring-offset-2 ring-tide-600' : 'btn-secondary',
            ]"
            @click="setMode('sd')"
          >
            Mean ± SD
          </button>
          <button
            type="button"
            :aria-pressed="mode === 'se'"
            :class="[
              mode === 'se' ? 'btn-primary ring-2 ring-offset-2 ring-tide-600' : 'btn-secondary',
            ]"
            @click="setMode('se')"
          >
            Mean ± SE
          </button>
          <button
            type="button"
            :aria-pressed="mode === 'both'"
            :class="[
              mode === 'both' ? 'btn-primary ring-2 ring-offset-2 ring-tide-600' : 'btn-secondary',
            ]"
            @click="setMode('both')"
          >
            Show both
          </button>
          <button
            type="button"
            :aria-pressed="mode === 'none'"
            :class="[
              mode === 'none' ? 'btn-primary ring-2 ring-offset-2 ring-tide-600' : 'btn-ghost',
            ]"
            @click="setMode('none')"
          >
            Hide plots
          </button>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="text-base text-muted">
            Showing
            <template v-if="mode !== 'none'"> {{ modeLabel }} for </template>
            <span v-if="selectedSpecies" class="species-name">{{ selectedSpecies }}</span>
            <template v-else> a species</template>
            · {{ effortNumber }} quadrats
          </p>
          <button
            type="button"
            class="btn-secondary"
            :disabled="mode === 'none' || !effortNumber"
            @click="downloadActiveChart"
          >
            Download chart PNG
          </button>
        </div>
      </li>
    </ol>

    <p v-if="!chartsReady && mode !== 'none' && records.length" class="caption animate-pulse">
      Loading charts…
    </p>
    <p v-if="chartError" class="rounded-lg border border-coral/30 bg-sand-100/70 px-4 py-3 text-base text-ink" role="alert">
      {{ chartError }}
    </p>

    <p class="sr-only" aria-live="polite">{{ chartSummary }}</p>

    <div
      v-if="mode !== 'none' && latest"
      class="rounded-xl border border-tide-900/10 bg-tide-50 px-4 py-3 text-sm leading-relaxed text-ink/90 md:text-base"
      aria-hidden="false"
    >
      <p class="text-xs font-bold uppercase tracking-[0.12em] text-tide-600">Chart summary</p>
      <p class="mt-1">{{ chartSummary }}</p>
    </div>

    <div
      v-show="mode === 'sd' || mode === 'both'"
      class="overflow-x-auto rounded-2xl border border-tide-900/10 bg-white p-3 shadow-sm"
    >
      <div ref="sdEl" />
    </div>
    <div
      v-show="mode === 'se' || mode === 'both'"
      class="overflow-x-auto rounded-2xl border border-tide-900/10 bg-white p-3 shadow-sm"
    >
      <div ref="seEl" />
    </div>
    <p v-if="mode === 'none'" class="text-base text-muted">
      Choose a plot type above to visualise how mean ± SD / SE change with sampling effort.
    </p>

    <details
      v-if="tableRows.length"
      class="panel"
      :open="tableOpen"
      @toggle="tableOpen = ($event.target as HTMLDetailsElement).open"
    >
      <summary class="cursor-pointer list-none font-semibold text-tide-900 marker:content-none [&::-webkit-details-marker]:hidden">
        Data table for screen readers and lab notes
        <span class="ml-2 text-sm font-medium text-muted">({{ tableRows.length }} rows)</span>
      </summary>
      <div class="mt-4 overflow-x-auto">
        <table class="w-full min-w-[28rem] border-collapse text-left text-sm">
          <caption class="caption mb-2 text-left">
            Running mean, SD, and SE as quadrats are added for
            <span class="species-name">{{ selectedSpecies }}</span>.
          </caption>
          <thead>
            <tr class="bg-tide-50">
              <th scope="col" class="border border-tide-900/15 px-3 py-2">Quadrats (n)</th>
              <th scope="col" class="border border-tide-900/15 px-3 py-2">Quadrat count</th>
              <th scope="col" class="border border-tide-900/15 px-3 py-2">Running mean</th>
              <th scope="col" class="border border-tide-900/15 px-3 py-2">SD</th>
              <th scope="col" class="border border-tide-900/15 px-3 py-2">SE</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.n">
              <th scope="row" class="border border-tide-900/15 px-3 py-2 font-medium">{{ row.n }}</th>
              <td class="border border-tide-900/15 px-3 py-2">{{ row.count }}</td>
              <td class="border border-tide-900/15 px-3 py-2">{{ row.mean.toFixed(3) }}</td>
              <td class="border border-tide-900/15 px-3 py-2">{{ row.sd.toFixed(3) }}</td>
              <td class="border border-tide-900/15 px-3 py-2">{{ row.se.toFixed(3) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </div>
</template>
