<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';

export type Step = {
  title: string;
  html?: string;
  images?: { src: string; alt?: string }[];
};

const props = withDefaults(
  defineProps<{
    steps: Step[];
    nextHref?: string;
    nextLabel?: string;
    storageKey?: string;
  }>(),
  { storageKey: 'vrssu-stepper' },
);

const index = ref(0);
const panelEl = ref<HTMLElement | null>(null);
const tablistEl = ref<HTMLElement | null>(null);
let ready = false;

const uid = `stepper-${props.storageKey.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
const panelId = computed(() => `${uid}-panel`);
const tabId = (i: number) => `${uid}-tab-${i}`;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function loadPersisted() {
  if (typeof sessionStorage === 'undefined') return;
  try {
    const raw = sessionStorage.getItem(props.storageKey);
    if (!raw) return;
    const saved = JSON.parse(raw) as { index?: number };
    if (typeof saved.index === 'number' && saved.index >= 0 && saved.index < props.steps.length) {
      index.value = saved.index;
    }
  } catch {
    /* ignore */
  }
}

function persist() {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(props.storageKey, JSON.stringify({ index: index.value }));
}

function prev() {
  index.value = Math.max(0, index.value - 1);
}
function next() {
  index.value = Math.min(props.steps.length - 1, index.value + 1);
}

function selectStep(i: number) {
  if (i < 0 || i >= props.steps.length) return;
  index.value = i;
}

async function scrollToPanel() {
  await nextTick();
  panelEl.value?.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
}

function onTabKeydown(event: KeyboardEvent, i: number) {
  const last = props.steps.length - 1;
  let nextIndex = i;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault();
    nextIndex = i === last ? 0 : i + 1;
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault();
    nextIndex = i === 0 ? last : i - 1;
  } else if (event.key === 'Home') {
    event.preventDefault();
    nextIndex = 0;
  } else if (event.key === 'End') {
    event.preventDefault();
    nextIndex = last;
  } else {
    return;
  }
  selectStep(nextIndex);
  void nextTick(() => {
    tablistEl.value?.querySelector<HTMLElement>(`#${tabId(nextIndex)}`)?.focus();
  });
}

watch(index, () => {
  persist();
  if (ready) void scrollToPanel();
});

onMounted(() => {
  loadPersisted();
  ready = true;
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm font-bold uppercase tracking-[0.14em] text-tide-600">
        Step {{ index + 1 }} of {{ steps.length }}
      </p>
      <div
        class="h-2 w-32 overflow-hidden rounded-full bg-tide-100"
        role="progressbar"
        :aria-valuenow="index + 1"
        aria-valuemin="1"
        :aria-valuemax="steps.length"
        :aria-label="`Step ${index + 1} of ${steps.length}`"
      >
        <div
          class="h-full rounded-full bg-tide-600 transition-[width]"
          :style="{ width: `${((index + 1) / steps.length) * 100}%` }"
        />
      </div>
    </div>

    <div
      ref="tablistEl"
      class="-mx-1 overflow-x-auto px-1 pb-1"
      role="tablist"
      aria-label="Steps"
    >
      <div class="flex min-w-max gap-2">
        <button
          v-for="(step, i) in steps"
          :id="tabId(i)"
          :key="step.title"
          type="button"
          role="tab"
          :aria-selected="i === index"
          :aria-controls="panelId"
          :tabindex="i === index ? 0 : -1"
          class="min-h-11 max-w-[16rem] truncate rounded-lg px-3 py-2 text-left text-sm font-semibold sm:text-base"
          :class="
            i === index
              ? 'bg-tide-700 text-white'
              : 'bg-white text-tide-800 ring-1 ring-tide-900/10 hover:bg-tide-50'
          "
          @click="selectStep(i)"
          @keydown="onTabKeydown($event, i)"
        >
          <span class="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs" :class="i === index ? 'bg-white/20' : 'bg-tide-100 text-tide-800'" aria-hidden="true">
            {{ i + 1 }}
          </span>
          {{ step.title }}
        </button>
      </div>
    </div>

    <article
      :id="panelId"
      ref="panelEl"
      class="panel space-y-4 scroll-mt-28"
      role="tabpanel"
      :aria-labelledby="tabId(index)"
      tabindex="0"
    >
      <h2 class="section-title">{{ steps[index].title }}</h2>
      <div v-if="steps[index].html" class="prose-edu" v-html="steps[index].html" />
      <div
        v-if="steps[index].images?.length"
        class="grid gap-3 sm:grid-cols-2"
      >
        <figure
          v-for="(img, i) in steps[index].images"
          :key="i"
          class="overflow-hidden rounded-xl border border-tide-900/10"
        >
          <img
            :src="img.src"
            :alt="img.alt || steps[index].title"
            class="h-auto w-full object-contain"
            loading="lazy"
          />
        </figure>
      </div>
    </article>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <button type="button" class="btn-secondary" :disabled="index === 0" @click="prev">
        Back
      </button>
      <button
        v-if="index < steps.length - 1"
        type="button"
        class="btn-primary"
        @click="next"
      >
        Continue
      </button>
      <a
        v-else-if="nextHref"
        class="btn-primary"
        :href="nextHref"
      >
        {{ nextLabel || 'Next section' }}
      </a>
    </div>
  </div>
</template>
