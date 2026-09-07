export const ALL_81_PROVINCES: string[] = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
  'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
  'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta',
  'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
  'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla',
  'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt',
  'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
  'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman',
  'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

export function getAllProvinces(): string[] {
  return ALL_81_PROVINCES;
}

// Fallback districts for top cities
const FALLBACK_DISTRICTS: Record<string, string[]> = {
  'Edirne': ['Merkez', 'Keşan', 'Uzunköprü', 'İpsala', 'Havsa', 'Meriç', 'Enez', 'Süloğlu', 'Lalapaşa'],
  'İstanbul': ['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Şişli', 'Bakırköy', 'Fatih', 'Beyoğlu', 'Maltepe', 'Ataşehir', 'Kartal', 'Pendik', 'Ümraniye', 'Sarıyer'],
  'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ', 'Gölbaşı'],
  'İzmir': ['Konak', 'Karşıyaka', 'Bornova', 'Buca', 'Çiğli', 'Gaziemir', 'Balçova', 'Narlıdere']
};

export function getDistrictsByProvince(provinceName: string): string[] {
  const match = Object.keys(FALLBACK_DISTRICTS).find(
    (k) => k.toLocaleLowerCase('tr') === provinceName.toLocaleLowerCase('tr')
  );
  if (match) return FALLBACK_DISTRICTS[match];
  return ['Merkez'];
}

export function getSchoolsByDistrict(provinceName: string, districtName: string): { id: string; name: string; type: string }[] {
  return [
    { id: `${provinceName}-${districtName}-1`, name: `${districtName} Atatürk Ortaokulu`, type: 'Ortaokul' },
    { id: `${provinceName}-${districtName}-2`, name: `${districtName} Fatih İlkokulu`, type: 'İlkokul' },
    { id: `${provinceName}-${districtName}-3`, name: `${districtName} Anadolu Lisesi`, type: 'Anadolu Lisesi' }
  ];
}

// Client-side cached fetchers querying local backend API
const clientDistrictsCache = new Map<string, string[]>();
const clientSchoolsCache = new Map<string, { id: string; name: string; type: string }[]>();

export async function fetchDistrictsApi(provinceName: string): Promise<string[]> {
  const cacheKey = provinceName.trim().toLocaleLowerCase('tr');
  if (clientDistrictsCache.has(cacheKey)) {
    return clientDistrictsCache.get(cacheKey)!;
  }

  try {
    const res = await fetch(`/api/locations/districts?province=${encodeURIComponent(provinceName)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.districts && Array.isArray(data.districts) && data.districts.length > 0) {
        const result = data.districts.map((d: any) => d.isim);
        clientDistrictsCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (e) {
    console.warn('Districts local API fetch fallback:', e);
  }
  return getDistrictsByProvince(provinceName);
}

export async function fetchSchoolsApi(
  provinceName: string,
  districtName: string,
  search?: string
): Promise<{ id: string; name: string; type: string }[]> {
  const cacheKey = `${provinceName.trim().toLocaleLowerCase('tr')}_${districtName.trim().toLocaleLowerCase('tr')}_${(search || '').trim().toLocaleLowerCase('tr')}`;
  if (clientSchoolsCache.has(cacheKey)) {
    return clientSchoolsCache.get(cacheKey)!;
  }

  try {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const res = await fetch(
      `/api/locations/schools?province=${encodeURIComponent(provinceName)}&district=${encodeURIComponent(districtName)}${searchParam}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.schools && Array.isArray(data.schools)) {
        clientSchoolsCache.set(cacheKey, data.schools);
        return data.schools;
      }
    }
  } catch (e) {
    console.warn('Schools local API fetch fallback:', e);
  }
  return getSchoolsByDistrict(provinceName, districtName);
}
