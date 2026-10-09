export interface LexiconEntry {
  word: string;
  transliteration: string;
  language: 'greek' | 'hebrew';
  definition: string;
  strongs?: string;
}

export const LEXICON: Record<string, LexiconEntry> = {
  // ── Greek ──────────────────────────────────────────────────────────────────
  // θεός — all common cases
  'θεός': { word: 'θεός', transliteration: 'theos', language: 'greek', strongs: 'G2316',
    definition: 'God; deity. In John 1:1c the anarthrous (no article) use is qualitative — the Word shares the divine nature, not merely "a god" as the NWT renders it.' },
  'θεόν': { word: 'θεόν', transliteration: 'theon', language: 'greek', strongs: 'G2316',
    definition: 'God (accusative case of θεός). The direct-object form, e.g. "they saw God." Same divine referent — the NWT\'s "a god" rendering of the nominative applies here too in their system.' },
  'θεοῦ': { word: 'θεοῦ', transliteration: 'theou', language: 'greek', strongs: 'G2316',
    definition: 'Of God (genitive case of θεός). Indicates possession or relationship — e.g. "Son of God," "Word of God," "Spirit of God."' },
  'θεῷ': { word: 'θεῷ', transliteration: 'theo', language: 'greek', strongs: 'G2316',
    definition: 'To/in God (dative case of θεός). Used in contexts of direction or relationship — e.g. "acceptable to God," "glory to God."' },
  // κύριος — common cases
  'κύριος': { word: 'κύριος', transliteration: 'kyrios', language: 'greek', strongs: 'G2962',
    definition: 'Lord; master. The LXX uses it to translate YHWH, and the NT applies it directly to Jesus — a deliberate identification with the divine name.' },
  'κύριον': { word: 'κύριον', transliteration: 'kyrion', language: 'greek', strongs: 'G2962',
    definition: 'Lord (accusative case of κύριος). Direct-object form — e.g. "confess Jesus as Lord." The LXX uses κύριος to render YHWH.' },
  'κυρίου': { word: 'κυρίου', transliteration: 'kyriou', language: 'greek', strongs: 'G2962',
    definition: 'Of the Lord (genitive of κύριος) — e.g. "the word of the Lord," "the day of the Lord." Applied to YHWH in the OT and to Jesus throughout the NT.' },
  'κυρίῳ': { word: 'κυρίῳ', transliteration: 'kyrio', language: 'greek', strongs: 'G2962',
    definition: 'To/in the Lord (dative of κύριος) — e.g. "in the Lord," "to the Lord." Paul uses this phrase dozens of times for union with Christ.' },
  // λόγος — common cases
  'λόγος': { word: 'λόγος', transliteration: 'logos', language: 'greek', strongs: 'G3056',
    definition: 'Word; reason. In John 1:1, the Logos is eternal, co-present with God, and identified as God — the pre-incarnate Christ.' },
  'λόγον': { word: 'λόγον', transliteration: 'logon', language: 'greek', strongs: 'G3056',
    definition: 'Word (accusative of λόγος) — e.g. "the Word became flesh" (John 1:14). The Logos who was God took on human nature in the incarnation.' },
  'λόγου': { word: 'λόγου', transliteration: 'logou', language: 'greek', strongs: 'G3056',
    definition: 'Of the Word (genitive of λόγος) — referring to the pre-incarnate Christ or the spoken/written revelation of God.' },
  'μονογενής': { word: 'μονογενής', transliteration: 'monogenes', language: 'greek', strongs: 'G3439',
    definition: 'Only-begotten; unique; one of a kind. Denotes uniqueness of relationship, not temporal origin — the NWT\'s "only-begotten" implies creation it does not carry.' },
  'πρωτότοκος': { word: 'πρωτότοκος', transliteration: 'prototokos', language: 'greek', strongs: 'G4416',
    definition: 'Firstborn. In Col 1:15 this is a title of supremacy and heirship (cf. Ps 89:27), not a claim that Christ was the first thing created.' },
  'ἀρχή': { word: 'ἀρχή', transliteration: 'arche', language: 'greek', strongs: 'G746',
    definition: 'Beginning; origin; ruler. In John 1:1, "In the beginning" mirrors Gen 1:1, asserting the Word\'s pre-existence before creation began.' },
  'προσκυνέω': { word: 'προσκυνέω', transliteration: 'proskyneo', language: 'greek', strongs: 'G4352',
    definition: 'To worship; to bow in reverence. Applied to God throughout Scripture, and also directly to Jesus (Matt 28:9; Heb 1:6) — indicating his deity.' },
  'πνεῦμα': { word: 'πνεῦμα', transliteration: 'pneuma', language: 'greek', strongs: 'G4151',
    definition: 'Spirit; breath; wind. The Holy Spirit (πνεῦμα ἅγιον) is consistently addressed with personal pronouns in John 14–16 — a person, not an impersonal "active force."' },
  'παράκλητος': { word: 'παράκλητος', transliteration: 'parakletos', language: 'greek', strongs: 'G3875',
    definition: 'Advocate; Helper; Comforter. Jesus uses masculine pronouns for the Spirit here (John 14:26; 16:13–14), indicating personhood — grammatically and theologically significant.' },
  'αἰώνιος': { word: 'αἰώνιος', transliteration: 'aionios', language: 'greek', strongs: 'G166',
    definition: 'Eternal; everlasting. In Matt 25:46 the same adjective describes both eternal life and eternal punishment — annihilationist readings must apply their logic consistently to both.' },
  'σταυρός': { word: 'σταυρός', transliteration: 'stauros', language: 'greek', strongs: 'G4716',
    definition: 'Cross. The NWT renders this "torture stake," but historical evidence — including patristic writings and early Christian iconography — strongly supports the traditional cross shape.' },
  'ψυχή': { word: 'ψυχή', transliteration: 'psyche', language: 'greek', strongs: 'G5590',
    definition: 'Soul; life; self. While it can refer to the whole person, passages like Rev 6:9 depict souls as consciously existing after death — contra the JW "soul sleep" doctrine.' },
  'γέεννα': { word: 'γέεννα', transliteration: 'gehenna', language: 'greek', strongs: 'G1067',
    definition: 'Gehenna; hell. Jesus used this term 11 times for the place of final judgment. The imagery of unquenchable fire (Mark 9:43) implies conscious ongoing punishment, not annihilation.' },
  'ᾅδης': { word: 'ᾅδης', transliteration: 'hades', language: 'greek', strongs: 'G86',
    definition: 'Hades; the realm of the dead. In Rev 20:14, Hades is cast into the lake of fire — a distinct intermediate state, not mere non-existence.' },
  'ὁμοούσιος': { word: 'ὁμοούσιος', transliteration: 'homoousios', language: 'greek',
    definition: 'Of the same substance. The key term of the Nicene Creed (325 AD) affirming the Son is consubstantial with the Father — directly contra the Arian view that JW theology echoes.' },
  'ὑπόστασις': { word: 'ὑπόστασις', transliteration: 'hypostasis', language: 'greek', strongs: 'G5287',
    definition: 'Substance; person; underlying reality. In Heb 1:3 Christ is the exact imprint of God\'s hypostasis — not a reflection or copy, but the same substance expressed.' },
  'χαρακτήρ': { word: 'χαρακτήρ', transliteration: 'charakter', language: 'greek', strongs: 'G5481',
    definition: 'Exact imprint; stamp. In Heb 1:3, Christ bears this relationship to the Father — as a seal leaves its precise imprint, so the Son is the exact representation of God\'s being.' },
  'κόλασις': { word: 'κόλασις', transliteration: 'kolasis', language: 'greek', strongs: 'G2851',
    definition: 'Punishment; torment. In Matt 25:46, "eternal punishment" (κόλασιν αἰώνιον) uses the same αἰώνιος as "eternal life" in the same verse — both are equally permanent.' },
  'ἄγγελος': { word: 'ἄγγελος', transliteration: 'angelos', language: 'greek', strongs: 'G32',
    definition: 'Angel; messenger. JWs identify Jesus as Michael the archangel, but Heb 1:5–13 explicitly places the Son in a superior category to all angels — "To which of the angels did God ever say, You are my Son?"' },
  'υἱός': { word: 'υἱός', transliteration: 'huios', language: 'greek', strongs: 'G5207',
    definition: 'Son. Jewish listeners understood "Son of God" as a claim to equality with God (John 5:18) — not subordination or a created status.' },
  'δόξα': { word: 'δόξα', transliteration: 'doxa', language: 'greek', strongs: 'G1391',
    definition: 'Glory. Jesus shares the same glory as the Father before creation (John 17:5), and Isaiah\'s vision of YHWH\'s glory (Isa 6) is identified as Christ\'s glory in John 12:41.' },
  'εἰκών': { word: 'εἰκών', transliteration: 'eikon', language: 'greek', strongs: 'G1504',
    definition: 'Image; likeness. In Col 1:15, Christ as "image of the invisible God" is the visible, exact representation of the divine nature — not an inferior copy.' },
  'ἐξουσία': { word: 'ἐξουσία', transliteration: 'exousia', language: 'greek', strongs: 'G1849',
    definition: 'Authority; power; right. Jesus claims all authority in heaven and earth (Matt 28:18) — a claim that belongs exclusively to God.' },
  'ἀνάστασις': { word: 'ἀνάστασις', transliteration: 'anastasis', language: 'greek', strongs: 'G386',
    definition: 'Resurrection. The bodily resurrection of Christ (John 20:27; Luke 24:39) is physically attested — Jesus\' resurrection was not a spiritual recreation as the NWT implies.' },
  'ἅγιος': { word: 'ἅγιος', transliteration: 'hagios', language: 'greek', strongs: 'G40',
    definition: 'Holy; set apart. Applied to God\'s essential nature (Rev 4:8) and to the Spirit — the triple "Holy" of the trisagion reflects the fullness of God\'s holiness.' },

  // ── Hebrew ─────────────────────────────────────────────────────────────────
  'יהוה': { word: 'יהוה', transliteration: 'YHWH / Yahweh', language: 'hebrew', strongs: 'H3068',
    definition: 'The divine name (the Tetragrammaton). JWs insert "Jehovah" into the NT, but no Greek manuscript supports this — NT authors deliberately used κύριος (Lord), applying God\'s name to Jesus.' },
  'אֱלֹהִים': { word: 'אֱלֹהִים', transliteration: 'Elohim', language: 'hebrew', strongs: 'H430',
    definition: 'God. A grammatically plural form used with singular verbs — a plurality-within-unity that is consistent with Trinitarian theology, though not explicit proof of it.' },
  'אֶחָד': { word: 'אֶחָד', transliteration: 'echad', language: 'hebrew', strongs: 'H259',
    definition: 'One. In the Shema (Deut 6:4) God is "one" (echad) — the same word used for "one flesh" (Gen 2:24), a composite unity. The absolute singular word (yachid) is never used of God\'s oneness.' },
  'יָחִיד': { word: 'יָחִיד', transliteration: 'yachid', language: 'hebrew', strongs: 'H3173',
    definition: 'Alone; solitary; only. If God were an absolute singular unit, yachid would be the natural word — yet it is never used to describe God\'s oneness in the OT.' },
  'רוּחַ': { word: 'רוּחַ', transliteration: 'ruach', language: 'hebrew', strongs: 'H7307',
    definition: 'Spirit; breath; wind. The Spirit of God (רוּחַ אֱלֹהִים) is active in creation (Gen 1:2) and throughout the OT as a personal divine presence, not merely a force.' },
  'נֶפֶשׁ': { word: 'נֶפֶשׁ', transliteration: 'nephesh', language: 'hebrew', strongs: 'H5315',
    definition: 'Soul; life; self; being. In Gen 2:7, man "became a living soul" — JWs use this to deny a distinct immaterial soul, but the text speaks of the whole living person, not the absence of inner life.' },
  'מָשִׁיחַ': { word: 'מָשִׁיחַ', transliteration: 'mashiach', language: 'hebrew', strongs: 'H4899',
    definition: 'Messiah; anointed one. The Hebrew equivalent of Greek Χριστός — the promised deliverer-king of Israel, fulfilled in Jesus of Nazareth.' },
  'עַלְמָה': { word: 'עַלְמָה', transliteration: 'almah', language: 'hebrew', strongs: 'H5959',
    definition: 'Young woman of marriageable age; maiden. In Isa 7:14, the LXX translates it as παρθένος (virgin), which Matthew quotes in Matt 1:23 as fulfilled in Mary\'s virginal conception.' },
  'כָּבוֹד': { word: 'כָּבוֹד', transliteration: 'kavod', language: 'hebrew', strongs: 'H3519',
    definition: 'Glory; weight; honor. Isaiah\'s vision of YHWH\'s glory (Isa 6:1–3) is explicitly identified as Christ\'s glory in John 12:41 — a key proof text for the deity of Christ.' },
  'חֶסֶד': { word: 'חֶסֶד', transliteration: 'hesed', language: 'hebrew', strongs: 'H2617',
    definition: 'Steadfast love; lovingkindness; covenant loyalty. One of God\'s most defining attributes — combining love, mercy, and covenantal faithfulness in a single rich concept.' },
  'שָׁלוֹם': { word: 'שָׁלוֹם', transliteration: 'shalom', language: 'hebrew', strongs: 'H7965',
    definition: 'Peace; wholeness; completeness. More than absence of conflict — a state of total well-being and right relationship with God, people, and creation.' },
  'קָדוֹשׁ': { word: 'קָדוֹשׁ', transliteration: 'kadosh', language: 'hebrew', strongs: 'H6918',
    definition: 'Holy; set apart. The threefold repetition in Isa 6:3 (the trisagion) is unique in OT poetry — many scholars see a hint of Trinitarian fullness in this intensified form.' },
  'עֶבֶד': { word: 'עֶבֶד', transliteration: 'eved', language: 'hebrew', strongs: 'H5650',
    definition: 'Servant; slave. The "Servant of the LORD" in Isaiah 42–53 is the messianic figure who suffers vicariously — fulfilled in Jesus (Matt 12:18).' },
  'מַלְאָךְ': { word: 'מַלְאָךְ', transliteration: 'malach', language: 'hebrew', strongs: 'H4397',
    definition: 'Angel; messenger. The Angel of the LORD in the OT often receives worship and speaks as God himself — many scholars identify this as a pre-incarnate appearance of Christ (a Christophany).' },
};

// Matches sequences of Greek or Hebrew characters (minimum 2 chars to avoid lone punctuation)
export const GREEK_HEBREW_REGEX = /[Ͱ-Ͽἀ-῿א-תְ-ֽ]{2,}/g;

export function linkifyLexicon(text: string): string {
  GREEK_HEBREW_REGEX.lastIndex = 0;
  return text.replace(GREEK_HEBREW_REGEX, (match) => `[${match}](lexicon:${encodeURIComponent(match)})`);
}
