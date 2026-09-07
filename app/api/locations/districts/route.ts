import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Turkish char slug converter for province slugs
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

// In-memory cache for district requests
const districtCache = new Map<string, { isim: string; slug: string }[]>();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const provinceQuery = searchParams.get('province') || '';

    if (!provinceQuery) {
      return NextResponse.json({ error: 'Province parameter is required' }, { status: 400 });
    }

    const normalized = provinceQuery.trim().toLocaleLowerCase('tr');
    const slug = PROVINCE_SLUG_MAP[normalized] || normalized.replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');

    if (districtCache.has(slug)) {
      return NextResponse.json({ districts: districtCache.get(slug) });
    }

    // Fetch from ogretmenevrak.com API
    const response = await fetch(`https://ogretmenevrak.com/okullar/ilceleriAl?il=${slug}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MaarifAkademi/2.0)',
      },
      next: { revalidate: 86400 }, // Cache 24 hours
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch districts: ${response.status}`);
    }

    const data: { id: number; meb_id: number; isim: string; slug: string }[] = await response.json();
    const formatted = data.map((d) => ({
      isim: d.isim,
      slug: d.slug,
    }));

    districtCache.set(slug, formatted);
    return NextResponse.json({ districts: formatted });
  } catch (error) {
    console.warn('Districts fetch warning, returning fallback:', error);
    return NextResponse.json({ districts: [] }, { status: 200 });
  }
}
