const BOOK_USFM: Record<string, string> = {
  genesis: 'GEN', gen: 'GEN',
  exodus: 'EXO', exo: 'EXO', ex: 'EXO',
  leviticus: 'LEV', lev: 'LEV',
  numbers: 'NUM', num: 'NUM',
  deuteronomy: 'DEU', deut: 'DEU', deu: 'DEU',
  joshua: 'JOS', josh: 'JOS', jos: 'JOS',
  judges: 'JDG', judg: 'JDG',
  ruth: 'RUT',
  '1 samuel': '1SA', '1samuel': '1SA', '1sa': '1SA',
  '2 samuel': '2SA', '2samuel': '2SA', '2sa': '2SA',
  '1 kings': '1KI', '1kings': '1KI', '1ki': '1KI',
  '2 kings': '2KI', '2kings': '2KI', '2ki': '2KI',
  '1 chronicles': '1CH', '1chronicles': '1CH', '1ch': '1CH',
  '2 chronicles': '2CH', '2chronicles': '2CH', '2ch': '2CH',
  ezra: 'EZR',
  nehemiah: 'NEH', neh: 'NEH',
  esther: 'EST', esth: 'EST',
  job: 'JOB',
  psalms: 'PSA', psalm: 'PSA', ps: 'PSA', psa: 'PSA',
  proverbs: 'PRO', prov: 'PRO', pro: 'PRO',
  ecclesiastes: 'ECC', eccl: 'ECC', ecc: 'ECC',
  'song of solomon': 'SNG', 'song of songs': 'SNG', sos: 'SNG', sng: 'SNG',
  isaiah: 'ISA', isa: 'ISA',
  jeremiah: 'JER', jer: 'JER',
  lamentations: 'LAM', lam: 'LAM',
  ezekiel: 'EZK', ezek: 'EZK', ezk: 'EZK',
  daniel: 'DAN', dan: 'DAN',
  hosea: 'HOS', hos: 'HOS',
  joel: 'JOL',
  amos: 'AMO',
  obadiah: 'OBA', obad: 'OBA',
  jonah: 'JON',
  micah: 'MIC', mic: 'MIC',
  nahum: 'NAM',
  habakkuk: 'HAB', hab: 'HAB',
  zephaniah: 'ZEP', zeph: 'ZEP',
  haggai: 'HAG', hag: 'HAG',
  zechariah: 'ZEC', zech: 'ZEC',
  malachi: 'MAL', mal: 'MAL',
  matthew: 'MAT', matt: 'MAT', mat: 'MAT',
  mark: 'MRK', mrk: 'MRK',
  luke: 'LUK', luk: 'LUK',
  john: 'JHN', jhn: 'JHN', jn: 'JHN',
  acts: 'ACT', act: 'ACT',
  romans: 'ROM', rom: 'ROM',
  '1 corinthians': '1CO', '1corinthians': '1CO', '1cor': '1CO', '1co': '1CO',
  '2 corinthians': '2CO', '2corinthians': '2CO', '2cor': '2CO', '2co': '2CO',
  galatians: 'GAL', gal: 'GAL',
  ephesians: 'EPH', eph: 'EPH',
  philippians: 'PHP', phil: 'PHP', php: 'PHP',
  colossians: 'COL', col: 'COL',
  '1 thessalonians': '1TH', '1thessalonians': '1TH', '1thess': '1TH', '1th': '1TH',
  '2 thessalonians': '2TH', '2thessalonians': '2TH', '2thess': '2TH', '2th': '2TH',
  '1 timothy': '1TI', '1timothy': '1TI', '1tim': '1TI', '1ti': '1TI',
  '2 timothy': '2TI', '2timothy': '2TI', '2tim': '2TI', '2ti': '2TI',
  titus: 'TIT', tit: 'TIT',
  philemon: 'PHM', phlm: 'PHM',
  hebrews: 'HEB', heb: 'HEB',
  james: 'JAS', jas: 'JAS',
  '1 peter': '1PE', '1peter': '1PE', '1pet': '1PE', '1pe': '1PE',
  '2 peter': '2PE', '2peter': '2PE', '2pet': '2PE', '2pe': '2PE',
  '1 john': '1JN', '1john': '1JN', '1jn': '1JN',
  '2 john': '2JN', '2john': '2JN', '2jn': '2JN',
  '3 john': '3JN', '3john': '3JN', '3jn': '3JN',
  jude: 'JUD',
  revelation: 'REV', rev: 'REV',
};

export interface ParsedReference {
  display: string;
  book: string;
  chapter: number;
  verse: number;
  usfm: string;
}

export function parseScriptureReference(ref: string): ParsedReference | null {
  // Match "John 1:1", "1 Corinthians 15:17", "Rev 22:8-9", "Acts 5:3–4"
  const match = ref.match(
    /^((?:\d\s)?[a-zA-Z]+(?:\s[a-zA-Z]+)*)\s+(\d+)[:\.](\d+)(?:[–—-](\d+))?/
  );
  if (!match) return null;

  const [, bookRaw, chapter, verse, endVerse] = match;
  const bookKey = bookRaw.toLowerCase().trim();
  const usfmBook = BOOK_USFM[bookKey];
  if (!usfmBook) return null;

  const startUsfm = `${usfmBook}.${chapter}.${verse}`;
  const usfm = endVerse
    ? `${startUsfm}-${endVerse}`
    : startUsfm;

  return {
    display: ref,
    book: bookRaw,
    chapter: parseInt(chapter),
    verse: parseInt(verse),
    usfm,
  };
}

// Regex to detect scripture references in text
export const SCRIPTURE_REGEX =
  /\b((?:\d\s)?(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|(?:1|2)\s?Samuel|(?:1|2)\s?Kings|(?:1|2)\s?Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Songs|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|(?:1|2)\s?Corinthians|Galatians|Ephesians|Philippians|Colossians|(?:1|2)\s?Thessalonians|(?:1|2)\s?Timothy|Titus|Philemon|Hebrews|James|(?:1|2|3)\s?Peter|(?:1|2|3)\s?John|Jude|Revelation)\s+\d+[:.]\d+(?:[–—-]\d+)?)/gi;
