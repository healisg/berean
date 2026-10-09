# Berean — Product Roadmap

> **Core purpose:** Equip Christians to confidently and respectfully defend the gospel (apologia) in the face of false and conflicting belief systems established after Christ's birth, death, and resurrection.

---

## How to use this document

- Check off items as they are completed
- Add notes under any item as the build progresses
- Re-order or remove items as priorities shift
- Reference this in each build session to stay on track

---

## Status key

| Symbol | Meaning |
|--------|---------|
| ✅ | Complete |
| 🔨 | In progress |
| ⬜ | Not started |
| ❌ | Removed / deprioritised |

---

## Phase 1 — Core Foundation ✅

These features are already live in the web POC.

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1.1 | AI-powered live conversation mode (Jehovah's Witnesses profile) | ✅ | `/profiles/jehovahs-witness/chat` |
| 1.2 | Experience level selector (Beginner / Moderate / Experienced) | ✅ | Distinct prompting rules per level |
| 1.3 | Clickable scripture references → verse modal | ✅ | YouVersion API |
| 1.4 | Verse range support (e.g. Acts 10:25–26) | ✅ | USFM range format fixed |
| 1.5 | Bible translation picker (BSB, ASV, LSV, WEB, GNV, ESV) | ✅ | localStorage persistence |
| 1.6 | Greek / Hebrew word popover with English definition | ✅ | Static lexicon + Claude Haiku fallback |
| 1.7 | Chat history persistence (localStorage) | ✅ | Per-profile, with Clear button |
| 1.8 | Markdown formatting in AI responses | ✅ | react-markdown renderer |

---

## Phase 2 — In-the-Field Utility (Next Priority)

Designed for someone actively in a conversation — at a door, in a coffee shop, face to face.

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 2.1 | **Debate Practice Mode** | ✅ | AI plays the opposing role; user practices responses; Berean scores arguments and flags gaps at the end |
| 2.2 | **Counterargument Simulator** | ✅ | Given any claim, generate the 3–4 strongest follow-up objections the user will face after their first response |
| 2.3 | **NWT vs Original Language Comparator** | ⬜ | Side-by-side: NWT / faithful translation / Greek or Hebrew source, with manuscript notes |
| 2.4 | **Quick Reference Cards** | ⬜ | One-screen glanceable summaries of the 5–6 most common claims per profile, with a one-sentence response each |
| 2.5 | **Offline mode** | ⬜ | Core doctrine content, scripture comparisons, and quick cards available without internet |
| 2.6 | **Voice input** | ⬜ | Speak what the other person said instead of typing — keeps the phone less intrusive mid-conversation |

---

## Phase 3 — Breadth of Coverage

Expanding beyond Jehovah's Witnesses to other belief systems.

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 3.1 | **Islam profile** | ⬜ | Deity of Christ, crucifixion denial, Quranic contradictions with the Bible |
| 3.2 | **Mormonism profile** | ⬜ | Nature of God, added scripture (Book of Mormon), eternal progression doctrine |
| 3.3 | **Unitarianism profile** | ⬜ | Denial of the Trinity, Jesus as moral teacher only |
| 3.4 | **Progressive Christianity profile** | ⬜ | Hardest to engage — orthodox language, heterodox conclusions; deconstruction narratives |
| 3.5 | **Atheism / Secular Humanism profile** | ⬜ | Cosmological and moral arguments, reliability of Scripture, historical resurrection case |
| 3.6 | **Church Fathers Library** | ⬜ | Searchable quotes from Ignatius, Athanasius, Tertullian, Irenaeus, etc. — demonstrates Trinitarian theology predates Nicaea |

---

## Phase 4 — Growth & Formation

For study, preparation, and long-term discipleship — not just reactive use.

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 4.1 | **Study Mode — structured prep courses** | ⬜ | Per-profile modules: scripture memorisation, argument walkthroughs, quiz at the end |
| 4.2 | **Daily training challenges** | ⬜ | One claim to refute, one verse in context, one Greek/Hebrew word — keeps the skill sharp daily |
| 4.3 | **Conversation log with notes** | ⬜ | Save and tag past conversations, mark which arguments landed, personal reference library |
| 4.4 | **Progress and growth tracking** | ⬜ | Track topics covered, arguments practiced, study streaks |

---

## Phase 5 — Platform & Scale

Infrastructure needed to support a real user base.

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 5.1 | **Supabase auth — user accounts** | ⬜ | Email / OAuth login |
| 5.2 | **Cloud sync** | ⬜ | Conversation history, notes, and preferences synced across devices |
| 5.3 | **React Native mobile app (iOS & Android)** | ⬜ | Expo scaffold exists; needs feature parity with web |
| 5.4 | **Multi-language support** | ⬜ | UI and AI responses in other languages — for missionaries and multilingual users |
| 5.5 | **Community / sharing** | ⬜ | Share effective conversation threads or argument summaries with other users |

---

## Decisions log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-05 | Named the app **Berean** | Reference to Acts 17:11 — the Bereans examined the scriptures daily |
| 2026-05 | Web POC first, mobile second | Faster to iterate on web; mobile scaffold in place for later |
| 2026-05 | YouVersion API for Bible verses | More translations available than free alternatives; ESV pending Crossway approval |
| 2026-05 | localStorage for chat history (Phase 1) | Avoids Supabase dependency while validating core features |
| 2026-05 | Static lexicon + Claude Haiku fallback for Greek/Hebrew | Instant lookup for common terms; AI covers inflected or rare forms |

---

## Backlog (unscheduled ideas)

Items worth revisiting but not yet prioritised.

- Argument quality scoring with detailed written feedback
- Push notifications for daily training (mobile)
- Integration with Blue Letter Bible or Logos for deeper lexicon data
- Printable / shareable Quick Reference Card PDFs
- Guest mode (no account required) vs. signed-in mode with full history

---

*Last updated: May 2026*
