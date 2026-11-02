<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { parseSurveyExcel } from '../../lib/excelSurvey';
import type { SurveyRecord } from '../../lib/surveyStats';
import SamplingPlotPanel from './SamplingPlotPanel.vue';

const UPLOAD_KEY = 'vrssu-upload-session';
const TOUR_KEY = 'vrssu-upload-tour-dismissed';
const base = import.meta.env.BASE_URL;
const records = ref<SurveyRecord[]>([]);
const error = ref('');
const fileName = ref('');
const loading = ref(false);
const success = ref('');

const speciesCount = computed(
  () => new Set(records.value.map((r) => r.name)).size,
);

function persistUpload() {
  if (typeof sessionStorage === 'undefined') return;
  if (!records.value.length) {
    sessionStorage.removeItem(UPLOAD_KEY);
    return;
  }
  sessionStorage.setItem(
    UPLOAD_KEY,
    JSON.stringify({ fileName: fileName.value, records: records.value }),
  );
}

function restoreUpload() {
  if (typeof sessionStorage === 'undefined') return;
  try {
    const raw = sessionStorage.getItem(UPLOAD_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as { fileName?: string; records?: SurveyRecord[] };
    if (Array.isArray(saved.records) && saved.records.length) {
      records.value = saved.records;
      fileName.value = saved.fileName || 'Previous upload';
      success.value = `Restored ${fileName.value} from this browser session.`;
    }
  } catch {
    sessionStorage.removeItem(UPLOAD_KEY);
  }
}

function clearUpload() {
  records.value = [];
  fileName.value = '';
  error.value = '';
  success.value = '';
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(UPLOAD_KEY);
  }
}

async function onFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  error.value = '';
  success.value = '';
  loading.value = true;
  fileName.value = file.name;

  try {
    records.value = await parseSurveyExcel(file);
    if (!records.value.length) {
      error.value =
        'No species rows found. Use the template format: a Species name column plus Q1, Q2, … count columns.';
      sessionStorage.removeItem(UPLOAD_KEY);
    } else {
      persistUpload();
      success.value = `Loaded ${speciesCount.value} species from ${file.name}. Continue with the plot steps below.`;
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to parse spreadsheet.';
    records.value = [];
    sessionStorage.removeItem(UPLOAD_KEY);
  } finally {
    loading.value = false;
    input.value = '';
  }
}

function maybeStartTour() {
  if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(TOUR_KEY) === '1') {
    return;
  }
  if (records.value.length) return;
  const d = driver({
    showProgress: true,
    onDestroyed: () => {
      sessionStorage.setItem(TOUR_KEY, '1');
    },
    steps: [
      {
        element: '#upload-step-template',
        popover: {
          title: '① Download the template',
          description: 'Start from the survey template so species rows and quadrat columns match the parser.',
        },
      },
      {
        element: '#upload-step-file',
        popover: {
          title: '② Upload your .xlsx',
          description: 'Your file is parsed in this browser and is not sent to a server.',
        },
      },
    ],
  });
  window.setTimeout(() => d.drive(), 400);
}

onMounted(() => {
  restoreUpload();
  maybeStartTour();
});
</script>

<template>
  <div class="space-y-6">
    <ol class="space-y-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
      <li id="upload-step-template" class="panel space-y-3">
        <div class="flex items-center gap-2">
          <span
            class="flex h-7 w-7 items-center justify-center rounded-full bg-tide-700 text-sm font-bold text-white"
            aria-hidden="true"
          >1</span>
          <h2 class="section-title text-xl md:text-2xl">Download template</h2>
        </div>
        <p class="text-base text-muted md:text-lg">
          Use the survey template so columns match the expected format (species rows × quadrat
          columns).
        </p>
        <ul class="caption list-disc space-y-1 pl-5">
          <li>One row per species</li>
          <li>Columns named Q1, Q2, Q3… for quadrat counts</li>
          <li>Empty cells are treated as zero</li>
        </ul>
        <a
          class="btn-secondary mt-2"
          :href="`${base}dataTemplate/Survey template_demo.xlsx`"
          download
        >
          Download survey template
        </a>
      </li>

      <li id="upload-step-file" class="panel space-y-3">
        <div class="flex items-center gap-2">
          <span
            class="flex h-7 w-7 items-center justify-center rounded-full bg-tide-700 text-sm font-bold text-white"
            aria-hidden="true"
          >2</span>
          <h2 class="section-title text-xl md:text-2xl">Upload your data</h2>
        </div>
        <p class="text-base text-muted md:text-lg">
          Upload a filled <code>.xlsx</code> file. Parsing stays in your browser for this session.
        </p>
        <div class="mt-2 flex flex-wrap items-center gap-3">
          <label class="btn-primary cursor-pointer">
            <input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" class="sr-only" @change="onFile" />
            Choose Excel file
          </label>
          <button
            v-if="records.length"
            type="button"
            class="btn-ghost"
            @click="clearUpload"
          >
            Clear upload
          </button>
        </div>
        <p v-if="fileName" class="caption">Selected: {{ fileName }}</p>
        <p v-if="loading" class="text-base text-tide-700" aria-live="polite">Parsing spreadsheet…</p>
        <p
          v-if="error"
          class="rounded-lg border border-coral/30 bg-sand-100/70 px-3 py-2 text-base text-ink"
          role="alert"
        >
          {{ error }}
        </p>
        <p
          v-if="success && !error"
          class="rounded-lg border border-kelp/30 bg-tide-50 px-3 py-2 text-base text-tide-950"
          role="status"
          aria-live="polite"
        >
          {{ success }}
        </p>
      </li>
    </ol>

    <div
      v-if="!records.length && !loading && !error"
      class="rounded-2xl border border-dashed border-tide-900/20 bg-white px-5 py-8 text-center"
    >
      <p class="font-display text-xl font-semibold text-tide-950">No survey loaded yet</p>
      <p class="mt-2 text-base text-muted">
        Download the template, enter your quadrat counts, then upload the file to unlock the plot
        workflow.
      </p>
    </div>

    <section v-if="records.length" aria-labelledby="upload-plot-heading">
      <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="text-sm font-bold uppercase tracking-[0.12em] text-tide-600">Step 3</p>
          <h2 id="upload-plot-heading" class="section-title text-xl md:text-2xl">
            Explore sampling effort
          </h2>
        </div>
        <p class="caption">
          {{ speciesCount }} species · {{ records.length }} quadrat records
        </p>
      </div>
      <SamplingPlotPanel
        :records="records"
        show-tour
        storage-key="vrssu-plot-upload"
      />
    </section>
  </div>
</template>
