import { ProvinceItem } from '@/types/auth';

export const TURKEY_PROVINCES: ProvinceItem[] = [
  {
    plate: '01',
    name: 'Adana',
    districts: [
      {
        name: 'Seyhan',
        schools: [
          { id: 'ada-sey-1', name: 'Seyhan Ortaokulu', type: 'Ortaokul' },
          { id: 'ada-sey-2', name: 'Atatürk Ortaokulu', type: 'Ortaokul' },
          { id: 'ada-sey-3', name: 'Seyhan İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' },
          { id: 'ada-sey-4', name: 'Cumhuriyet İlkokulu', type: 'İlkokul' },
          { id: 'ada-sey-5', name: 'Seyhan Danişment Gazi Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Çukurova',
        schools: [
          { id: 'ada-cuk-1', name: 'Çukurova Ortaokulu', type: 'Ortaokul' },
          { id: 'ada-cuk-2', name: 'Toros Ortaokulu', type: 'Ortaokul' },
          { id: 'ada-cuk-3', name: 'Güzelyalı Ortaokulu', type: 'Ortaokul' },
          { id: 'ada-cuk-4', name: 'Çukurova İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }
        ]
      },
      {
        name: 'Yüreğir',
        schools: [
          { id: 'ada-yur-1', name: 'Yüreğir Ortaokulu', type: 'Ortaokul' },
          { id: 'ada-yur-2', name: 'Kazım Karabekir Ortaokulu', type: 'Ortaokul' },
          { id: 'ada-yur-3', name: 'Yavuzlar Ortaokulu', type: 'Ortaokul' }
        ]
      },
      { name: 'Sarıçam', schools: [{ id: 'ada-sar-1', name: 'Sarıçam Ortaokulu', type: 'Ortaokul' }, { id: 'ada-sar-2', name: 'Kürkçüler Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Ceyhan', schools: [{ id: 'ada-cey-1', name: 'Ceyhan Ortaokulu', type: 'Ortaokul' }, { id: 'ada-cey-2', name: 'Sakarya Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Kozan', schools: [{ id: 'ada-koz-1', name: 'Kozan Ortaokulu', type: 'Ortaokul' }, { id: 'ada-koz-2', name: 'İsmet İnönü Ortaokulu', type: 'Ortaokul' }] },
      { name: 'İmamoğlu', schools: [{ id: 'ada-ima-1', name: 'İmamoğlu Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Karataş', schools: [{ id: 'ada-kar-1', name: 'Karataş Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Karaisalı', schools: [{ id: 'ada-krs-1', name: 'Karaisalı Atatürk Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Pozantı', schools: [{ id: 'ada-poz-1', name: 'Pozantı Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Yumurtalık', schools: [{ id: 'ada-yum-1', name: 'Yumurtalık Barbaros Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Tufanbeyli', schools: [{ id: 'ada-tuf-1', name: 'Tufanbeyli Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Feke', schools: [{ id: 'ada-fek-1', name: 'Feke Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Aladağ', schools: [{ id: 'ada-ala-1', name: 'Aladağ Pınarözü Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Saimbeyli', schools: [{ id: 'ada-sai-1', name: 'Saimbeyli Ortaokulu', type: 'Ortaokul' }] }
    ]
  },
  {
    plate: '02',
    name: 'Adıyaman',
    districts: [
      { name: 'Merkez', schools: [{ id: 'adi-mer-1', name: 'Adıyaman Fatih Ortaokulu', type: 'Ortaokul' }, { id: 'adi-mer-2', name: 'Cumhuriyet Ortaokulu', type: 'Ortaokul' }, { id: 'adi-mer-3', name: 'Adıyaman İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }] },
      { name: 'Kahta', schools: [{ id: 'adi-kah-1', name: 'Kahta Ortaokulu', type: 'Ortaokul' }, { id: 'adi-kah-2', name: 'Kubilay Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Besni', schools: [{ id: 'adi-bes-1', name: 'Besni Şehit Bekir Oruçtutan Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Gölbaşı', schools: [{ id: 'adi-gol-1', name: 'Gölbaşı 75. Yıl Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Gerger', schools: [{ id: 'adi-ger-1', name: 'Gerger Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Sincik', schools: [{ id: 'adi-sin-1', name: 'Sincik Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Çelikhan', schools: [{ id: 'adi-cel-1', name: 'Çelikhan Şehit Şeyho Şişman Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Tut', schools: [{ id: 'adi-tut-1', name: 'Tut Atatürk Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Samsat', schools: [{ id: 'adi-sam-1', name: 'Samsat Ortaokulu', type: 'Ortaokul' }] }
    ]
  },
  {
    plate: '03',
    name: 'Afyonkarahisar',
    districts: [
      { name: 'Merkez', schools: [{ id: 'afy-mer-1', name: 'Kocatepe Ortaokulu', type: 'Ortaokul' }, { id: 'afy-mer-2', name: 'Afyon Şemsettin Karahisari Ortaokulu', type: 'Ortaokul' }, { id: 'afy-mer-3', name: 'Atatürk Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Sandıklı', schools: [{ id: 'afy-san-1', name: 'Sandıklı Cumhuriyet Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Dinar', schools: [{ id: 'afy-din-1', name: 'Dinar Fatih Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Bolvadin', schools: [{ id: 'afy-bol-1', name: 'Bolvadin Gazi Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Emirdağ', schools: [{ id: 'afy-emi-1', name: 'Emirdağ Atatürk Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Şuhut', schools: [{ id: 'afy-suh-1', name: 'Şuhut Kurtuluş Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Çay', schools: [{ id: 'afy-cay-1', name: 'Çay Atatürk Ortaokulu', type: 'Ortaokul' }] },
      { name: 'İhsaniye', schools: [{ id: 'afy-ihs-1', name: 'İhsaniye Döğer Ortaokulu', type: 'Ortaokul' }] },
      { name: 'İscehisar', schools: [{ id: 'afy-isc-1', name: 'İscehisar Fatih Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Sinanpaşa', schools: [{ id: 'afy-sin-1', name: 'Sinanpaşa Merkez Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Sultandağı', schools: [{ id: 'afy-sul-1', name: 'Sultandağı Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Başmakçı', schools: [{ id: 'afy-bas-1', name: 'Başmakçı Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Bayat', schools: [{ id: 'afy-bay-1', name: 'Bayat Atatürk Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Çobanlar', schools: [{ id: 'afy-cob-1', name: 'Çobanlar Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Dazkırı', schools: [{ id: 'afy-daz-1', name: 'Dazkırı Alkim Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Evciler', schools: [{ id: 'afy-evc-1', name: 'Evciler Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Hocalar', schools: [{ id: 'afy-hoc-1', name: 'Hocalar Şehit Hasan Yalın Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Kızılören', schools: [{ id: 'afy-kiz-1', name: 'Kızılören Ortaokulu', type: 'Ortaokul' }] }
    ]
  },
  {
    plate: '06',
    name: 'Ankara',
    districts: [
      {
        name: 'Çankaya',
        schools: [
          { id: 'ank-can-1', name: 'Çankaya Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-can-2', name: 'Kocatepe Mimar Kemal Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-can-3', name: 'Ahmet Barındırır Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-can-4', name: 'Çankaya Tevfik Fikret Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-can-5', name: 'Gaziosmanpaşa Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-can-6', name: 'Çankaya İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }
        ]
      },
      {
        name: 'Yenimahalle',
        schools: [
          { id: 'ank-yen-1', name: 'Yenimahalle Şehit Sercan Öztürk Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-yen-2', name: 'Batıkent Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-yen-3', name: 'Prof. Dr. Mehmet Sağlam Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-yen-4', name: 'Yenimahalle İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }
        ]
      },
      {
        name: 'Keçiören',
        schools: [
          { id: 'ank-kec-1', name: 'Keçiören Şehit Fatih Erdoğan Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-kec-2', name: 'Yalçın Eskiyapan Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-kec-3', name: 'Etlik Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-kec-4', name: 'Keçiören İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }
        ]
      },
      {
        name: 'Mamak',
        schools: [
          { id: 'ank-mam-1', name: 'Mamak Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-mam-2', name: 'Abidinpaşa Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-mam-3', name: 'Köstence Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Etimesgut',
        schools: [
          { id: 'ank-eti-1', name: 'Etimesgut Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-eti-2', name: 'Elvankent Bilgisel Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-eti-3', name: 'Eryaman Şehit Abdulkadir Yüzbaşıoğlu Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Sincan',
        schools: [
          { id: 'ank-sin-1', name: 'Sincan İl Genel Meclisi Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-sin-2', name: 'Ali Fuat Başgil Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-sin-3', name: 'Sincan İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }
        ]
      },
      {
        name: 'Altındağ',
        schools: [
          { id: 'ank-alt-1', name: 'Altındağ Mehmet Akif Ersoy Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-alt-2', name: 'Ulubatlı Hasan Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-alt-3', name: 'Hacı Bayram Veli İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }
        ]
      },
      {
        name: 'Gölbaşı',
        schools: [
          { id: 'ank-gol-1', name: 'Gölbaşı TEK Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-gol-2', name: 'Sevgi Çiçeği Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Pursaklar',
        schools: [
          { id: 'ank-pur-1', name: 'Pursaklar Feride Bekçioğlu Ortaokulu', type: 'Ortaokul' },
          { id: 'ank-pur-2', name: 'Pursaklar İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }
        ]
      },
      { name: 'Polatlı', schools: [{ id: 'ank-pol-1', name: 'Polatlı Ruhiye İrfan Yurtseven Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Çubuk', schools: [{ id: 'ank-cub-1', name: 'Çubuk Bekir Yılmaz Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Kahramankazan', schools: [{ id: 'ank-kaz-1', name: 'Kahramankazan Şehit Lokman Biçinci Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Beypazarı', schools: [{ id: 'ank-bey-1', name: 'Beypazarı Namık Kemal Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Elmadağ', schools: [{ id: 'ank-elm-1', name: 'Elmadağ Dr. Ahmet Kazım Mıhçıoğlu Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Akyurt', schools: [{ id: 'ank-aky-1', name: 'Akyurt Büğdüz Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Nallıhan', schools: [{ id: 'ank-nal-1', name: 'Nallıhan Sakarya Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Haymana', schools: [{ id: 'ank-hay-1', name: 'Haymana Mahmut Hilmi Doğan Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Kızılcahamam', schools: [{ id: 'ank-kiz-1', name: 'Kızılcahamam Orhangazi Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Bala', schools: [{ id: 'ank-bal-1', name: 'Bala Kemal Şahin Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Kalecik', schools: [{ id: 'ank-kal-1', name: 'Kalecik Şehit Mehmet Yıldırım Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Ayaş', schools: [{ id: 'ank-aya-1', name: 'Ayaş Gazi Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Güdül', schools: [{ id: 'ank-gud-1', name: 'Güdül Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Çamlıdere', schools: [{ id: 'ank-cam-1', name: 'Çamlıdere Osmansin Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Evren', schools: [{ id: 'ank-evr-1', name: 'Evren Zeki Uğur Ortaokulu', type: 'Ortaokul' }] }
    ]
  },
  {
    plate: '07',
    name: 'Antalya',
    districts: [
      {
        name: 'Muratpaşa',
        schools: [
          { id: 'ant-mur-1', name: 'Muratpaşa Atatürk Ortaokulu', type: 'Ortaokul' },
          { id: 'ant-mur-2', name: 'Hanım Ömer Çağıran Ortaokulu', type: 'Ortaokul' },
          { id: 'ant-mur-3', name: 'Muratpaşa Namık Kemal Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Kepez',
        schools: [
          { id: 'ant-kep-1', name: 'Kepez Şehit Çetin Çakmak Ortaokulu', type: 'Ortaokul' },
          { id: 'ant-kep-2', name: 'Varsak Şelale Ortaokulu', type: 'Ortaokul' },
          { id: 'ant-kep-3', name: 'Kepez Mahmut Celalettin Ökten İHO', type: 'İmam Hatip Ortaokulu' }
        ]
      },
      {
        name: 'Konyaaltı',
        schools: [
          { id: 'ant-kon-1', name: 'Konyaaltı Bedriye Bileydi Ortaokulu', type: 'Ortaokul' },
          { id: 'ant-kon-2', name: 'Liman Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Alanya',
        schools: [
          { id: 'ant-ala-1', name: 'Alanya Hasan Çolak Anadolu Lisesi', type: 'Lise' },
          { id: 'ant-ala-2', name: 'Alanya Hacıkadiroğlu Ortaokulu', type: 'Ortaokul' },
          { id: 'ant-ala-3', name: 'Mahmutlar Ortaokulu', type: 'Ortaokul' }
        ]
      },
      { name: 'Manavgat', schools: [{ id: 'ant-man-1', name: 'Manavgat Atatürk Ortaokulu', type: 'Ortaokul' }, { id: 'ant-man-2', name: 'Toros Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Serik', schools: [{ id: 'ant-ser-1', name: 'Serik Tekeli Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Döşemealtı', schools: [{ id: 'ant-dos-1', name: 'Döşemealtı Hilmi Caner Karaaslan Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Kumluca', schools: [{ id: 'ant-kum-1', name: 'Kumluca Ziya Gökalp Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Kaş', schools: [{ id: 'ant-kas-1', name: 'Kaş Atatürk Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Korkuteli', schools: [{ id: 'ant-kor-1', name: 'Korkuteli Cumhuriyet Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Gazipaşa', schools: [{ id: 'ant-gaz-1', name: 'Gazipaşa İstiklal Şehit Süleyman Gür Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Finike', schools: [{ id: 'ant-fin-1', name: 'Finike Cengiz Topel Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Kemer', schools: [{ id: 'ant-kem-1', name: 'Kemer Mustafa Rüştü Tuncer Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Elmalı', schools: [{ id: 'ant-elm-1', name: 'Elmalı Mehmet Topçu Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Demre', schools: [{ id: 'ant-dem-1', name: 'Demre 80. Yıl Cumhuriyet Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Akseki', schools: [{ id: 'ant-aks-1', name: 'Akseki Cevizli Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Gündoğmuş', schools: [{ id: 'ant-gun-1', name: 'Gündoğmuş Merkez Ortaokulu', type: 'Ortaokul' }] },
      { name: 'İbradı', schools: [{ id: 'ant-ibr-1', name: 'İbradı Necla-Tevfik Atasagun Ortaokulu', type: 'Ortaokul' }] }
    ]
  },
  {
    plate: '16',
    name: 'Bursa',
    districts: [
      {
        name: 'Osmangazi',
        schools: [
          { id: 'bur-osm-1', name: 'Osmangazi Şehit Sinan Şen Ortaokulu', type: 'Ortaokul' },
          { id: 'bur-osm-2', name: 'Kükürtlü Ticaret ve Sanayi Odası Ortaokulu', type: 'Ortaokul' },
          { id: 'bur-osm-3', name: 'Muradiye Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Nilüfer',
        schools: [
          { id: 'bur-nil-1', name: 'Nilüfer Dilek Özer Ortaokulu', type: 'Ortaokul' },
          { id: 'bur-nil-2', name: 'Ali Durmaz Ortaokulu', type: 'Ortaokul' },
          { id: 'bur-nil-3', name: 'Özlüce Şehit Aykut Delimehmetoğlu İHO', type: 'İmam Hatip Ortaokulu' }
        ]
      },
      {
        name: 'Yıldırım',
        schools: [
          { id: 'bur-yil-1', name: 'Yıldırım Selçuk Hatun Ortaokulu', type: 'Ortaokul' },
          { id: 'bur-yil-2', name: 'Peyami Safa Ortaokulu', type: 'Ortaokul' }
        ]
      },
      { name: 'İnegöl', schools: [{ id: 'bur-ine-1', name: 'İnegöl Gaziosmanpaşa İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }, { id: 'bur-ine-2', name: 'Dumlupınar Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Gemlik', schools: [{ id: 'bur-gem-1', name: 'Gemlik Ali Kütük Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Mustafakemalpaşa', schools: [{ id: 'bur-mus-1', name: 'Mustafakemalpaşa Yalıntaş Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Mudanya', schools: [{ id: 'bur-mud-1', name: 'Mudanya Şaziye Rüştü Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Gürsu', schools: [{ id: 'bur-gur-1', name: 'Gürsu Zafer Dörtçelik Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Karacabey', schools: [{ id: 'bur-kar-1', name: 'Karacabey Şehit Bahadır Tayfur Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Orhangazi', schools: [{ id: 'bur-orh-1', name: 'Orhangazi Gazi Osman Paşa Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Kestel', schools: [{ id: 'bur-kes-1', name: 'Kestel Şehit Emre Karaaslan Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Yenişehir', schools: [{ id: 'bur-yen-1', name: 'Yenişehir Tahirağa Ortaokulu', type: 'Ortaokul' }] },
      { name: 'İznik', schools: [{ id: 'bur-izn-1', name: 'İznik Selçuk Ortaokulu', type: 'Ortaokul' }] }
    ]
  },
  {
    plate: '22',
    name: 'Edirne',
    districts: [
      {
        name: 'Merkez',
        schools: [
          { id: 'edr-mer-1', name: 'Edirne Selimiye İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' },
          { id: 'edr-mer-2', name: 'Atatürk Ortaokulu', type: 'Ortaokul' },
          { id: 'edr-mer-3', name: 'Kırkpınar Ağası Alper Yazoğlu Ortaokulu', type: 'Ortaokul' },
          { id: 'edr-mer-4', name: 'Gazi Osman Paşa Ortaokulu', type: 'Ortaokul' },
          { id: 'edr-mer-5', name: 'Fatih Sultan Mehmet Ortaokulu', type: 'Ortaokul' }
        ]
      },
      { name: 'Keşan', schools: [{ id: 'edr-kes-1', name: 'Keşan Ahmet Yenice Ortaokulu', type: 'Ortaokul' }, { id: 'edr-kes-2', name: 'Yekta Baydar Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Uzunköprü', schools: [{ id: 'edr-uzun-1', name: 'Uzunköprü Atatürk Ortaokulu', type: 'Ortaokul' }] },
      { name: 'İpsala', schools: [{ id: 'edr-ips-1', name: 'İpsala Şehit Polis İbrahim Sever Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Havsa', schools: [{ id: 'edr-hav-1', name: 'Havsa Atatürk Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Meriç', schools: [{ id: 'edr-mer-sub-1', name: 'Meriç Şehit Öğretmen Aydın Yılmaz Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Enez', schools: [{ id: 'edr-ene-1', name: 'Enez Atatürk Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Süloğlu', schools: [{ id: 'edr-sul-1', name: 'Süloğlu Cumhuriyet Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Lalapaşa', schools: [{ id: 'edr-lal-1', name: 'Lalapaşa Atatürk Ortaokulu', type: 'Ortaokul' }] }
    ]
  },
  {
    plate: '34',
    name: 'İstanbul',
    districts: [
      {
        name: 'Kadıköy',
        schools: [
          { id: 'ist-kad-1', name: 'Kadıköy Melahat Şefizade Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-kad-2', name: 'Göztepe İhsan Kurşunoğlu Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-kad-3', name: 'Moda İlkokulu', type: 'İlkokul' },
          { id: 'ist-kad-4', name: 'Kadıköy İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' },
          { id: 'ist-kad-5', name: 'Kazım İşmen Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Beşiktaş',
        schools: [
          { id: 'ist-bes-1', name: 'Beşiktaş Tevfik Fikret Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-bes-2', name: 'Gazi Mustafa Kemal Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-bes-3', name: 'Beşiktaş İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }
        ]
      },
      {
        name: 'Üsküdar',
        schools: [
          { id: 'ist-usk-1', name: 'Üsküdar Hakkı Demir Anadolu İHL (Ortaokul)', type: 'İmam Hatip Ortaokulu' },
          { id: 'ist-usk-2', name: 'Kandilli Kız Lisesi', type: 'Lise' },
          { id: 'ist-usk-3', name: 'Altunizade Hafize Özal Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-usk-4', name: 'Acıbadem Türk Telekom Şehit Mete Sertbaş Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Bakırköy',
        schools: [
          { id: 'ist-bak-1', name: 'Bakırköy Şehit Pilot Muzaffer Erdönmez Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-bak-2', name: 'Yeşilköy 2001 Koleji', type: 'Diğer' },
          { id: 'ist-bak-3', name: 'Bakırköy Atatürk İlkokulu', type: 'İlkokul' }
        ]
      },
      {
        name: 'Fatih',
        schools: [
          { id: 'ist-fat-1', name: 'Fatih Vatan Mesleki ve Teknik Anadolu Lisesi', type: 'Lise' },
          { id: 'ist-fat-2', name: 'Fatih İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' },
          { id: 'ist-fat-3', name: 'Hırka-i Şerif Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Şişli',
        schools: [
          { id: 'ist-sis-1', name: 'Şişli Nilüfer Hatun Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-sis-2', name: 'Talatpaşa Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-sis-3', name: 'Şişli Terakki Lisesi', type: 'Lise' }
        ]
      },
      {
        name: 'Ümraniye',
        schools: [
          { id: 'ist-umr-1', name: 'Ümraniye Yamanevler Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-umr-2', name: 'Atakent Şehit Selçuk Paker Anadolu Lisesi', type: 'Lise' },
          { id: 'ist-umr-3', name: 'Şehit Erol İnce Kız Anadolu İHL', type: 'İmam Hatip Ortaokulu' }
        ]
      },
      {
        name: 'Pendik',
        schools: [
          { id: 'ist-pen-1', name: 'Pendik Alparslan Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-pen-2', name: 'Kurtköy Şehit Adil Büyükcengiz AİHL', type: 'İmam Hatip Ortaokulu' },
          { id: 'ist-pen-3', name: 'Pendik Fatih Sultan Mehmet Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Maltepe',
        schools: [
          { id: 'ist-mal-1', name: 'Maltepe Küçükyalı E.C.A Elginkan Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-mal-2', name: 'Gülensu Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Kartal',
        schools: [
          { id: 'ist-kar-1', name: 'Kartal Bedri Rahmi Eyüboğlu İlkokulu', type: 'İlkokul' },
          { id: 'ist-kar-2', name: 'Kartal Cevizli Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-kar-3', name: 'Kartal Anadolu İmam Hatip Lisesi', type: 'İmam Hatip Ortaokulu' }
        ]
      },
      {
        name: 'Başakşehir',
        schools: [
          { id: 'ist-bas-1', name: 'Başakşehir Borsa İstanbul İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' },
          { id: 'ist-bas-2', name: 'Oyakkent Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-bas-3', name: 'Bahçeşehir İMKB Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Beylikdüzü',
        schools: [
          { id: 'ist-bey-1', name: 'Beylikdüzü Dr. Ayla Savaş Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-bey-2', name: 'Yakuplu Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Ataşehir',
        schools: [
          { id: 'ist-ata-1', name: 'Ataşehir Ali Fuat Cebesoy İlkokulu', type: 'İlkokul' },
          { id: 'ist-ata-2', name: 'Mustafa Zeki Demir Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Sarıyer',
        schools: [
          { id: 'ist-sar-1', name: 'Sarıyer Veysel Vardal Görme Engelliler Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-sar-2', name: 'Ayazağa Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Küçükçekmece',
        schools: [
          { id: 'ist-kuc-1', name: 'Küçükçekmece Söğütlüçeşme Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-kuc-2', name: 'Halkalı Güneş Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Esenyurt',
        schools: [
          { id: 'ist-ese-1', name: 'Esenyurt Siteler Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-ese-2', name: 'Yunus Emre İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }
        ]
      },
      {
        name: 'Bağcılar',
        schools: [
          { id: 'ist-bag-1', name: 'Bağcılar Teyfik İleri Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-bag-2', name: 'Mahmutbey Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Avcılar',
        schools: [
          { id: 'ist-avc-1', name: 'Avcılar Alsancak Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-avc-2', name: 'Avcılar Borusan Oto Zehra-Nurhan Kocabıyık Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Tuzla',
        schools: [
          { id: 'ist-tuz-1', name: 'Tuzla İhsan Hayriye Hürdoğan Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-tuz-2', name: 'Piri Reis Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Zeytinburnu',
        schools: [
          { id: 'ist-zey-1', name: 'Zeytinburnu Kazım Özalp Ortaokulu', type: 'Ortaokul' },
          { id: 'ist-zey-2', name: 'Zübeyde Hanım Ortaokulu', type: 'Ortaokul' }
        ]
      },
      { name: 'Gaziosmanpaşa', schools: [{ id: 'ist-gop-1', name: 'GOP Havuzbaşı Atilla Baykal Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Sultangazi', schools: [{ id: 'ist-sug-1', name: 'Sultangazi Cebeci Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Eyüpsultan', schools: [{ id: 'ist-eyu-1', name: 'Eyüpsultan Şehit Murat Karakuş Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Büyükçekmece', schools: [{ id: 'ist-buy-1', name: 'Büyükçekmece Tepecik Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Kağıthane', schools: [{ id: 'ist-kag-1', name: 'Kağıthane Çamlıca Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Esenler', schools: [{ id: 'ist-esn-1', name: 'Esenler Ressam Şevket Dağ Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Beyoğlu', schools: [{ id: 'ist-beyo-1', name: 'Beyoğlu Kasımpaşa Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Güngören', schools: [{ id: 'ist-gun-1', name: 'Güngören Ali Fuat Cebesoy İHO', type: 'İmam Hatip Ortaokulu' }] },
      { name: 'Bayrampaşa', schools: [{ id: 'ist-bay-1', name: 'Bayrampaşa Fetihtepe Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Çekmeköy', schools: [{ id: 'ist-cek-1', name: 'Çekmeköy Nükte Sözen Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Sancaktepe', schools: [{ id: 'ist-san-1', name: 'Sancaktepe Şehit Semih Balaban Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Silivri', schools: [{ id: 'ist-sil-1', name: 'Silivri Gazi İlkokulu & Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Beykoz', schools: [{ id: 'ist-beyk-1', name: 'Beykoz Şehit İsmail Kefal Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Çatalca', schools: [{ id: 'ist-cat-1', name: 'Çatalca İzzettin Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Şile', schools: [{ id: 'ist-sle-1', name: 'Şile Ahmetli Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Adalar', schools: [{ id: 'ist-ada-1', name: 'Büyükada 125. Yıl Atatürk Ortaokulu', type: 'Ortaokul' }] }
    ]
  },
  {
    plate: '35',
    name: 'İzmir',
    districts: [
      {
        name: 'Konak',
        schools: [
          { id: 'izm-kon-1', name: 'Konak Atatürk Lisesi', type: 'Lise' },
          { id: 'izm-kon-2', name: 'Konak Kazım Karabekir Ortaokulu', type: 'Ortaokul' },
          { id: 'izm-kon-3', name: 'Konak İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }
        ]
      },
      {
        name: 'Bornova',
        schools: [
          { id: 'izm-bor-1', name: 'Bornova Suphi Koyuncuoğlu Anadolu Lisesi', type: 'Lise' },
          { id: 'izm-bor-2', name: 'Bornova Batıçim Ortaokulu', type: 'Ortaokul' },
          { id: 'izm-bor-3', name: 'Bornova Şehit Onbaşı Ali Güner Aktaş Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Karşıyaka',
        schools: [
          { id: 'izm-kar-1', name: 'Karşıyaka Ankara İlkokulu / Ortaokulu', type: 'Ortaokul' },
          { id: 'izm-kar-2', name: 'Emlakbank Konutları Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Buca',
        schools: [
          { id: 'izm-buc-1', name: 'Buca Meşkure Şamlı Ortaokulu', type: 'Ortaokul' },
          { id: 'izm-buc-2', name: 'Buca Şehit Coşkun Elber Ortaokulu', type: 'Ortaokul' }
        ]
      },
      {
        name: 'Karabağlar',
        schools: [
          { id: 'izm-kba-1', name: 'Karabağlar Necmettin Erbakan İHO', type: 'İmam Hatip Ortaokulu' },
          { id: 'izm-kba-2', name: 'Peker Mahallesi Ortaokulu', type: 'Ortaokul' }
        ]
      },
      { name: 'Bayraklı', schools: [{ id: 'izm-bay-1', name: 'Bayraklı Mustafa Çukur Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Çiğli', schools: [{ id: 'izm-cig-1', name: 'Çiğli Sasalı Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Gaziemir', schools: [{ id: 'izm-gaz-1', name: 'Gaziemir Şehit Dursun Acar Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Menemen', schools: [{ id: 'izm-men-1', name: 'Menemen Şehit Kemal Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Torbalı', schools: [{ id: 'izm-tor-1', name: 'Torbalı Atatürk Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Kemalpaşa', schools: [{ id: 'izm-kem-1', name: 'Kemalpaşa Ferzent Bulum Anadolu Lisesi', type: 'Lise' }] },
      { name: 'Aliağa', schools: [{ id: 'izm-ali-1', name: 'Aliağa Petrokimya Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Menderes', schools: [{ id: 'izm-mnd-1', name: 'Menderes Alparslan Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Ödemiş', schools: [{ id: 'izm-ode-1', name: 'Ödemiş 50. Yıl Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Bergama', schools: [{ id: 'izm-ber-1', name: 'Bergama 14 Eylül Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Urla', schools: [{ id: 'izm-url-1', name: 'Urla Atatürk Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Tire', schools: [{ id: 'izm-tir-1', name: 'Tire Dört Eylül Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Seferihisar', schools: [{ id: 'izm-sef-1', name: 'Seferihisar Tepecik Ortaokulu', type: 'Ortaokul' }] },
      { name: 'Çeşme', schools: [{ id: 'izm-ces-1', name: 'Çeşme Sıdıka Kelami Ertan Ortaokulu', type: 'Ortaokul' }] }
    ]
  },
  // All other provinces 
  { plate: '04', name: 'Ağrı', districts: [{ name: 'Merkez', schools: [{ id: 'agr-mer-1', name: 'Ağrı 15 Temmuz Şehitleri Ortaokulu', type: 'Ortaokul' }] }, { name: 'Doğubayazıt', schools: [{ id: 'agr-dog-1', name: 'Doğubayazıt Atatürk Ortaokulu', type: 'Ortaokul' }] }, { name: 'Patnos', schools: [{ id: 'agr-pat-1', name: 'Patnos Cengiz Çıkrık Ortaokulu', type: 'Ortaokul' }] }, { name: 'Diyadin', schools: [{ id: 'agr-diy-1', name: 'Diyadin Atatürk Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '05', name: 'Amasya', districts: [{ name: 'Merkez', schools: [{ id: 'ama-mer-1', name: 'Amasya Şehit Şencan Yılmaz Ortaokulu', type: 'Ortaokul' }] }, { name: 'Merzifon', schools: [{ id: 'ama-mrz-1', name: 'Merzifon Mehmet Çelebi Ortaokulu', type: 'Ortaokul' }] }, { name: 'Suluova', schools: [{ id: 'ama-sul-1', name: 'Suluova Şehit Ergin Komut Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '08', name: 'Artvin', districts: [{ name: 'Merkez', schools: [{ id: 'art-mer-1', name: 'Artvin Gazi Ortaokulu', type: 'Ortaokul' }] }, { name: 'Hopa', schools: [{ id: 'art-hop-1', name: 'Hopa Atatürk Ortaokulu', type: 'Ortaokul' }] }, { name: 'Borçka', schools: [{ id: 'art-bor-1', name: 'Borçka Mehmet Akif Ersoy Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '09', name: 'Aydın', districts: [{ name: 'Efeler', schools: [{ id: 'ayd-efe-1', name: 'Efeler Gazipaşa Ortaokulu', type: 'Ortaokul' }] }, { name: 'Nazilli', schools: [{ id: 'ayd-naz-1', name: 'Nazilli Beşeylül Ortaokulu', type: 'Ortaokul' }] }, { name: 'Söke', schools: [{ id: 'ayd-sok-1', name: 'Söke Fevzipaşa Ortaokulu', type: 'Ortaokul' }] }, { name: 'Kuşadası', schools: [{ id: 'ayd-kus-1', name: 'Kuşadası İkiçeşmelik Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '10', name: 'Balıkesir', districts: [{ name: 'Karesi', schools: [{ id: 'bal-kar-1', name: 'Balıkesir Karesi Ortaokulu', type: 'Ortaokul' }] }, { name: 'Altıeylül', schools: [{ id: 'bal-alt-1', name: 'Altıeylül Plevne Ortaokulu', type: 'Ortaokul' }] }, { name: 'Bandırma', schools: [{ id: 'bal-ban-1', name: 'Bandırma Vecihibey Ortaokulu', type: 'Ortaokul' }] }, { name: 'Edremit', schools: [{ id: 'bal-edr-1', name: 'Edremit Şehit Hamdibey Ortaokulu', type: 'Ortaokul' }] }, { name: 'Ayvalık', schools: [{ id: 'bal-ayv-1', name: 'Ayvalık Sakarya Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '11', name: 'Bilecik', districts: [{ name: 'Merkez', schools: [{ id: 'bil-mer-1', name: 'Bilecik Murat Hüdavendigar Ortaokulu', type: 'Ortaokul' }] }, { name: 'Bozüyük', schools: [{ id: 'bil-boz-1', name: 'Bozüyük Mehmet Akif Ersoy Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '12', name: 'Bingöl', districts: [{ name: 'Merkez', schools: [{ id: 'bin-mer-1', name: 'Bingöl 100. Yıl Ortaokulu', type: 'Ortaokul' }] }, { name: 'Genç', schools: [{ id: 'bin-gen-1', name: 'Genç İnönü Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '13', name: 'Bitlis', districts: [{ name: 'Merkez', schools: [{ id: 'bit-mer-1', name: 'Bitlis 8 Ağustos Ortaokulu', type: 'Ortaokul' }] }, { name: 'Tatvan', schools: [{ id: 'bit-tat-1', name: 'Tatvan Atatürk Ortaokulu', type: 'Ortaokul' }] }, { name: 'Ahlat', schools: [{ id: 'bit-ahl-1', name: 'Ahlat Ergezen Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '14', name: 'Bolu', districts: [{ name: 'Merkez', schools: [{ id: 'bol-mer-1', name: 'Bolu 50. Yıl İzzet Baysal Ortaokulu', type: 'Ortaokul' }] }, { name: 'Gerede', schools: [{ id: 'bol-ger-1', name: 'Gerede 100. Yıl İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }] }] },
  { plate: '15', name: 'Burdur', districts: [{ name: 'Merkez', schools: [{ id: 'bur-mer-1', name: 'Burdur Şehit Akif Altay Ortaokulu', type: 'Ortaokul' }] }, { name: 'Bucak', schools: [{ id: 'bur-buc-1', name: 'Bucak Mehmet Akif Ersoy Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '17', name: 'Çanakkale', districts: [{ name: 'Merkez', schools: [{ id: 'can-mer-1', name: 'Çanakkale Cevatpaşa Ortaokulu', type: 'Ortaokul' }] }, { name: 'Biga', schools: [{ id: 'can-big-1', name: 'Biga Dumlupınar Ortaokulu', type: 'Ortaokul' }] }, { name: 'Gelibolu', schools: [{ id: 'can-gel-1', name: 'Gelibolu 26 Kasım Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '18', name: 'Çankırı', districts: [{ name: 'Merkez', schools: [{ id: 'cnk-mer-1', name: 'Çankırı İsmet İnönü Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '19', name: 'Çorum', districts: [{ name: 'Merkez', schools: [{ id: 'cor-mer-1', name: 'Çorum 23 Nisan Ortaokulu', type: 'Ortaokul' }] }, { name: 'Sungurlu', schools: [{ id: 'cor-sun-1', name: 'Sungurlu Fatih Ortaokulu', type: 'Ortaokul' }] }, { name: 'Osmancık', schools: [{ id: 'cor-osm-1', name: 'Osmancık Atatürk Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '20', name: 'Denizli', districts: [{ name: 'Pamukkale', schools: [{ id: 'den-pam-1', name: 'Pamukkale Ressam İbrahim Çallı Ortaokulu', type: 'Ortaokul' }] }, { name: 'Merkezefendi', schools: [{ id: 'den-mer-1', name: 'Merkezefendi Servergazi İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }] }] },
  { plate: '21', name: 'Diyarbakır', districts: [{ name: 'Kayapınar', schools: [{ id: 'diy-kay-1', name: 'Kayapınar Şehit Şehmus Demir Ortaokulu', type: 'Ortaokul' }] }, { name: 'Bağlar', schools: [{ id: 'diy-bag-1', name: 'Bağlar Fatih Ortaokulu', type: 'Ortaokul' }] }, { name: 'Yenişehir', schools: [{ id: 'diy-yen-1', name: 'Yenişehir Ali Amiri Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '23', name: 'Elazığ', districts: [{ name: 'Merkez', schools: [{ id: 'ela-mer-1', name: 'Elazığ Mehmet Akif Ersoy Ortaokulu', type: 'Ortaokul' }] }, { name: 'Kovancılar', schools: [{ id: 'ela-kov-1', name: 'Kovancılar Atatürk Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '24', name: 'Erzincan', districts: [{ name: 'Merkez', schools: [{ id: 'erz-mer-1', name: 'Erzincan Demirkent TOKİ Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '25', name: 'Erzurum', districts: [{ name: 'Yakutiye', schools: [{ id: 'erzu-yak-1', name: 'Yakutiye Kazım Karabekir İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }] }, { name: 'Palandöken', schools: [{ id: 'erzu-pal-1', name: 'Palandöken Kayakyolu Çimento Müstahsilleri Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '26', name: 'Eskişehir', districts: [{ name: 'Tepebaşı', schools: [{ id: 'esk-tep-1', name: 'Tepebaşı Melahat Ünügür Ortaokulu', type: 'Ortaokul' }] }, { name: 'Odunpazarı', schools: [{ id: 'esk-odu-1', name: 'Odunpazarı Ahmet Sezer Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '27', name: 'Gaziantep', districts: [{ name: 'Şahinbey', schools: [{ id: 'gaz-sah-1', name: 'Şahinbey Pakize Kemal Öğücü Ortaokulu', type: 'Ortaokul' }] }, { name: 'Şehitkamil', schools: [{ id: 'gaz-seh-1', name: 'Şehitkamil Hatice Mustafa Gençten Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '28', name: 'Giresun', districts: [{ name: 'Merkez', schools: [{ id: 'gir-mer-1', name: 'Giresun Mustafa Kemal Ortaokulu', type: 'Ortaokul' }] }, { name: 'Bulancak', schools: [{ id: 'gir-bul-1', name: 'Bulancak Mehmet Akif Ersoy Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '29', name: 'Gümüşhane', districts: [{ name: 'Merkez', schools: [{ id: 'gum-mer-1', name: 'Gümüşhane Gazipaşa Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '30', name: 'Hakkari', districts: [{ name: 'Merkez', schools: [{ id: 'hak-mer-1', name: 'Hakkari Gazi Mustafa Kemal Ortaokulu', type: 'Ortaokul' }] }, { name: 'Yüksekova', schools: [{ id: 'hak-yuk-1', name: 'Yüksekova İsmet Alkan Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '31', name: 'Hatay', districts: [{ name: 'Antakya', schools: [{ id: 'hat-ant-1', name: 'Antakya Atatürk Ortaokulu', type: 'Ortaokul' }] }, { name: 'İskenderun', schools: [{ id: 'hat-isk-1', name: 'İskenderun Namık Kemal Ortaokulu', type: 'Ortaokul' }] }, { name: 'Defne', schools: [{ id: 'hat-def-1', name: 'Defne Çekmece Şehit Türkmen Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '32', name: 'Isparta', districts: [{ name: 'Merkez', schools: [{ id: 'isp-mer-1', name: 'Isparta Ülkü Ortaokulu', type: 'Ortaokul' }] }, { name: 'Yalvaç', schools: [{ id: 'isp-yal-1', name: 'Yalvaç Kaymakam Abdurrahman Bey Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '33', name: 'Mersin', districts: [{ name: 'Yenişehir', schools: [{ id: 'mer-yen-1', name: 'Yenişehir Aliye Pozcu Ortaokulu', type: 'Ortaokul' }] }, { name: 'Toroslar', schools: [{ id: 'mer-tor-1', name: 'Toroslar Candan Merzeci Ortaokulu', type: 'Ortaokul' }] }, { name: 'Mezitli', schools: [{ id: 'mer-mez-1', name: 'Mezitli Ahmet Hocaoğlu Ortaokulu', type: 'Ortaokul' }] }, { name: 'Tarsus', schools: [{ id: 'mer-tar-1', name: 'Tarsus Kasım Ekenler Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '36', name: 'Kars', districts: [{ name: 'Merkez', schools: [{ id: 'kar-mer-1', name: 'Kars Fevzi Paşa Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '37', name: 'Kastamonu', districts: [{ name: 'Merkez', schools: [{ id: 'kas-mer-1', name: 'Kastamonu Şehit Şerife Bacı Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '38', name: 'Kayseri', districts: [{ name: 'Melikgazi', schools: [{ id: 'kay-mel-1', name: 'Melikgazi Besime Özderici Ortaokulu', type: 'Ortaokul' }] }, { name: 'Kocasinan', schools: [{ id: 'kay-koc-1', name: 'Kocasinan Şehit Yiğitcan Çiğa Ortaokulu', type: 'Ortaokul' }] }, { name: 'Talas', schools: [{ id: 'kay-tal-1', name: 'Talas Bilge Kağan Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '39', name: 'Kırklareli', districts: [{ name: 'Merkez', schools: [{ id: 'krk-mer-1', name: 'Kırklareli Atatürk Ortaokulu', type: 'Ortaokul' }] }, { name: 'Lüleburgaz', schools: [{ id: 'krk-lul-1', name: 'Lüleburgaz Fehmi Mutlu Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '40', name: 'Kırşehir', districts: [{ name: 'Merkez', schools: [{ id: 'krs-mer-1', name: 'Kırşehir Cacabey Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '41', name: 'Kocaeli', districts: [{ name: 'İzmit', schools: [{ id: 'koc-izm-1', name: 'İzmit 50. Yıl Cumhuriyet Ortaokulu', type: 'Ortaokul' }] }, { name: 'Gebze', schools: [{ id: 'koc-geb-1', name: 'Gebze Mustafa Üstündağ Ortaokulu', type: 'Ortaokul' }] }, { name: 'Gölcük', schools: [{ id: 'koc-gol-1', name: 'Gölcük Değirmendere Uğur Mumcu Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '42', name: 'Konya', districts: [{ name: 'Selçuklu', schools: [{ id: 'kon-sel-1', name: 'Selçuklu Mareşal Mustafa Kemal Ortaokulu', type: 'Ortaokul' }] }, { name: 'Meram', schools: [{ id: 'kon-mer-1', name: 'Meram Mehmet Beğen Ortaokulu', type: 'Ortaokul' }] }, { name: 'Karatay', schools: [{ id: 'kon-kar-1', name: 'Karatay Şehit Albay İbrahim Karaoğlanoğlu İHO', type: 'İmam Hatip Ortaokulu' }] }, { name: 'Ereğli', schools: [{ id: 'kon-ere-1', name: 'Ereğli Atatürk Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '43', name: 'Kütahya', districts: [{ name: 'Merkez', schools: [{ id: 'kut-mer-1', name: 'Kütahya Fatih Sultan Mehmet Ortaokulu', type: 'Ortaokul' }] }, { name: 'Tavşanlı', schools: [{ id: 'kut-tav-1', name: 'Tavşanlı Atatürk Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '44', name: 'Malatya', districts: [{ name: 'Battalgazi', schools: [{ id: 'mal-bat-1', name: 'Battalgazi Rahmi Akıncı Ortaokulu', type: 'Ortaokul' }] }, { name: 'Yeşilyurt', schools: [{ id: 'mal-yes-1', name: 'Yeşilyurt Abdulkadir Eriş Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '45', name: 'Manisa', districts: [{ name: 'Yunusemre', schools: [{ id: 'man-yun-1', name: 'Yunusemre Çağatay Uluçay Ortaokulu', type: 'Ortaokul' }] }, { name: 'Şehzadeler', schools: [{ id: 'man-seh-1', name: 'Şehzadeler Ali Rıza Çevik Ortaokulu', type: 'Ortaokul' }] }, { name: 'Akhisar', schools: [{ id: 'man-akh-1', name: 'Akhisar Misak-ı Milli İlkokulu/Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '46', name: 'Kahramanmaraş', districts: [{ name: 'Onikişubat', schools: [{ id: 'kmar-oni-1', name: 'Onikişubat Şehit Öğretmenler Ortaokulu', type: 'Ortaokul' }] }, { name: 'Dulkadiroğlu', schools: [{ id: 'kmar-dul-1', name: 'Dulkadiroğlu Hoca Ahmet Yesevi İHO', type: 'İmam Hatip Ortaokulu' }] }, { name: 'Elbistan', schools: [{ id: 'kmar-elb-1', name: 'Elbistan Şehit Er Cuma Potuk Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '47', name: 'Mardin', districts: [{ name: 'Artuklu', schools: [{ id: 'mar-art-1', name: 'Artuklu Noter Cevdet Altun Ortaokulu', type: 'Ortaokul' }] }, { name: 'Kızıltepe', schools: [{ id: 'mar-kiz-1', name: 'Kızıltepe Mehmetçik Ortaokulu', type: 'Ortaokul' }] }, { name: 'Midyat', schools: [{ id: 'mar-mid-1', name: 'Midyat Atatürk Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '48', name: 'Muğla', districts: [{ name: 'Menteşe', schools: [{ id: 'mug-men-1', name: 'Menteşe Türdü 100. Yıl İlkokulu/Ortaokulu', type: 'Ortaokul' }] }, { name: 'Bodrum', schools: [{ id: 'mug-bod-1', name: 'Bodrum Mahinur Cemal Uslu Ortaokulu', type: 'Ortaokul' }] }, { name: 'Fethiye', schools: [{ id: 'mug-fet-1', name: 'Fethiye Gazi Ortaokulu', type: 'Ortaokul' }] }, { name: 'Marmaris', schools: [{ id: 'mug-mar-1', name: 'Marmaris Aksaz Turgutreis Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '49', name: 'Muş', districts: [{ name: 'Merkez', schools: [{ id: 'mus-mer-1', name: 'Muş Namık Kemal Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '50', name: 'Nevşehir', districts: [{ name: 'Merkez', schools: [{ id: 'nev-mer-1', name: 'Nevşehir Mehmet Akif Ersoy Ortaokulu', type: 'Ortaokul' }] }, { name: 'Ürgüp', schools: [{ id: 'nev-urg-1', name: 'Ürgüp Hanife Memiş Aksoy Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '51', name: 'Niğde', districts: [{ name: 'Merkez', schools: [{ id: 'nig-mer-1', name: 'Niğde 23 Nisan Havacılar Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '52', name: 'Ordu', districts: [{ name: 'Altınordu', schools: [{ id: 'ord-alt-1', name: 'Altınordu Mehmet Akif Ersoy Ortaokulu', type: 'Ortaokul' }] }, { name: 'Ünye', schools: [{ id: 'ord-uny-1', name: 'Ünye Mehmet Akif Ersoy Ortaokulu', type: 'Ortaokul' }] }, { name: 'Fatsa', schools: [{ id: 'ord-fat-1', name: 'Fatsa Sakarya Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '53', name: 'Rize', districts: [{ name: 'Merkez', schools: [{ id: 'riz-mer-1', name: 'Rize Kurtuluş Ortaokulu', type: 'Ortaokul' }] }, { name: 'Çayeli', schools: [{ id: 'riz-cay-1', name: 'Çayeli Ahmet Hamdi İshakoğlu Doğuş Çay İHO', type: 'İmam Hatip Ortaokulu' }] }] },
  { plate: '54', name: 'Sakarya', districts: [{ name: 'Adapazarı', schools: [{ id: 'sak-ada-1', name: 'Adapazarı Atatürk İlkokulu/Ortaokulu', type: 'Ortaokul' }] }, { name: 'Serdivan', schools: [{ id: 'sak-ser-1', name: 'Serdivan Şehit Ali Borinli Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '55', name: 'Samsun', districts: [{ name: 'İlkadım', schools: [{ id: 'sam-ilk-1', name: 'İlkadım 23 Nisan Ortaokulu', type: 'Ortaokul' }] }, { name: 'Atakum', schools: [{ id: 'sam-ata-1', name: 'Atakum Tevfik İleri İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }] }, { name: 'Bafra', schools: [{ id: 'sam-baf-1', name: 'Bafra Cumhuriyet Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '56', name: 'Siirt', districts: [{ name: 'Merkez', schools: [{ id: 'sii-mer-1', name: 'Siirt 14 Eylül Geçici Eğitim / Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '57', name: 'Sinop', districts: [{ name: 'Merkez', schools: [{ id: 'sin-mer-1', name: 'Sinop Mehmet Akif Ersoy Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '58', name: 'Sivas', districts: [{ name: 'Merkez', schools: [{ id: 'siv-mer-1', name: 'Sivas Şehit Adnan Saka Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '59', name: 'Tekirdağ', districts: [{ name: 'Süleymanpaşa', schools: [{ id: 'tek-sul-1', name: 'Süleymanpaşa 50. Yıl Ortaokulu', type: 'Ortaokul' }] }, { name: 'Çorlu', schools: [{ id: 'tek-cor-1', name: 'Çorlu Furtuni ve İsak Pinhas Ortaokulu', type: 'Ortaokul' }] }, { name: 'Çerkezköy', schools: [{ id: 'tek-cer-1', name: 'Çerkezköy 75. Yıl Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '60', name: 'Tokat', districts: [{ name: 'Merkez', schools: [{ id: 'tok-mer-1', name: 'Tokat Fahriye Arat İmam Hatip Ortaokulu', type: 'İmam Hatip Ortaokulu' }] }, { name: 'Erbaa', schools: [{ id: 'tok-erb-1', name: 'Erbaa Fevzi Çakmak Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '61', name: 'Trabzon', districts: [{ name: 'Ortahisar', schools: [{ id: 'tra-ort-1', name: 'Ortahisar Cudibey Ortaokulu', type: 'Ortaokul' }, { id: 'tra-ort-2', name: 'Yol-İş Sendikası Ortaokulu', type: 'Ortaokul' }] }, { name: 'Akçaabat', schools: [{ id: 'tra-akc-1', name: 'Akçaabat Mevlüt Selami Yardım Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '62', name: 'Tunceli', districts: [{ name: 'Merkez', schools: [{ id: 'tun-mer-1', name: 'Tunceli Hürriyet Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '63', name: 'Şanlıurfa', districts: [{ name: 'Haliliye', schools: [{ id: 'san-hal-1', name: 'Haliliye Profilo Ortaokulu', type: 'Ortaokul' }] }, { name: 'Eyyübiye', schools: [{ id: 'san-eyy-1', name: 'Eyyübiye Mehmet Akif Ersoy Ortaokulu', type: 'Ortaokul' }] }, { name: 'Karaköprü', schools: [{ id: 'san-kar-1', name: 'Karaköprü Mete Has Ortaokulu', type: 'Ortaokul' }] }, { name: 'Siverek', schools: [{ id: 'san-siv-1', name: 'Siverek Şehit Cuma İbiş Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '64', name: 'Uşak', districts: [{ name: 'Merkez', schools: [{ id: 'usa-mer-1', name: 'Uşak Mehmetçik İlkokulu/Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '65', name: 'Van', districts: [{ name: 'İpekyolu', schools: [{ id: 'van-ipe-1', name: 'İpekyolu Fevzi Çakmak Ortaokulu', type: 'Ortaokul' }] }, { name: 'Tuşba', schools: [{ id: 'van-tus-1', name: 'Tuşba Şehit Soner İdil İHO', type: 'İmam Hatip Ortaokulu' }] }, { name: 'Erciş', schools: [{ id: 'van-erc-1', name: 'Erciş Atatürk Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '66', name: 'Yozgat', districts: [{ name: 'Merkez', schools: [{ id: 'yoz-mer-1', name: 'Yozgat Mehmet Akif Ersoy Ortaokulu', type: 'Ortaokul' }] }, { name: 'Sorgun', schools: [{ id: 'yoz-sor-1', name: 'Sorgun Mehmet Akif Ersoy Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '67', name: 'Zonguldak', districts: [{ name: 'Merkez', schools: [{ id: 'zon-mer-1', name: 'Zonguldak Yayla Ortaokulu', type: 'Ortaokul' }] }, { name: 'Ereğli', schools: [{ id: 'zon-ere-1', name: 'Kd. Ereğli Turgut Reis Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '68', name: 'Aksaray', districts: [{ name: 'Merkez', schools: [{ id: 'aks-mer-1', name: 'Aksaray Kılıçaslan Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '69', name: 'Bayburt', districts: [{ name: 'Merkez', schools: [{ id: 'bay-mer-1', name: 'Bayburt Yüzbaşı Şehit Agah Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '70', name: 'Karaman', districts: [{ name: 'Merkez', schools: [{ id: 'krm-mer-1', name: 'Karaman Yunus Emre Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '71', name: 'Kırıkkale', districts: [{ name: 'Merkez', schools: [{ id: 'krk2-mer-1', name: 'Kırıkkale Atatürk Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '72', name: 'Batman', districts: [{ name: 'Merkez', schools: [{ id: 'bat-mer-1', name: 'Batman TOKİ Kazım Karabekir Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '73', name: 'Şırnak', districts: [{ name: 'Merkez', schools: [{ id: 'sir-mer-1', name: 'Şırnak Atatürk Ortaokulu', type: 'Ortaokul' }] }, { name: 'Cizre', schools: [{ id: 'sir-ciz-1', name: 'Cizre Vatan Ortaokulu', type: 'Ortaokul' }] }, { name: 'Silopi', schools: [{ id: 'sir-sil-1', name: 'Silopi Mehmet Akif Ersoy Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '74', name: 'Bartın', districts: [{ name: 'Merkez', schools: [{ id: 'bar-mer-1', name: 'Bartın Atatürk Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '75', name: 'Ardahan', districts: [{ name: 'Merkez', schools: [{ id: 'ard-mer-1', name: 'Ardahan 23 Şubat Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '76', name: 'Iğdır', districts: [{ name: 'Merkez', schools: [{ id: 'igd-mer-1', name: 'Iğdır Şehit Öğretmen Şevki Akgün Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '77', name: 'Yalova', districts: [{ name: 'Merkez', schools: [{ id: 'yal-mer-1', name: 'Yalova Atatürk Ortaokulu', type: 'Ortaokul' }] }, { name: 'Çiftlikköy', schools: [{ id: 'yal-cif-1', name: 'Çiftlikköy Şehit Ömer Halisdemir Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '78', name: 'Karabük', districts: [{ name: 'Merkez', schools: [{ id: 'kar2-mer-1', name: 'Karabük Şehit Mehmet Dinçel Ortaokulu', type: 'Ortaokul' }] }, { name: 'Safranbolu', schools: [{ id: 'kar2-saf-1', name: 'Safranbolu Kanuni Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '79', name: 'Kilis', districts: [{ name: 'Merkez', schools: [{ id: 'kil-mer-1', name: 'Kilis Mehmet Uluğcan Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '80', name: 'Osmaniye', districts: [{ name: 'Merkez', schools: [{ id: 'osm-mer-1', name: 'Osmaniye Atatürk Ortaokulu', type: 'Ortaokul' }] }, { name: 'Kadirli', schools: [{ id: 'osm-kad-1', name: 'Kadirli Şehit Mustafa Yağız Ortaokulu', type: 'Ortaokul' }] }] },
  { plate: '81', name: 'Düzce', districts: [{ name: 'Merkez', schools: [{ id: 'duz-mer-1', name: 'Düzce Hikmet Akın Ortaokulu', type: 'Ortaokul' }] }, { name: 'Akçakoca', schools: [{ id: 'duz-akc-1', name: 'Akçakoca Bahaettin Güçlü Ortaokulu', type: 'Ortaokul' }] }] }
];

export function getAllProvinces(): string[] {
  return TURKEY_PROVINCES.map((p) => p.name);
}

export function getDistrictsByProvince(provinceName: string): string[] {
  const prov = TURKEY_PROVINCES.find(
    (p) => p.name.toLocaleLowerCase('tr') === provinceName.toLocaleLowerCase('tr')
  );
  if (!prov) return [];
  return prov.districts.map((d) => d.name);
}

export function getSchoolsByDistrict(provinceName: string, districtName: string) {
  const prov = TURKEY_PROVINCES.find(
    (p) => p.name.toLocaleLowerCase('tr') === provinceName.toLocaleLowerCase('tr')
  );
  if (!prov) return [];
  const dist = prov.districts.find(
    (d) => d.name.toLocaleLowerCase('tr') === districtName.toLocaleLowerCase('tr')
  );
  if (!dist) return [];
  return dist.schools;
}

// Live async fetchers connected to ogretmenevrak.com API
export async function fetchDistrictsApi(provinceName: string): Promise<string[]> {
  try {
    const res = await fetch(`/api/locations/districts?province=${encodeURIComponent(provinceName)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.districts && Array.isArray(data.districts) && data.districts.length > 0) {
        return data.districts.map((d: any) => d.isim);
      }
    }
  } catch (e) {
    console.warn('Live districts fetch fallback:', e);
  }
  return getDistrictsByProvince(provinceName);
}

export async function fetchSchoolsApi(
  provinceName: string,
  districtName: string,
  search?: string
): Promise<{ id: string; name: string; type: string; slug?: string }[]> {
  try {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const res = await fetch(
      `/api/locations/schools?province=${encodeURIComponent(provinceName)}&district=${encodeURIComponent(districtName)}${searchParam}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.schools && Array.isArray(data.schools) && data.schools.length > 0) {
        return data.schools;
      }
    }
  } catch (e) {
    console.warn('Live schools fetch fallback:', e);
  }
  return getSchoolsByDistrict(provinceName, districtName) || [];
}

