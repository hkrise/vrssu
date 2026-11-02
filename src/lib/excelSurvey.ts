import readXlsxFile from 'read-excel-file/browser';
import type { SurveyRecord } from './surveyStats';

/**
 * Parse survey template Excel into { quadrat, name, cnt } records.
 * Expected: first column "Species name" (or similar), remaining columns Q1, Q2, …
 */
export async function parseSurveyExcel(file: File): Promise<SurveyRecord[]> {
  const rows = await readXlsxFile(file);
  if (!rows.length) return [];

  const header = rows[0].map((c) => String(c ?? '').trim());
  const speciesCol = 0;
  const quadratHeaders = header.slice(1);

  const records: SurveyRecord[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const name = String(row[speciesCol] ?? '').trim();
    if (!name) continue;

    let allZero = true;
    const values: number[] = [];

    for (let c = 1; c < header.length; c++) {
      const raw = row[c];
      const cnt = raw === null || raw === undefined || raw === '' ? 0 : Number(raw);
      const n = Number.isFinite(cnt) ? cnt : 0;
      if (n !== 0) allZero = false;
      values.push(n);
    }

    if (allZero) continue;

    values.forEach((cnt, i) => {
      records.push({
        quadrat: i + 1,
        name,
        cnt,
      });
    });
  }

  // Prefer header-derived quadrat count; ignore unused label strings.
  void quadratHeaders;
  return records;
}
