import { NextRequest, NextResponse } from 'next/server';
import schoolsData from '@/lib/turkey-schools-complete.json';

export const dynamic = 'force-dynamic';

const data = schoolsData as Record<string, Record<string, { id: string; name: string; type: string }[]>>;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const provinceQuery = searchParams.get('province') || '';
    const districtQuery = searchParams.get('district') || '';
    const searchQuery = searchParams.get('search') || '';

    if (!provinceQuery || !districtQuery) {
      return NextResponse.json(
        { error: 'province and district query parameters are required' },
        { status: 400 }
      );
    }

    const cleanProv = provinceQuery.trim().toLocaleLowerCase('tr');
    const cleanDist = districtQuery.trim().toLocaleLowerCase('tr');

    // Find province key case-insensitively
    const matchedProvKey = Object.keys(data).find(
      (p) => p.toLocaleLowerCase('tr') === cleanProv
    );

    if (!matchedProvKey || !data[matchedProvKey]) {
      return NextResponse.json({ schools: [] });
    }

    const provinceDistricts = data[matchedProvKey];

    // Find district key case-insensitively
    const matchedDistKey = Object.keys(provinceDistricts).find(
      (d) => d.toLocaleLowerCase('tr') === cleanDist
    );

    if (!matchedDistKey || !provinceDistricts[matchedDistKey]) {
      return NextResponse.json({ schools: [] });
    }

    let schools = provinceDistricts[matchedDistKey];

    // Optional text search filter
    if (searchQuery.trim()) {
      const cleanSearch = searchQuery.trim().toLocaleLowerCase('tr');
      schools = schools.filter((s) =>
        s.name.toLocaleLowerCase('tr').includes(cleanSearch)
      );
    }

    return NextResponse.json({
      province: matchedProvKey,
      district: matchedDistKey,
      count: schools.length,
      schools
    });
  } catch (error) {
    console.error('Schools API error:', error);
    return NextResponse.json({ schools: [] }, { status: 200 });
  }
}
