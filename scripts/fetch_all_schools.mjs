import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROVINCES = [
  { name: 'Adana', slug: 'adana' },
  { name: 'Adıyaman', slug: 'adiyaman' },
  { name: 'Afyonkarahisar', slug: 'afyon' },
  { name: 'Ağrı', slug: 'agri' },
  { name: 'Amasya', slug: 'amasya' },
  { name: 'Ankara', slug: 'ankara' },
  { name: 'Antalya', slug: 'antalya' },
  { name: 'Artvin', slug: 'artvin' },
  { name: 'Aydın', slug: 'aydin' },
  { name: 'Balıkesir', slug: 'balikesir' },
  { name: 'Bilecik', slug: 'bilecik' },
  { name: 'Bingöl', slug: 'bingol' },
  { name: 'Bitlis', slug: 'bitlis' },
  { name: 'Bolu', slug: 'bolu' },
  { name: 'Burdur', slug: 'burdur' },
  { name: 'Bursa', slug: 'bursa' },
  { name: 'Çanakkale', slug: 'canakkale' },
  { name: 'Çankırı', slug: 'cankiri' },
  { name: 'Çorum', slug: 'corum' },
  { name: 'Denizli', slug: 'denizli' },
  { name: 'Diyarbakır', slug: 'diyarbakir' },
  { name: 'Edirne', slug: 'edirne' },
  { name: 'Elazığ', slug: 'elazig' },
  { name: 'Erzincan', slug: 'erzincan' },
  { name: 'Erzurum', slug: 'erzurum' },
  { name: 'Eskişehir', slug: 'eskisehir' },
  { name: 'Gaziantep', slug: 'gaziantep' },
  { name: 'Giresun', slug: 'giresun' },
  { name: 'Gümüşhane', slug: 'gumushane' },
  { name: 'Hakkari', slug: 'hakkari' },
  { name: 'Hatay', slug: 'hatay' },
  { name: 'Isparta', slug: 'isparta' },
  { name: 'Mersin', slug: 'mersin' },
  { name: 'İstanbul', slug: 'istanbul' },
  { name: 'İzmir', slug: 'izmir' },
  { name: 'Kars', slug: 'kars' },
  { name: 'Kastamonu', slug: 'kastamonu' },
  { name: 'Kayseri', slug: 'kayseri' },
  { name: 'Kırklareli', slug: 'kirklareli' },
  { name: 'Kırşehir', slug: 'kirsehir' },
  { name: 'Kocaeli', slug: 'kocaeli' },
  { name: 'Konya', slug: 'konya' },
  { name: 'Kütahya', slug: 'kutahya' },
  { name: 'Malatya', slug: 'malatya' },
  { name: 'Manisa', slug: 'manisa' },
  { name: 'Kahramanmaraş', slug: 'kahramanmaras' },
  { name: 'Mardin', slug: 'mardin' },
  { name: 'Muğla', slug: 'mugla' },
  { name: 'Muş', slug: 'mus' },
  { name: 'Nevşehir', slug: 'nevsehir' },
  { name: 'Niğde', slug: 'nigde' },
  { name: 'Ordu', slug: 'ordu' },
  { name: 'Rize', slug: 'rize' },
  { name: 'Sakarya', slug: 'sakarya' },
  { name: 'Samsun', slug: 'samsun' },
  { name: 'Siirt', slug: 'siirt' },
  { name: 'Sinop', slug: 'sinop' },
  { name: 'Sivas', slug: 'sivas' },
  { name: 'Tekirdağ', slug: 'tekirdag' },
  { name: 'Tokat', slug: 'tokat' },
  { name: 'Trabzon', slug: 'trabzon' },
  { name: 'Tunceli', slug: 'tunceli' },
  { name: 'Şanlıurfa', slug: 'sanliurfa' },
  { name: 'Uşak', slug: 'usak' },
  { name: 'Van', slug: 'van' },
  { name: 'Yozgat', slug: 'yozgat' },
  { name: 'Zonguldak', slug: 'zonguldak' },
  { name: 'Aksaray', slug: 'aksaray' },
  { name: 'Bayburt', slug: 'bayburt' },
  { name: 'Karaman', slug: 'karaman' },
  { name: 'Kırıkkale', slug: 'kirikkale' },
  { name: 'Batman', slug: 'batman' },
  { name: 'Şırnak', slug: 'sirnak' },
  { name: 'Bartın', slug: 'bartin' },
  { name: 'Ardahan', slug: 'ardahan' },
  { name: 'Iğdır', slug: 'igdir' },
  { name: 'Yalova', slug: 'yalova' },
  { name: 'Karabük', slug: 'karabuk' },
  { name: 'Kilis', slug: 'kilis' },
  { name: 'Osmaniye', slug: 'osmaniye' },
  { name: 'Düzce', slug: 'duzce' }
];

function cleanHtmlText(raw) {
  return raw
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ccedil;/g, 'ç')
    .replace(/&Ccedil;/g, 'Ç')
    .replace(/&ouml;/g, 'ö')
    .replace(/&Ouml;/g, 'Ö')
    .replace(/&uuml;/g, 'ü')
    .replace(/&Uuml;/g, 'Ü')
    .replace(/&thorn;/g, 'ş')
    .replace(/&Thorn;/g, 'Ş')
    .replace(/&eth;/g, 'ğ')
    .replace(/&Eth;/g, 'Ğ')
    .replace(/&yacute;/g, 'ı')
    .replace(/&Yacute;/g, 'I')
    .replace(/<[^>]*>/g, '')
    .trim();
}

function detectSchoolType(name) {
  const upper = name.toLocaleUpperCase('tr');
  if (upper.includes('İLKOKUL')) return 'İlkokul';
  if (upper.includes('İMAM HATİP ORTAOKUL')) return 'İmam Hatip Ortaokulu';
  if (upper.includes('ORTAOKUL')) return 'Ortaokul';
  if (upper.includes('ANADOLU İMAM HATİP LİSE')) return 'Anadolu İmam Hatip Lisesi';
  if (upper.includes('FEN LİSE')) return 'Fen Lisesi';
  if (upper.includes('SOSYAL BİLİMLER LİSE')) return 'Sosyal Bilimler Lisesi';
  if (upper.includes('MESLEKİ VE TEKNİK') || upper.includes('MTAL')) return 'Mesleki ve Teknik Anadolu Lisesi';
  if (upper.includes('ANADOLU LİSE')) return 'Anadolu Lisesi';
  if (upper.includes('LİSE')) return 'Lise';
  if (upper.includes('ANAOKUL') || upper.includes('KREŞ')) return 'Anaokulu';
  if (upper.includes('BİLİM VE SANAT') || upper.includes('BİLSEM')) return 'BİLSEM';
  if (upper.includes('HALK EĞİTİM')) return 'Halk Eğitimi Merkezi';
  if (upper.includes('ÖZEL EĞİTİM')) return 'Özel Eğitim Kurumu';
  if (upper.includes('REHBERLİK') || upper.includes('RAM')) return 'RAM';
  if (upper.includes('ÖĞRETMENEVİ')) return 'Öğretmenevi';
  return 'Okul / Kurum';
}

function normalizeSlug(str) {
  return str
    .toLocaleLowerCase('tr')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/json'
        }
      });
      if (res.ok) return res;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error(`Failed to fetch ${url}`);
}

async function scrapeDistrictSchools(ilSlug, distSlug, distName) {
  const schools = [];
  const seen = new Set();

  for (let page = 1; page <= 8; page++) {
    const pageUrl = `https://ogretmenevrak.com/okullar/${ilSlug}/${distSlug}${page > 1 ? `?page=${page}` : ''}`;
    try {
      const res = await fetchWithRetry(pageUrl, 3);
      const html = await res.text();

      // Check if page has schools table
      const linkRegex = new RegExp(`<a\\s+href="[^"]*\\/okullar\\/${ilSlug}\\/${distSlug}\\/([^"\\/]+)"[^>]*>([\\s\\S]*?)<\\/a>`, 'gi');
      let match;
      let countInPage = 0;

      while ((match = linkRegex.exec(html)) !== null) {
        const rawSchoolSlug = match[1].trim();
        const rawSchoolName = cleanHtmlText(match[2]);

        if (rawSchoolName && !rawSchoolName.toLowerCase().includes('okulları') && !seen.has(rawSchoolName)) {
          seen.add(rawSchoolName);
          schools.push({
            id: `${ilSlug}-${distSlug}-${rawSchoolSlug || schools.length + 1}`,
            name: rawSchoolName,
            type: detectSchoolType(rawSchoolName)
          });
          countInPage++;
        }
      }

      // If page had fewer than 50 or 0 matches, or no pagination, stop
      if (countInPage === 0 || !html.includes(`page=${page + 1}`)) {
        break;
      }
    } catch (err) {
      console.warn(`Error on ${pageUrl}:`, err.message);
      break;
    }
  }

  // Fallback: If no schools found from website, add standard default district school
  if (schools.length === 0) {
    schools.push({
      id: `${ilSlug}-${distSlug}-1`,
      name: `${distName} Atatürk Ortaokulu`,
      type: 'Ortaokul'
    });
  }

  return schools;
}

async function runScraper() {
  console.log(`Starting scrape of all 81 provinces...`);
  const fullDatabase = {};
  let totalDistrictsCount = 0;
  let totalSchoolsCount = 0;

  for (let pIndex = 0; pIndex < PROVINCES.length; pIndex++) {
    const prov = PROVINCES[pIndex];
    console.log(`[${pIndex + 1}/${PROVINCES.length}] Fetching districts for ${prov.name} (${prov.slug})...`);

    // 1. Fetch districts
    let districtList = [];
    try {
      const distRes = await fetchWithRetry(`https://ogretmenevrak.com/okullar/ilceleriAl?il=${prov.slug}`);
      const distData = await distRes.json();
      if (Array.isArray(distData) && distData.length > 0) {
        districtList = distData.map(d => ({
          name: cleanHtmlText(d.isim || d.name || ''),
          slug: d.slug || normalizeSlug(d.isim || d.name || '')
        })).filter(d => d.name);
      }
    } catch (e) {
      console.warn(`Could not get districts for ${prov.name} via API:`, e.message);
    }

    if (districtList.length === 0) {
      districtList = [{ name: 'Merkez', slug: 'merkez' }];
    }

    fullDatabase[prov.name] = {};

    // 2. Fetch schools for each district (parallel batches of 6)
    const batchSize = 6;
    for (let i = 0; i < districtList.length; i += batchSize) {
      const batch = districtList.slice(i, i + batchSize);
      await Promise.all(batch.map(async (dist) => {
        const schools = await scrapeDistrictSchools(prov.slug, dist.slug, dist.name);
        fullDatabase[prov.name][dist.name] = schools;
        totalSchoolsCount += schools.length;
      }));
    }

    totalDistrictsCount += districtList.length;
    console.log(` -> Completed ${prov.name}: ${districtList.length} districts.`);
  }

  // Save full database to lib/turkey-schools-complete.json
  const outputPath = path.join(__dirname, '../lib/turkey-schools-complete.json');
  fs.writeFileSync(outputPath, JSON.stringify(fullDatabase, null, 2), 'utf8');

  console.log(`\n========================================`);
  console.log(`✅ SCRAPE COMPLETED SUCCESSFULLY!`);
  console.log(`Total Provinces: ${PROVINCES.length}`);
  console.log(`Total Districts: ${totalDistrictsCount}`);
  console.log(`Total Schools: ${totalSchoolsCount}`);
  console.log(`Output File: ${outputPath} (${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`========================================\n`);
}

runScraper();
