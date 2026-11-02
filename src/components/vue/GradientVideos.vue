<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';

const MODES = ['vertical', 'horizontal'] as const;
type Mode = (typeof MODES)[number];

const base = import.meta.env.BASE_URL;
const mode = ref<Mode>('vertical');
const verticalEl = ref<HTMLVideoElement | null>(null);
const horizontalEl = ref<HTMLVideoElement | null>(null);
const tablistEl = ref<HTMLElement | null>(null);

function tabId(m: Mode) {
  return `gradient-tab-${m}`;
}

function selectMode(next: Mode) {
  mode.value = next;
}

async function syncPlayback() {
  await nextTick();
  const active = mode.value === 'vertical' ? verticalEl.value : horizontalEl.value;
  const inactive = mode.value === 'vertical' ? horizontalEl.value : verticalEl.value;
  inactive?.pause();
  if (active) {
    active.currentTime = 0;
    // User-controlled: do not autoplay; leave ready for play.
  }
}

function onTabKeydown(event: KeyboardEvent, current: Mode) {
  const index = MODES.indexOf(current);
  const last = MODES.length - 1;
  let nextIndex = index;

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault();
    nextIndex = index === last ? 0 : index + 1;
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault();
    nextIndex = index === 0 ? last : index - 1;
  } else if (event.key === 'Home') {
    event.preventDefault();
    nextIndex = 0;
  } else if (event.key === 'End') {
    event.preventDefault();
    nextIndex = last;
  } else {
    return;
  }

  const next = MODES[nextIndex];
  selectMode(next);
  void nextTick(() => {
    tablistEl.value?.querySelector<HTMLElement>(`#${tabId(next)}`)?.focus();
  });
}

watch(mode, () => {
  void syncPlayback();
});

onMounted(() => {
  verticalEl.value?.pause();
  horizontalEl.value?.pause();
});
</script>

<template>
  <div class="space-y-4">
    <div
      ref="tablistEl"
      class="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Shore gradient videos"
    >
      <button
        type="button"
        role="tab"
        id="gradient-tab-vertical"
        aria-controls="gradient-panel-vertical"
        :aria-selected="mode === 'vertical'"
        :tabindex="mode === 'vertical' ? 0 : -1"
        class="min-h-11 rounded-lg px-4 py-2 text-base font-semibold transition"
        :class="
          mode === 'vertical'
            ? 'bg-tide-700 text-white'
            : 'bg-white text-tide-800 ring-1 ring-tide-900/10 hover:bg-tide-50'
        "
        @click="selectMode('vertical')"
        @keydown="onTabKeydown($event, 'vertical')"
      >
        Vertical gradient
      </button>
      <button
        type="button"
        role="tab"
        id="gradient-tab-horizontal"
        aria-controls="gradient-panel-horizontal"
        :aria-selected="mode === 'horizontal'"
        :tabindex="mode === 'horizontal' ? 0 : -1"
        class="min-h-11 rounded-lg px-4 py-2 text-base font-semibold transition"
        :class="
          mode === 'horizontal'
            ? 'bg-tide-700 text-white'
            : 'bg-white text-tide-800 ring-1 ring-tide-900/10 hover:bg-tide-50'
        "
        @click="selectMode('horizontal')"
        @keydown="onTabKeydown($event, 'horizontal')"
      >
        Horizontal gradient
      </button>
    </div>

    <p class="caption">
      Press play to watch. Only the selected gradient video is active; the other pauses. Use arrow
      keys to switch gradients when a tab is focused.
    </p>

    <div
      v-show="mode === 'vertical'"
      id="gradient-panel-vertical"
      role="tabpanel"
      aria-labelledby="gradient-tab-vertical"
      tabindex="0"
    >
      <video
        ref="verticalEl"
        class="w-full rounded-2xl border border-tide-900/10 bg-black/5 shadow-sm"
        :src="`${base}vertical_gradient.mp4`"
        controls
        playsinline
        preload="metadata"
      >
        Your browser does not support video playback.
      </video>
      <p class="caption mt-2">
        Vertical gradient: tidal height from high shore to low shore.
      </p>
    </div>

    <div
      v-show="mode === 'horizontal'"
      id="gradient-panel-horizontal"
      role="tabpanel"
      aria-labelledby="gradient-tab-horizontal"
      tabindex="0"
    >
      <video
        ref="horizontalEl"
        class="w-full rounded-2xl border border-tide-900/10 bg-black/5 shadow-sm"
        :src="`${base}horizontal_gradient.mp4`"
        controls
        playsinline
        preload="metadata"
      >
        Your browser does not support video playback.
      </video>
      <p class="caption mt-2">
        Horizontal gradient: wave exposure along the shore.
      </p>
    </div>
  </div>
</template>
