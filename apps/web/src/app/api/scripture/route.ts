import { NextRequest, NextResponse } from 'next/server';
import { parseScriptureReference } from '@/lib/scripture-utils';
import { getTranslation } from '@/lib/translations';

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref');
  const translationId = req.nextUrl.searchParams.get('translation') ?? 'bsb';
  if (!ref) return NextResponse.json({ error: 'Missing ref' }, { status: 400 });

  const translation = getTranslation(translationId);

  try {
    if (translation.source === 'esv') return fetchESV(ref);
    return fetchYouVersion(ref, translation.bibleId!);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

async function fetchYouVersion(ref: string, bibleId: number) {
  const parsed = parseScriptureReference(ref);
  if (!parsed) return NextResponse.json({ error: 'Could not parse reference' }, { status: 400 });

  const res = await fetch(
    `https://api.youversion.com/v1/bibles/${bibleId}/passages/${parsed.usfm}`,
    { headers: { 'x-yvp-app-key': process.env.YOUVERSION_API_KEY! }, next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    console.error('YouVersion error:', await res.text());
    return NextResponse.json({ error: 'Failed to fetch verse' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json({ reference: ref, text: data.content, translation: 'BSB' });
}

async function fetchESV(ref: string) {
  const key = process.env.ESV_API_KEY;
  if (!key || key === 'your_esv_key_here')
    return NextResponse.json({ error: 'ESV API key not configured yet' }, { status: 503 });

  const res = await fetch(
    `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(ref)}&include-headings=false&include-footnotes=false&include-verse-numbers=false&include-short-copyright=false`,
    { headers: { Authorization: `Token ${key}` }, next: { revalidate: 86400 } }
  );

  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch verse' }, { status: res.status });

  const data = await res.json();
  const text = data.passages?.[0]?.trim();
  if (!text) return NextResponse.json({ error: 'Verse not found' }, { status: 404 });

  return NextResponse.json({ reference: ref, text, translation: 'ESV' });
}
