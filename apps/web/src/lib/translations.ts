export interface Translation {
  id: string;
  abbreviation: string;
  name: string;
  source: 'youversion' | 'esv';
  bibleId?: number;
}

export const TRANSLATIONS: Translation[] = [
  { id: 'esv',   abbreviation: 'ESV',   name: 'English Standard Version',               source: 'esv' },
  { id: 'bsb',   abbreviation: 'BSB',   name: 'Berean Standard Bible',                  source: 'youversion', bibleId: 3034 },
  { id: 'asv',   abbreviation: 'ASV',   name: 'American Standard Version',              source: 'youversion', bibleId: 12 },
  { id: 'lsv',   abbreviation: 'LSV',   name: 'Literal Standard Version',               source: 'youversion', bibleId: 2660 },
  { id: 'web',   abbreviation: 'WEB',   name: 'World English Bible',                    source: 'youversion', bibleId: 206 },
  { id: 'gnv',   abbreviation: 'GNV',   name: 'Geneva Bible (1599)',                    source: 'youversion', bibleId: 2163 },
];

export const DEFAULT_TRANSLATION_ID = 'bsb';
export const STORAGE_KEY = 'berean_translation';

export function getTranslation(id: string): Translation {
  return TRANSLATIONS.find((t) => t.id === id) ?? TRANSLATIONS[0];
}
