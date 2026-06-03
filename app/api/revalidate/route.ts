import { revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type: string; slug?: { current: string } }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ ok: false, error: 'No _type in body' }, { status: 400 });
    }

    const tags = [body._type === 'product' ? 'products' : body._type === 'caseStudy' ? 'case-studies' : body._type];
    if (body.slug?.current) tags.push(`${body._type}:${body.slug.current}`);

    // Next 16: webhook from external system → expire immediately.
    // https://nextjs.org/docs/app/api-reference/functions/revalidateTag
    tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));

    return NextResponse.json({ ok: true, revalidated: tags });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'Unknown' }, { status: 500 });
  }
}
