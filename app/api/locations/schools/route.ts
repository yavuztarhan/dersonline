import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const PROVINCE_SLUG_MAP: Record<string, string> = {
  'adana': 'adana',
  'adıyaman': 'adiyaman',
  'afyonkarahisar': 'afyon',
  'afyon': 'afyon',
  'ağrı': 'agri',
  'amasya': 'amasya',
  'ankara': 'ankara',
  'antalya': 'antalya',
  'artvin': 'artvin',
  'aydın': 'aydin',
  'balıkesir': 'balikesir',
  'bilecik': 'bilecik',
  'bingöl': 'bingol',
  'bitlis': 'bitlis',
  'bolu': 'bolu',
  'burdur': 'burdur',
  'bursa': 'bursa',
  'çanakkale': 'canakkale',
  'çankırı': 'cankiri',
  'çorum': 'corum',
  'denizli': 'denizli',
  'diyarbakır': 'diyarbakir',
  'edirne': 'edirne',
  'elazığ': 'elazig',
  'erzincan': 'erzincan',
  'erzurum': 'erzurum',
  'eskişehir': 'eskisehir',
  'gaziantep': 'gaziantep',
  'giresun': 'giresun',
  'gümüşhane': 'gumushane',
  'hakkari': 'hakkari',
  'hatay': 'hatay',
  'isparta': 'isparta',
  'mersin': 'mersin',
  'i̇stanbul': 'istanbul',
  'istanbul': 'istanbul',
  'i̇zmir': 'izmir',
  'izmir': 'izmir',
  'kars': 'kars',
  'kastamonu': 'kastamonu',
  'kayseri': 'kayseri',
  'kırklareli': 'kirklareli',
  'kırşehir': 'kirsehir',
  'kocaeli': 'kocaeli',
  'konya': 'konya',
  'kütahya': 'kutahya',
  'malatya': 'malatya',
  'manisa': 'manisa',
  'kahramanmaraş': 'kahramanmaras',
  'mardin': 'mardin',
  'muğla': 'mugla',
  'muş': 'mus',
  'nevşehir': 'nevsehir',
  'niğde': 'nigde',
  'ordu': 'ordu',
  'rize': 'rize',
  'sakarya': 'sakarya',
  'samsun': 'samsun',
  'siirt': 'siirt',
  'sinop': 'sinop',
  'sivas': 'sivas',
  'tekirdağ': 'tekirdag',
  'tokat': 'tokat',
  'trabzon': 'trabzon',
  'tunceli': 'tunceli',
  'şanlıurfa': 'sanliurfa',
  'uşak': 'usak',
  'van': 'van',
  'yozgat': 'yozgat',
  'zonguldak': 'zonguldak',
  'aksaray': 'aksaray',
  'bayburt': 'bayburt',
  'karaman': 'karaman',
  'kırıkkale': 'kirikkale',
  'batman': 'batman',
  'şırnak': 'sirnak',
  'bartın': 'bartin',
  'ardahan': 'ardahan',
  'iğdır': 'igdir',
  'yalova': 'yalova',
  'karabük': 'karabuk',
  'kilis': 'kilis',
  'osmaniye': 'osmaniye',
  'düzce': 'duzce',
};

function normalizeSlug(str: string): string {
  return str
    .trim()
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function detectSchoolType(name: string): string {
  const upper = name.toLocaleUpperCase('tr');
  if (upper.includes('İMAM HATİP ORTAOKULU') || upper.includes('İHO')) return 'İmam Hatip Ortaokulu';
  if (upper.includes('ORTAOKULU') || upper.includes('ORTAOKUL')) return 'Ortaokul';
  if (upper.includes('İLKOKULU') || upper.includes('İLKOKUL')) return 'İlkokul';
  if (upper.includes('ANADOLU LİSESİ') || upper.includes('FEN LİSESİ') || upper.includes('LİSE')) return 'Lise';
  if (upper.includes('ANAOKULU') || upper.includes('KREŞ')) return 'Anaokulu';
  if (upper.includes('BİLİM VE SANAT') || upper.includes('BİLSEM')) return 'BİLSEM';
  return 'Eğitim Kurumu';
}

const schoolsCache = new Map<string, { id: string; name: string; type: string; slug: string }[]>();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const province = searchParams.get('province') || '';
    const district = searchParams.get('district') || '';
    const search = searchParams.get('search') || '';

    if (!province || !district) {
      return NextResponse.json({ error: 'Province and district parameters are required' }, { status: 400 });
    }

    const normProv = province.trim().toLocaleLowerCase('tr');
    const provSlug = PROVINCE_SLUG_MAP[normProv] || normalizeSlug(normProv);
    const distSlug = normalizeSlug(district);

    const cacheKey = `${provSlug}/${distSlug}`;

    let allSchools = schoolsCache.get(cacheKey);

    if (!allSchools) {
      allSchools = [];

      // Fetch Page 1
      const urlPage1 = `https://ogretmenevrak.com/okullar/${provSlug}/${distSlug}`;
      const res1 = await fetch(urlPage1, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MaarifAkademi/2.0)' },
        next: { revalidate: 86400 },
      });

      if (res1.ok) {
        const html1 = await res1.text();
        const schoolRegex = /<a href="https:\/\/ogretmenevrak\.com\/okullar\/[^/]+\/[^/]+\/([^"]+)">([^<]+)<\/a>/g;
        let m;
        while ((m = schoolRegex.exec(html1)) !== null) {
          const schoolName = m[2].trim();
          const schoolSlug = m[1].trim();
          if (schoolName && !allSchools.some((s) => s.slug === schoolSlug)) {
            allSchools.push({
              id: schoolSlug,
              name: schoolName,
              type: detectSchoolType(schoolName),
              slug: schoolSlug,
            });
          }
        }

        // If page 2 exists, fetch page 2 for complete listings
        if (html1.includes('page=2')) {
          try {
            const urlPage2 = `https://ogretmenevrak.com/okullar/${provSlug}/${distSlug}?page=2`;
            const res2 = await fetch(urlPage2, {
              headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MaarifAkademi/2.0)' },
              next: { revalidate: 86400 },
            });
            if (res2.ok) {
              const html2 = await res2.text();
              let m2;
              while ((m2 = schoolRegex.exec(html2)) !== null) {
                const schoolName = m2[2].trim();
                const schoolSlug = m2[1].trim();
                if (schoolName && !allSchools.some((s) => s.slug === schoolSlug)) {
                  allSchools.push({
                    id: schoolSlug,
                    name: schoolName,
                    type: detectSchoolType(schoolName),
                    slug: schoolSlug,
                  });
                }
              }
            }
          } catch (e) {
            console.warn('Page 2 fetch note:', e);
          }
        }
      }

      schoolsCache.set(cacheKey, allSchools);
    }

    // Filter by search query if provided
    let results = allSchools;
    if (search.trim()) {
      const q = search.trim().toLocaleLowerCase('tr');
      results = allSchools.filter((s) => s.name.toLocaleLowerCase('tr').includes(q));
    }

    return NextResponse.json({
      province: provSlug,
      district: distSlug,
      total: results.length,
      schools: results,
    });
  } catch (error) {
    console.error('Schools API error:', error);
    return NextResponse.json({ schools: [], total: 0 }, { status: 200 });
  }
}
