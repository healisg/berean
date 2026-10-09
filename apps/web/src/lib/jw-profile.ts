export const jwProfile = {
  id: 'jehovahs-witness',
  name: "Jehovah's Witnesses",
  organization: 'Watchtower Bible and Tract Society',
  overview:
    "Jehovah's Witnesses reject the orthodox Christian doctrines of the Trinity, the deity of Christ, and the personality of the Holy Spirit. They use the New World Translation (NWT), which contains significant translation deviations from the original Greek and Hebrew texts.",
  doctrines: [
    {
      id: 'trinity',
      title: 'The Trinity & Deity of Christ',
      summary:
        "JWs believe Jesus is Michael the archangel — a created being, not God. They deny the Trinity as pagan in origin.",
      talkingPoints: [
        'John 1:1 in the NWT reads "a god" — but every major Greek scholar agrees the original text calls Jesus "God" (theos), not "a god."',
        'The Greek construction at John 1:1c uses "theos" as a qualitative noun, which affirms the nature of the Word as fully divine.',
        'Jesus accepted worship (Matt. 28:9, John 20:28). If He were a mere creature, He would have refused it (Rev. 22:8–9).',
        'Isaiah 9:6 calls the coming Messiah "Mighty God" and "Everlasting Father" — titles the JW organization applies to Jehovah elsewhere.',
        'John 8:58 — Jesus says "Before Abraham was born, I am" — echoing Exodus 3:14 where God reveals His name as "I AM."',
        'Thomas called Jesus "My Lord and my God" (John 20:28) — Jesus affirmed this, not corrected it.',
      ],
      scriptures: [
        { ref: 'John 1:1', text: '"In the beginning was the Word, and the Word was with God, and the Word was God."', translation: 'ESV' },
        { ref: 'John 20:28', text: 'Thomas said to him, "My Lord and my God!"', translation: 'ESV' },
        { ref: 'Isaiah 9:6', text: '"For to us a child is born... and he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace."', translation: 'NIV' },
        { ref: 'John 8:58', text: '"Very truly I tell you," Jesus answered, "before Abraham was born, I am!"', translation: 'NIV' },
      ],
      nwtIssue: 'NWT renders John 1:1 as "the Word was a god" — adding the indefinite article "a" which has no basis in the Greek text.',
    },
    {
      id: 'holy-spirit',
      title: 'The Holy Spirit',
      summary:
        'JWs teach that the Holy Spirit is an impersonal active force, like electricity — not a person of the Godhead.',
      talkingPoints: [
        'The Holy Spirit is referred to as "He" and "Him" in John 14:16–17, 26 and John 16:13 — personal pronouns do not apply to impersonal forces.',
        'The Holy Spirit can be grieved (Eph. 4:30), lied to (Acts 5:3–4), and blasphemed (Matt. 12:31) — attributes of a person, not a force.',
        'Acts 5:3–4 equates lying to the Holy Spirit with lying to God — confirming the Spirit is God.',
        'The Holy Spirit speaks, teaches, and intercedes (Romans 8:26–27) — actions only a person can perform.',
      ],
      scriptures: [
        { ref: 'John 16:13', text: '"But when he, the Spirit of truth, comes, he will guide you into all the truth."', translation: 'NIV' },
        { ref: 'Acts 5:3–4', text: '"You have not lied just to human beings but to God."', translation: 'NIV' },
        { ref: 'Ephesians 4:30', text: '"Do not grieve the Holy Spirit of God."', translation: 'NIV' },
      ],
      nwtIssue: 'The NWT consistently translates "pneuma" (Spirit) with lowercase "spirit" when referring to the Holy Spirit, depersonalizing Him.',
    },
    {
      id: 'salvation',
      title: 'Salvation & the 144,000',
      summary:
        'JWs believe only 144,000 will go to heaven. The rest of faithful JWs will live on a paradise earth. Salvation is tied to works and Watchtower membership.',
      talkingPoints: [
        'Revelation 7:4 and 14:1–5 describe the 144,000 as a literal, specific group — but context shows they are Jewish, male, and virgins, which JWs do not apply literally.',
        'John 3:16 promises eternal life to "whoever believes" — no cap of 144,000 is mentioned.',
        'Ephesians 2:8–9 teaches salvation is by grace through faith, not of works — directly contradicting the JW system of earning salvation through service.',
        'John 14:2–3 — Jesus promises "many rooms" and to prepare a place for all believers, not a select 144,000.',
        'Revelation 7:9 describes "a great multitude that no one could count" — distinct from the 144,000 — who stand before God in heaven.',
      ],
      scriptures: [
        { ref: 'Ephesians 2:8–9', text: '"For it is by grace you have been saved, through faith... not by works."', translation: 'NIV' },
        { ref: 'John 3:16', text: '"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."', translation: 'NIV' },
        { ref: 'Revelation 7:9', text: '"After this I looked, and there before me was a great multitude that no one could count... standing before the throne and before the Lamb."', translation: 'NIV' },
      ],
      nwtIssue: null,
    },
    {
      id: 'resurrection',
      title: "Christ's Resurrection",
      summary:
        'JWs deny the bodily resurrection of Jesus. They teach He was raised as a spirit creature, and His body was dissolved or disposed of by God.',
      talkingPoints: [
        'Jesus said "Destroy this temple, and in three days I will raise it up" — John 2:19–21 clarifies He was speaking of His body.',
        'Luke 24:39 — the risen Jesus said "Touch me and see; a ghost does not have flesh and bones, as you see I have."',
        'The tomb was empty (John 20:1–9) — if Jesus rose as a spirit, His body would still be there.',
        'Jesus showed Thomas His wounds (John 20:27) — physical, scarred hands and side.',
        '1 Corinthians 15:17 — if Christ has not been raised (bodily), your faith is futile.',
      ],
      scriptures: [
        { ref: 'Luke 24:39', text: '"Look at my hands and my feet. It is I myself! Touch me and see; a ghost does not have flesh and bones, as you see I have."', translation: 'NIV' },
        { ref: 'John 2:19–21', text: '"Destroy this temple, and I will raise it again in three days." ...But the temple he had spoken of was his body.', translation: 'NIV' },
        { ref: 'John 20:27', text: '"Put your finger here; see my hands. Reach out your hand and put it into my side."', translation: 'NIV' },
      ],
      nwtIssue: null,
    },
  ],
};

export type JWDoctrine = (typeof jwProfile.doctrines)[number];
