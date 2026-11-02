<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

export type SelfCheckOption = {
  label: string;
  correct: boolean;
  feedback: string;
};

const props = withDefaults(
  defineProps<{
    id: string;
    legend: string;
    options: SelfCheckOption[];
    eyebrow?: string;
  }>(),
  { eyebrow: 'Self-check' },
);

const selectedIndex = ref<number | null>(null);
const fieldsetEl = ref<HTMLFieldSetElement | null>(null);

const selectedOption = computed(() =>
  selectedIndex.value === null ? null : props.options[selectedIndex.value],
);

async function retry() {
  selectedIndex.value = null;
  await nextTick();
  fieldsetEl.value?.querySelector<HTMLInputElement>('input[type="radio"]')?.focus();
}
</script>

<template>
  <section
    class="rounded-2xl border border-tide-900/10 bg-white p-5 shadow-[0_1px_2px_rgb(8_38_42_/_0.05),0_12px_32px_rgb(8_38_42_/_0.06)] md:p-6"
    :aria-labelledby="`${id}-heading`"
  >
    <p class="text-xs font-bold uppercase tracking-[0.13em] text-tide-600">
      {{ eyebrow }}
    </p>
    <h2 :id="`${id}-heading`" class="mt-1 font-display text-2xl font-semibold text-tide-950">
      Check your understanding
    </h2>

    <fieldset ref="fieldsetEl" class="mt-4 min-w-0">
      <legend class="text-base font-semibold leading-relaxed text-ink md:text-lg">
        {{ legend }}
      </legend>

      <div class="mt-4 grid gap-3">
        <label
          v-for="(option, index) in options"
          :key="option.label"
          class="flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed transition md:text-base"
          :class="
            selectedIndex === index
              ? option.correct
                ? 'border-kelp/50 bg-tide-50'
                : 'border-coral/45 bg-sand-100/60'
              : 'border-tide-900/10 bg-white hover:border-tide-600/40 hover:bg-tide-50/50'
          "
        >
          <input
            v-model="selectedIndex"
            type="radio"
            :name="id"
            :value="index"
            class="mt-1 h-4 w-4 shrink-0 accent-tide-700"
          />
          <span>{{ option.label }}</span>
        </label>
      </div>
    </fieldset>

    <div class="mt-4 min-h-16" aria-live="polite" aria-atomic="true">
      <div
        v-if="selectedOption"
        class="rounded-xl border px-4 py-3 text-sm leading-relaxed"
        :class="
          selectedOption.correct
            ? 'border-kelp/30 bg-tide-50 text-tide-950'
            : 'border-coral/30 bg-sand-100/60 text-ink'
        "
      >
        <p class="font-semibold">
          {{ selectedOption.correct ? 'Correct.' : 'Not quite yet.' }}
        </p>
        <p class="mt-1">{{ selectedOption.feedback }}</p>
      </div>
      <p v-else class="text-sm text-muted">
        Choose an answer to see feedback. You can change your answer at any time.
      </p>
    </div>

    <button
      v-if="selectedOption && !selectedOption.correct"
      type="button"
      class="btn-secondary mt-3"
      @click="retry"
    >
      Try again
    </button>
  </section>
</template>
