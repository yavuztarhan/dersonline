import { NextRequest, NextResponse } from 'next/server';
import schoolsData from '@/lib/turkey-schools-complete.json';

export const dynamic = 'force-dynamic';

const data = schoolsData as Record<string, Record<string, { id: string; name: string; type: string }[]>>;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const provinceQuery = searchParams.get('province') || '';

    if (!provinceQuery) {
      return NextResponse.json({ error: 'Province parameter is required' }, { status: 400 });
    }

    const cleanProvQuery = provinceQuery.trim().toLocaleLowerCase('tr');

    // Find province key case-insensitively
    const matchedProvKey = Object.keys(data).find(
      (p) => p.toLocaleLowerCase('tr') === cleanProvQuery
    );

    if (!matchedProvKey || !data[matchedProvKey]) {
      return NextResponse.json({ districts: [] });
    }

    const districtsObj = data[matchedProvKey];
    const districts = Object.keys(districtsObj).sort((a, b) => a.localeCompare(b, 'tr'));

    const formatted = districts.map((d) => ({
      isim: d,
      slug: d.toLocaleLowerCase('tr')
    }));

    return NextResponse.json({ districts: formatted });
  } catch (error) {
    console.error('Districts API error:', error);
    return NextResponse.json({ districts: [] }, { status: 200 });
  }
}
