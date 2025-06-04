import Papa from "papaparse";
import { getTranslations } from "./translations";

export interface CsvRow {
  [key: string]: string;
}

export function parseCsv(file: File): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
}

/**
 * Busca combinada: cada palavra-chave (em português) pode ser encontrada em qualquer tradução (pt/en/de),
 * mas todas as palavras-chave devem estar presentes (em qualquer tradução) na linha.
 */
export function filterCsvRows(rows: CsvRow[], keyword: string): CsvRow[] {
  if (!keyword) return rows;
  const keywords = keyword
    .split(" ")
    .map(k => k.trim().toLowerCase())
    .filter(Boolean);

  return rows.filter(row =>
    keywords.every(kw => {
      const translations = getTranslations(kw);
      return translations.some(translated =>
        Object.values(row).some(
          value =>String(value).toLowerCase().includes(translated)
        )
      );
    })
  );
}

export function toCsv(rows: CsvRow[]): string {
  return Papa.unparse(rows);
}