<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

export type SpeciesGroup = {
  key: string;
  name: string;
  items: { name: string; src: string }[];
};

const STORAGE_KEY = 'vrssu-species-group';

/** Group-level field-guide cues only — no invented species-specific traits. */
const GROUP_META: Record<
  string,
  { mobility: string; measure: string; tip: string }
> = {
  algae: {
    mobility: 'Sessile',
    measure: 'Percentage cover',
    tip: 'Score cover of the rock surface inside the quadrat.',
  },
  barnacles: {
    mobility: 'Sessile',
    measure: 'Percentage cover',
    tip: 'Dense colonies are usually scored as cover, not individuals.',
  },
  bivalves: {
    mobility: 'Sessile / attached',
    measure: 'Percentage cover or counts',
    tip: 'Use cover for dense patches; follow your protocol for discrete individuals.',
  },
  chitons: {
    mobility: 'Mobile',
    measure: 'Individual counts',
    tip: 'Count individuals fully contained within the quadrat.',
  },
  crabs: {
    mobility: 'Mobile',
    measure: 'Individual counts',
    tip: 'Count individuals fully contained within the quadrat.',
  },
  cyanobacteria: {
    mobility: 'Sessile',
    measure: 'Percentage cover',
    tip: 'Score cover of the rock surface inside the quadrat.',
  },
  gastropods: {
    mobility: 'Mobile',
    measure: 'Individual counts',
    tip: 'Count individuals fully contained within the quadrat.',
  },
  isopods: {
    mobility: 'Mobile',
    measure: 'Individual counts',
    tip: 'Count individuals fully contained within the quadrat.',
  },
};

const props = defineProps<{ groups: SpeciesGroup[] }>();
const active = ref(props.groups[0]?.key ?? '');
const query = ref('');
const galleryEl = ref<HTMLElement | null>(null);
const tablistEl = ref<HTMLElement | null>(null);
let viewer: Viewer | null = null;

const activeGroup = computed(
  () => props.groups.find((g) => g.key === active.value) ?? props.groups[0],
);

function groupTabId(key: string) {
  return `species-group-tab-${key}`;
}

function selectGroup(key: string) {
  if (!props.groups.some((g) => g.key === key)) return;
  active.value = key;
}

function onGroupTabKeydown(event: KeyboardEvent, key: string) {
  const keys = props.groups.map((g) => g.key);
  const index = keys.indexOf(key);
  if (index < 0) return;
  const last = keys.length - 1;
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

  const nextKey = keys[nextIndex];
  selectGroup(nextKey);
  void nextTick(() => {
    tablistEl.value?.querySelector<HTMLElement>(`#${groupTabId(nextKey)}`)?.focus();
  });
}

const meta = computed(() => GROUP_META[active.value] ?? null);

const filteredItems = computed(() => {
  const items = activeGroup.value?.items ?? [];
  const q = query.value.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => item.name.toLowerCase().includes(q));
});

function loadPersisted() {
  if (typeof sessionStorage === 'undefined') return;
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (saved && props.groups.some((g) => g.key === saved)) {
    active.value = saved;
  }
}

function persist() {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, active.value);
}

function refreshViewer() {
  viewer?.destroy();
  viewer = null;
  if (galleryEl.value) {
    viewer = new Viewer(galleryEl.value, {
      toolbar: true,
      navbar: false,
      title: (image) => image.alt || '',
      filter: (image) => {
        const fig = image.closest('figure');
        return !fig || fig.style.display !== 'none';
      },
    });
  }
}

function openAt(index: number) {
  if (!viewer || index < 0) return;
  viewer.view(index);
}

function onCardKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openAt(index);
  }
}

onMounted(() => {
  loadPersisted();
  refreshViewer();
});

onBeforeUnmount(() => {
  viewer?.destroy();
  viewer = null;
});

watch(active, () => {
  persist();
  query.value = '';
  void nextTick(() => requestAnimationFrame(refreshViewer));
});

watch(filteredItems, () => {
  void nextTick(() => requestAnimationFrame(refreshViewer));
});
</script>

<template>
  <div class="space-y-5">
    <div class="panel space-y-4 p-4 md:p-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0 flex-1">
          <label for="species-search" class="block text-sm font-semibold text-tide-900">
            Search scientific names
          </label>
          <input
            id="species-search"
            v-model="query"
            type="search"
            autocomplete="off"
            placeholder="e.g. Cellana, Tetraclita…"
            class="mt-1.5 w-full max-w-md rounded-lg border border-tide-900/15 bg-white px-3 py-2.5 text-base"
          />
        </div>
        <p class="caption shrink-0" aria-live="polite">
          Showing {{ filteredItems.length }}
          {{ filteredItems.length === 1 ? 'species' : 'species' }}
          in {{ activeGroup?.name || 'this group' }}
        </p>
      </div>

      <aside
        v-if="meta"
        class="rounded-xl border border-tide-900/10 bg-tide-50 px-4 py-3 text-sm leading-relaxed text-ink/90"
        aria-label="Field-guide tip for this group"
      >
        <p class="text-xs font-bold uppercase tracking-[0.12em] text-tide-600">
          Group field notes · {{ activeGroup?.name }}
        </p>
        <p class="mt-1.5">
          <span class="font-semibold text-tide-950">{{ meta.mobility }}</span>
          · typically recorded as
          <span class="font-semibold text-tide-950">{{ meta.measure }}</span>.
          {{ meta.tip }}
        </p>
      </aside>
    </div>

    <div class="grid gap-4 md:grid-cols-[220px_1fr]">
      <div
        ref="tablistEl"
        class="flex flex-row flex-wrap gap-2 md:sticky md:top-24 md:flex-col md:self-start"
        role="tablist"
        aria-label="Taxonomic groups"
        aria-orientation="vertical"
      >
        <button
          v-for="group in groups"
          :id="groupTabId(group.key)"
          :key="group.key"
          type="button"
          role="tab"
          :aria-selected="active === group.key"
          :aria-controls="`species-panel-${group.key}`"
          :tabindex="active === group.key ? 0 : -1"
          class="min-h-11 rounded-lg px-3 py-2 text-left text-base font-semibold transition"
          :class="
            active === group.key
              ? 'bg-tide-700 text-white'
              : 'bg-white text-tide-800 ring-1 ring-tide-900/10 hover:bg-tide-50'
          "
          @click="selectGroup(group.key)"
          @keydown="onGroupTabKeydown($event, group.key)"
        >
          <span class="block">{{ group.name }}</span>
          <span
            class="mt-0.5 block text-xs font-medium"
            :class="active === group.key ? 'text-white/80' : 'text-muted'"
          >
            {{ group.items.length }} species
          </span>
        </button>
      </div>

      <div
        :id="`species-panel-${active}`"
        ref="galleryEl"
        role="tabpanel"
        :aria-labelledby="groupTabId(active)"
        :aria-label="activeGroup?.name || 'Species'"
        tabindex="0"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <p
          v-if="!filteredItems.length"
          class="col-span-full rounded-xl border border-dashed border-tide-900/20 bg-white px-4 py-8 text-center text-base text-muted"
        >
          No species match “{{ query }}” in this group. Clear the search or try another group.
        </p>

        <figure
          v-for="(item, index) in filteredItems"
          :key="item.src"
          class="group overflow-hidden rounded-xl border border-tide-900/10 bg-white shadow-sm transition hover:ring-2 hover:ring-tide-600/40 focus-within:ring-2 focus-within:ring-tide-600"
        >
          <button
            type="button"
            class="block w-full cursor-zoom-in text-left focus:outline-none"
            :aria-label="`Zoom image of ${item.name}`"
            @click="openAt(index)"
            @keydown="onCardKeydown($event, index)"
          >
            <img
              :src="item.src"
              :alt="item.name"
              class="aspect-square w-full object-cover"
              loading="lazy"
            />
          </button>
          <figcaption class="species-name px-3 py-2.5 text-base text-tide-900">
            {{ item.name }}
          </figcaption>
        </figure>
      </div>
    </div>
  </div>
</template>
