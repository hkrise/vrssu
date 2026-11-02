export type SurveyRecord = {
  quadrat: number;
  name: string;
  cnt: number;
};

export type EffortSeries = {
  means: number[];
  errorSD: [number, number][];
  errorSE: [number, number][];
};

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** Population SD (divide by n) — matches legacy VRSSU formula. */
function getStandardDeviation(array: number[]): number {
  const n = array.length;
  if (n === 0) return 0;
  const mean = average(array);
  return Math.sqrt(array.map((x) => (x - mean) ** 2).reduce((a, b) => a + b, 0) / n);
}

/** Population variance (divide by n) — matches legacy VRSSU formula. */
function variance(array: number[]): number {
  const len = array.length;
  if (len <= 1) return 0;
  const mean = average(array);
  return array.reduce((v, x) => v + (x - mean) * (x - mean), 0) / len;
}

/** Running mean / SD / SE as quadrats are added one by one. */
export function computeEffortSeries(counts: number[]): EffortSeries {
  const means: number[] = [];
  const errorSD: [number, number][] = [];
  const errorSE: [number, number][] = [];
  const cache: number[] = [];

  for (const cnt of counts) {
    cache.push(cnt);
    const mean = average(cache);
    const sd = getStandardDeviation(cache);
    const se = Math.sqrt(variance(cache) / cache.length);
    means.push(mean);
    errorSD.push([mean + sd, mean - sd]);
    errorSE.push([mean + se, mean - se]);
  }

  return { means, errorSD, errorSE };
}

export function uniqueSpecies(records: SurveyRecord[]): string[] {
  return [...new Set(records.map((r) => r.name))].sort((a, b) => a.localeCompare(b));
}

export function seriesForSpecies(
  records: SurveyRecord[],
  species: string,
): { quadrat: number; cnt: number }[] {
  return records
    .filter((r) => r.name === species)
    .map((r) => ({ quadrat: r.quadrat, cnt: Number(r.cnt) }))
    .sort((a, b) => a.quadrat - b.quadrat);
}
