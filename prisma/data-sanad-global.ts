/**
 * 165 — SANAD GLOBAL DATASET (Task 26)
 * =====================================
 * Permintaan langsung Founder (2025): "tolong tqn qodiriah wa naqsabandiyah
 * semua sanad di seluruh dunia termasuk abah anom, abah krawanggana dan abah
 * sukanta masukan sebagai spesial tanpa ada celah satupun yang tidak terisi."
 *
 * Kepatuhan terhadap doktrin (Kebijakan Sumber & Sitasi 009 + konstitusi sanad):
 *  - PURE APPEND: tidak ada entitas lama yang diubah atau dihapus.
 *  - Tidak ada nama mata rantai yang dikarang. Setiap nama hanya masuk bila
 *    dinamai oleh sumber yang teridentifikasi (dikutip di kolom sumber).
 *  - Segmen silsilah klasik yang belum ditranskripsi dari kitab silsilah
 *    direkam sebagai "mata blok" yang JUJUR — menunggu deposit arsip, bukan
 *    diisi dengan nama rekaan.
 *  - Setiap entitas dan setiap relasi membawa evidenceLevel +
 *    verificationStatus + sourceRef.
 *
 * Sumber daring yang dipakai (diakses saat Task 26):
 *  - Wikipedia bahasa Indonesia, "Asnawi al-Bantani"
 *  - Repository UIN Sultan Maulana Hasanuddin Banten — kajian "Gambaran Umum
 *    TQN Cigandeng Menes"
 *  - Pandeglang News — biografi Syaikh Tubagus Ahmad Kadzim Asnawi
 *  - NU Banten — "Ulama dan Pendekar Asal Caringin Banten"
 *  - Dr. Asep Salahudin, MA (IAILM Suryalaya) — "Suluk Inklusif Suryalaya"
 *  - Kanal komunitas TQN 165 Cikangkung (YouTube/Facebook/TikTok) — kutipan
 *    silsilah komunitas
 *  - Dokumen komunitas "Sejarah TQN Cigandeng Menes Pandeglang"
 */

export const SANAD_GLOBAL_MARKER = 'sanadGlobal=TQN-QN-WORLD'

type EntitySeed = {
  globalId: string; slug: string; type: string; primaryName: string
  subtitle?: string; summary?: string; summaryId?: string
  evidenceLevel: string; verificationStatus: string
  startDate?: string; startDatePrecision?: string; endDate?: string; endDatePrecision?: string
  latitude?: number; longitude?: number; region?: string
  details?: Record<string, unknown>
  names?: { name: string; language: string; kind: string; note?: string }[]
}

const MARK = { sanadGlobal: SANAD_GLOBAL_MARKER } as const

// ------------------------------------------------------------------
// SUMBER (165-SRC-000003 … 165-SRC-000009)
// ------------------------------------------------------------------
export const SANAD_GLOBAL_SOURCES: EntitySeed[] = [
  {
    globalId: '165-SRC-000003', slug: 'wikipedia-asnawi-al-bantani', type: 'SOURCE',
    primaryName: 'Wikipedia bahasa Indonesia — "Asnawi al-Bantani"',
    subtitle: 'Ensiklopedia daring · biografi Syekh Asnawi Caringin (1850–1937)',
    summary: 'Artikel ensiklopedis tentang Syekh Asnawi bin Abdurrahman al-Bantani (Syekh Asnawi Caringin, 1850–1937): kelahiran Caringin, Labuan, Banten; murid Syekh Nawawi al-Bantani di Makkah; pendiri Madrasah Masyarikul Anwar dan Masjid Caringin (1884); diasingkan ke Cianjur oleh kolonial Belanda; dan daftar keturunan yang mencakup Tubagus Ahmad Kadzim Asnawi (Mama Kadzim).',
    summaryId: 'Artikel ensiklopedis tentang Syekh Asnawi bin Abdurrahman al-Bantani (Syekh Asnawi Caringin, 1850–1937): lahir di Caringin, Labuan, Banten; murid Syekh Nawawi al-Bantani di Makkah; mendirikan Madrasah Masyarikul Anwar dan Masjid Caringin (1884); diasingkan ke Cianjur oleh pemerintah kolonial; keturunannya mencakup Tubagus Ahmad Kadzim Asnawi (Mama Kadzim).',
    evidenceLevel: 'C', verificationStatus: 'DOCUMENTED',
    details: { sourceType: 'ENCYCLOPEDIC', citation: 'Wikipedia bahasa Indonesia, "Asnawi al-Bantani", https://id.wikipedia.org/wiki/Asnawi_al-Bantani (diakses saat Task 26, 2025).', ...MARK },
  },
  {
    globalId: '165-SRC-000004', slug: 'uin-banten-tqn-cigandeng-menes', type: 'SOURCE',
    primaryName: 'Repository UIN Sultan Maulana Hasanuddin Banten — kajian "Gambaran Umum TQN Cigandeng Menes"',
    subtitle: 'Literatur akademik · TQN Cigandeng Menes, Pandeglang',
    summary: 'Kajian akademik pada repository UIN Banten mengenai TQN Cigandeng Menes. Menyatakan bahwa A. Kadzim adalah guru Tarekat Qadiriyah wa Naqsabandiyah yang paling berpengaruh di Banten, dengan pusat di Cigandeng, Menes, Pandeglang.',
    summaryId: 'Kajian akademik pada repository UIN Banten mengenai TQN Cigandeng Menes. Menyatakan bahwa A. Kadzim adalah guru Tarekat Qadiriyah wa Naqsabandiyah yang paling berpengaruh di Banten, dengan pusat di Cigandeng, Menes, Pandeglang.',
    evidenceLevel: 'C', verificationStatus: 'DOCUMENTED',
    details: { sourceType: 'SCHOLARLY', citation: 'Repository UIN Sultan Maulana Hasanuddin Banten, "Gambaran Umum TQN Cigandeng Menes" (BAB II), https://repository.uinbanten.ac.id.', ...MARK },
  },
  {
    globalId: '165-SRC-000005', slug: 'pandeglangnews-mama-kadzim', type: 'SOURCE',
    primaryName: 'Pandeglang News — "Syaikh Tubagus Ahmad Kadzim Asnawi, Ulama Sufi Besar"',
    subtitle: 'Jurnalisme daring · biografi Mama Kadzim',
    summary: 'Artikel biografi yang menyebut Syaikh Tubagus Ahmad Kadzim Asnawi (Mama Kadzim) sebagai ulama kharismatik TQN di Banten, lahir di Menes, Kabupaten Pandeglang, sekitar tahun 1912 M.',
    summaryId: 'Artikel biografi yang menyebut Syaikh Tubagus Ahmad Kadzim Asnawi (Mama Kadzim) sebagai ulama kharismatik TQN di Banten, lahir di Menes, Kabupaten Pandeglang, sekitar tahun 1912 M.',
    evidenceLevel: 'D', verificationStatus: 'DOCUMENTED',
    details: { sourceType: 'JOURNALISM', citation: 'Pandeglang News, "Syaikh Tubagus Ahmad Kadzim Asnawi, Ulama Sufi Besar", https://www.pandeglangnews.co.id.', ...MARK },
  },
  {
    globalId: '165-SRC-000006', slug: 'sejarah-tqn-cigandeng-menes', type: 'SOURCE',
    primaryName: 'Dokumen komunitas — "Sejarah TQN Cigandeng Menes Pandeglang"',
    subtitle: 'Catatan komunitas · silsilah & sejarah TQN Cigandeng',
    summary: 'Dokumen komunitas yang menyebut TQN didirikan oleh Syekh Ahmad Khatib Sambas pada abad ke-19 di Mekkah dengan mempadukan ajaran Qadiriyah dan Naqsyabandiyyah, kemudian disebarkan oleh para khalifahnya hingga Banten.',
    summaryId: 'Dokumen komunitas yang menyebut TQN didirikan oleh Syekh Ahmad Khatib Sambas pada abad ke-19 di Mekkah dengan memadukan ajaran Qadiriyah dan Naqsyabandiyyah, kemudian disebarkan oleh para khalifahnya hingga Banten.',
    evidenceLevel: 'E', verificationStatus: 'TRADITIONAL_ACCOUNT',
    details: { sourceType: 'COMMUNITY', citation: 'Dokumen komunitas "Sejarah TQN Cigandeng Menes Pandeglang" (peringatan: sumber lemah — menunggu verifikasi silang dengan literatur akademik).', ...MARK },
  },
  {
    globalId: '165-SRC-000007', slug: 'kanal-komunitas-tqn-165-cikangkung', type: 'SOURCE',
    primaryName: 'Kanal komunitas TQN 165 Cikangkung (YouTube · Facebook · TikTok)',
    subtitle: 'Riwayat komunitas daring · majlis TQN 165 Cikangkung, Rengasdengklok, Karawang',
    summary: 'Kanal dan grup komunitas Ahbaabul Musthofa / Ikhwan TQN Cikangkung yang meriwayatkan majlis TQN 165 di Cikangkung, Rengasdengklok, Karawang; menyebut "Abah Krawanggana (Cikangkung, Karawang) … murid dari Syekh Ahmad Kadzim Asnawi (Menes, Banten) bin Syekh Muhammad Asnawi (Caringin, Banten)", menyebut KH Krawang Ghanna / Abah Cikangkung sebagai Mursyid Thoriqoh Qodiriyyah wa Naqsyabandiyah (TQN 165) yang lahir di Karawang pada 25 Juli 1940, serta menyebut Syekh Ahmad Sukanta (Abah Sukanta) sebagai mursyid thoriqoh dalam orbit Banten.',
    summaryId: 'Kanal dan grup komunitas Ahbaabul Musthofa / Ikhwan TQN Cikangkung yang meriwayatkan majlis TQN 165 di Cikangkung, Rengasdengklok, Karawang; mengutip kalimat silsilah komunitas: "Abah Krawanggana (Cikangkung, Karawang) … murid dari Syekh Ahmad Kadzim Asnawi (Menes, Banten) bin Syekh Muhammad Asnawi (Caringin, Banten)"; menyebut KH Krawang Ghanna / Abah Cikangkung sebagai Mursyid Thoriqoh Qodiriyyah wa Naqsyabandiyah (TQN 165) yang lahir di Karawang, 25 Juli 1940; serta menyebut Syekh Ahmad Sukanta (Abah Sukanta) sebagai mursyid thoriqoh dalam orbit Banten.',
    evidenceLevel: 'E', verificationStatus: 'COMMUNITY_SUBMITTED',
    details: { sourceType: 'COMMUNITY', citation: 'Kanal komunitas TQN 165 Cikangkung — YouTube (Ahbaabul Musthofa Channel, video "Suara Guru Mursyid Thoriqoh Qodiriyyah wa Naqsyabandiyyah, KH Krawang Ghanna / Abah Cikangkung Karawang"), grup Facebook "Ikhwan TQN Cikangkung", kanal TikTok #tqn165menes.', note: 'Sumber komunitas: nilai historisnya menunggu deposit ijazah/silsilah resmi dari jamaah.', ...MARK },
  },
  {
    globalId: '165-SRC-000008', slug: 'iailm-suluk-inklusif-suryalaya', type: 'SOURCE',
    primaryName: 'Dr. Asep Salahudin, MA (IAILM Suryalaya) — "Suluk Inklusif Suryalaya"',
    subtitle: 'Publikasi akademik pesantren · biografi Abah Anom & jangkauan global Suryalaya',
    summary: 'Tulisan Dekan Fakultas Syariah IAILM yang menyebut Abah Anom sebagai panggilan populer K.H. Shohibul Wafa Tajul Arifin — mursyid sekaligus sesepuh Pondok Pesantren Suryalaya di Tanjungkerja, Kabupaten Tasikmalaya — berhaluan Tarekat Qadiriyah Naqsyabandiyah; menyebut pesantren berusia ke-105 tahun pada 2010 serta cabang TQN Suryalaya yang menyebar di Jawa, Bali, Kalimantan, Sumatera, Malaysia, Singapura, dan Thailand, termasuk pengembangan pondok rehabilitasi Inabah yang mendapat pengakuan dari PBB.',
    summaryId: 'Tulisan Dekan Fakultas Syariah IAILM: Abah Anom adalah panggilan populer K.H. Shohibul Wafa Tajul Arifin — mursyid sekaligus sesepuh Pondok Pesantren Suryalaya, Tanjungkerja, Kabupaten Tasikmalaya — berhaluan Tarekat Qadiriyah Naqsyabandiyah; pesantren berusia ke-105 tahun pada 2010; cabang TQN menyebar di Jawa, Bali, Kalimantan, Sumatera, Malaysia, Singapura, dan Thailand; mengembangkan pondok rehabilitasi Inabah yang diakui PBB.',
    evidenceLevel: 'D', verificationStatus: 'DOCUMENTED',
    details: { sourceType: 'INSTITUTIONAL_ACADEMIC', citation: 'Asep Salahudin, "Suluk Inklusif Suryalaya", Fakultas Syariah IAILM (2012), fsyariahiailm.blogspot.com.', ...MARK },
  },
  {
    globalId: '165-SRC-000009', slug: 'nu-banten-asnawi-caringin', type: 'SOURCE',
    primaryName: 'NU Banten — "Ulama dan Pendekar Asal Caringin Banten"',
    subtitle: 'Jurnalisme organisasi · KH Tubagus Muhammad Asnawi',
    summary: 'Artikel NU Banten yang menyebut KH Tubagus Muhammad Asnawi sebagai ulama karismatik yang lahir di kampung Caringin, Banten, pada tahun 1850 M.',
    summaryId: 'Artikel NU Banten yang menyebut KH Tubagus Muhammad Asnawi sebagai ulama karismatik yang lahir di kampung Caringin, Banten, pada tahun 1850 M.',
    evidenceLevel: 'D', verificationStatus: 'DOCUMENTED',
    details: { sourceType: 'JOURNALISM', citation: 'NU Banten, "Ulama dan Pendekar Asal Caringin Banten" (2021), https://banten.nu.or.id.', ...MARK },
  },
  {
    globalId: '165-SRC-000010', slug: 'silsilah-sanad-tqn-komunitas', type: 'SOURCE',
    primaryName: 'Dokumen komunitas — "Silsilah Sanad Thoriqoh Qodiriyah Wan Naqsyabandiyah"',
    subtitle: 'Catatan komunitas · konvensi pembukaan silsilah TQN',
    summary: 'Dokumen silsilah komunitas TQN yang membuka rantai dengan urutan bernomor: 1. Allah Swt, 2. Sayyidina Jibril, 3. Rasulullah Nabi Muhammad Saw., lalu berlanjut ke jalur sahabat dan para guru spiritual Qadiriyyah wa Naqsyabandiyah. Menegaskan konvensi pembukaan silsilah yang dipakai dokumen-dokumen TQN.',
    summaryId: 'Dokumen silsilah komunitas TQN yang membuka rantai dengan urutan bernomor: 1. Allah Swt, 2. Sayyidina Jibril, 3. Rasulullah Nabi Muhammad Saw., lalu berlanjut ke jalur sahabat dan para guru spiritual Qadiriyyah wa Naqsyabandiyah.',
    evidenceLevel: 'E', verificationStatus: 'TRADITIONAL_ACCOUNT',
    details: { sourceType: 'COMMUNITY', citation: 'Dokumen komunitas "Silsilah Sanad Thoriqoh Qodiriyah Wan Naqsyabandiyah" (scribd.com) — sumber lemah, menunggu verifikasi silang.', ...MARK },
  },
]

// ------------------------------------------------------------------
// TOKOH (165-PERSON-000004 … 165-PERSON-000011)
// ------------------------------------------------------------------
export const SANAD_GLOBAL_PERSONS: EntitySeed[] = [
  {
    globalId: '165-PERSON-000004', slug: 'ahmad-khatib-sambas', type: 'PERSON',
    primaryName: 'Syekh Ahmad Khatib Sambas',
    subtitle: 'Penyusun gabungan Qadiriyyah–Naqsyabandiyyah pada abad ke-19 di Makkah',
    summary: 'Ulama asal Sambas (Kalimantan Barat) yang, menurut dokumen komunitas dan literatur tarekat, menyusun gabungan Tarekat Qadiriyyah dan Naqsyabandiyyah pada abad ke-19 di Makkah — dari mana TQN menyebar ke Nusantara, termasuk Banten. 165 mencatatnya sebagai figur rujukan silsilah sesuai sumber yang tersedia; nama-nama mata rantai yang menghubungkannya dengan guru-guru sebelumnya menunggu transkripsi kitab silsilah.',
    summaryId: 'Ulama asal Sambas (Kalimantan Barat) yang, menurut dokumen komunitas dan literatur tarekat, menyusun gabungan Tarekat Qadiriyyah dan Naqsyabandiyyah pada abad ke-19 di Makkah — dari sanalah TQN menyebar ke Nusantara, termasuk Banten. 165 mencatatnya sebagai figur rujukan silsilah sesuai sumber yang tersedia; nama-nama mata rantai yang menghubungkannya dengan guru-guru sebelumnya menunggu transkripsi kitab silsilah.',
    evidenceLevel: 'D', verificationStatus: 'TRADITIONAL_ACCOUNT',
    startDate: '19', startDatePrecision: 'CENTURY',
    details: { role: 'Penyusun gabungan Qadiriyyah–Naqsyabandiyyah (abad ke-19)', note: 'Tanggal lahir/wafat bervariasi antar literatur — menunggu sitasi formal.', ...MARK },
    names: [{ name: 'الشيخ أحمد الخطيب السمباسي', language: 'ar', kind: 'TRANSLITERATION' }],
  },
  {
    globalId: '165-PERSON-000005', slug: 'syekh-abdurrahman-binafifuddin', type: 'PERSON',
    primaryName: 'Syekh Abdurrahman bin Syekh Afifuddin',
    subtitle: 'Ayah Syekh Asnawi Caringin — ulama Caringin, Banten',
    summary: 'Ulama dari keluarga religius di Caringin, Labuan, Banten; menurut Wikipedia bahasa Indonesia ia adalah ayah Syekh Asnawi bin Abdurrahman al-Bantani, dan pernah menjabat sebagai penghulu (catatan sumber lain menyebut "penghulu Landraat").',
    summaryId: 'Ulama dari keluarga religius di Caringin, Labuan, Banten; menurut Wikipedia bahasa Indonesia ia adalah ayah Syekh Asnawi bin Abdurrahman al-Bantani, dan pernah menjabat sebagai penghulu (catatan sumber lain menyebut "penghulu Landraat").',
    evidenceLevel: 'C', verificationStatus: 'DOCUMENTED',
    details: { role: 'Ulama Caringin · ayah Syekh Asnawi Caringin', ...MARK },
  },
  {
    globalId: '165-PERSON-000006', slug: 'syekh-nawawi-al-bantani', type: 'PERSON',
    primaryName: 'Syekh Nawawi al-Bantani',
    subtitle: 'Guru besar Makkah — guru Syekh Asnawi Caringin',
    summary: 'Ulama besar Banten yang menurut Wikipedia menjadi guru di Masjidil Haram, Makkah, dan mengajarkan Syekh Asnawi Caringin. Salah satu penulis paling produktif dari Nusantara; 165 mencatat perannya dalam tautan guru-murid yang dinamai langsung oleh sumber.',
    summaryId: 'Ulama besar Banten yang menurut Wikipedia menjadi guru di Masjidil Haram, Makkah, dan mengajarkan Syekh Asnawi Caringin. Salah satu penulis paling produktif dari Nusantara; 165 mencatat perannya dalam tautan guru-murid yang dinamai langsung oleh sumber.',
    evidenceLevel: 'C', verificationStatus: 'DOCUMENTED',
    details: { role: 'Guru Masjidil Haram · guru Syekh Asnawi Caringin', ...MARK },
    names: [{ name: 'نووي البنتاني', language: 'ar', kind: 'TRANSLITERATION' }],
  },
  {
    globalId: '165-PERSON-000007', slug: 'muhammad-asnawi-al-bantani', type: 'PERSON',
    primaryName: 'Syekh Muhammad Asnawi al-Bantani (Syekh Asnawi Caringin)',
    subtitle: 'Ulama karismatik Caringin (±1850–1937) · ayah Mama Kadzim',
    summary: 'Syekh Asnawi bin Abdurrahman al-Bantani — dikenal sebagai Syekh Asnawi Caringin — lahir di Kampung Caringin, Labuan, Banten, sekitar 1850 M. Menurut Wikipedia ia belajar ke Makkah sejak usia sembilan tahun dan menjadi murid Syekh Nawawi al-Bantani; mendirikan Madrasah Masyarikul Anwar dan Masjid Caringin pada 1884; ditahan dan diasingkan ke Cianjur oleh kolonial Belanda; wafat 1937 dan dimakamkan di dekat Masjid Caringin. Keturunannya mencakup Tubagus Ahmad Kadzim Asnawi (Mama Kadzim).',
    summaryId: 'Syekh Asnawi bin Abdurrahman al-Bantani — dikenal sebagai Syekh Asnawi Caringin — lahir di Kampung Caringin, Labuan, Banten, sekitar 1850 M. Menurut Wikipedia ia berangkat menuntut ilmu ke Makkah sejak usia sembilan tahun dan menjadi murid Syekh Nawawi al-Bantani; mendirikan Madrasah Masyarikul Anwar dan Masjid Caringin pada 1884; ditahan dan diasingkan ke Cianjur oleh kolonial Belanda; wafat 1937 dan dimakamkan di dekat Masjid Caringin. Keturunannya mencakup Tubagus Ahmad Kadzim Asnawi (Mama Kadzim).',
    evidenceLevel: 'C', verificationStatus: 'DOCUMENTED',
    startDate: '1850', startDatePrecision: 'YEAR', endDate: '1937', endDatePrecision: 'YEAR',
    details: { role: 'Ulama Banten · pendiri Madrasah Masyarikul Anwar & Masjid Caringin (1884)', note: 'Tahun lahir "±1850" — sumber menyebut sekitar tahun 1850.', ...MARK },
    names: [
      { name: 'الشيخ اسنوي بن عبد الرحمن البنتني', language: 'ar', kind: 'TRANSLITERATION', note: 'sebagaimana tertulis di artikel Wikipedia' },
      { name: 'Syekh Asnawi Caringin', language: 'id', kind: 'ALIAS' },
    ],
  },
  {
    globalId: '165-PERSON-000008', slug: 'tubagus-ahmad-kadzim-asnawi', type: 'PERSON',
    primaryName: 'Syaikh Tubagus Ahmad Kadzim Asnawi (Mama Kadzim)',
    subtitle: 'Guru TQN paling berpengaruh di Banten · pusat TQN Cigandeng Menes (±1912–…)',
    summary: 'Ulama Sufi besar Banten yang menurut Pandeglang News lahir di Menes, Kabupaten Pandeglang, sekitar tahun 1912 M, sebagai putra Syekh Muhammad Asnawi al-Bantani (Caringin). Kajian repository UIN Banten menyatakan ia adalah guru Tarekat Qadiriyah wa Naqsyabandiyah yang paling berpengaruh di Banten, dengan pusat pengajaran di TQN Cigandeng, Menes. Nama beliau dinukil kanal komunitas dalam kalimat silsilah: "Syekh Ahmad Kadzim Asnawi (Menes, Banten) bin Syekh Muhammad Asnawi (Caringin, Banten)".',
    summaryId: 'Ulama Sufi besar Banten yang menurut Pandeglang News lahir di Menes, Kabupaten Pandeglang, sekitar tahun 1912 M, sebagai putra Syekh Muhammad Asnawi al-Bantani (Caringin). Kajian repository UIN Banten menyatakan ia adalah guru Tarekat Qadiriyah wa Naqsyabandiyah yang paling berpengaruh di Banten, dengan pusat pengajaran di TQN Cigandeng, Menes. Kanal komunitas mengutip silsilahnya: "Syekh Ahmad Kadzim Asnawi (Menes, Banten) bin Syekh Muhammad Asnawi (Caringin, Banten)".',
    evidenceLevel: 'C', verificationStatus: 'DOCUMENTED',
    startDate: '1912', startDatePrecision: 'YEAR',
    details: { role: 'Guru TQN paling berpengaruh di Banten (UIN Banten)', note: 'Tahun wafat belum tercatat pada sumber yang dapat diakses — menunggu deposit.', ...MARK },
    names: [{ name: 'Mama Kadzim', language: 'id', kind: 'ALIAS' }],
  },
  {
    globalId: '165-PERSON-000009', slug: 'abah-krawanggana', type: 'PERSON',
    primaryName: 'Abah Krawanggana (KH Krawang Ghanna / Abah Cikangkung)',
    subtitle: 'Mursyid Thoriqoh Qodiriyyah wa Naqsyabandiyah (TQN 165) Cikangkung, Rengasdengklok, Karawang',
    summary: 'Mursyid majlis TQN 165 di Cikangkung, Rengasdengklok, Karawang. Grup komunitas "Ikhwan TQN Cikangkung" menyebut beliau lahir di Karawang pada 25 Juli 1940 dan menghabiskan puluhan tahun mengabarkan thoriqoh. Kanal komunitas menempatkan beliau dalam kalimat silsilah: "Abah Krawanggana (Cikangkung, Karawang) … murid dari Syekh Ahmad Kadzim Asnawi (Menes, Banten) bin Syekh Muhammad Asnawi (Caringin, Banten)". Catatan 165: profil ini direkam dari riwayat komunitas (Level E) — nama lengkap, ijazah, dan riwayat hidup lengkap menunggu deposit arsip resmi dari jamaah/keluarga; 165 tidak mengarang satu pun bagian yang belum bersumber.',
    summaryId: 'Mursyid majlis TQN 165 di Cikangkung, Rengasdengklok, Karawang. Grup komunitas "Ikhwan TQN Cikangkung" menyebut beliau lahir di Karawang pada 25 Juli 1940 dan menghabiskan puluhan tahun mengabarkan thoriqoh. Kanal komunitas menempatkan beliau dalam kalimat silsilah: "Abah Krawanggana (Cikangkung, Karawang) … murid dari Syekh Ahmad Kadzim Asnawi (Menes, Banten) bin Syekh Muhammad Asnawi (Caringin, Banten)". Catatan 165: profil ini direkam dari riwayat komunitas (Level E) — nama lengkap, ijazah, dan riwayat hidup lengkap menunggu deposit arsip resmi dari jamaah/keluarga; 165 tidak mengarang satu pun bagian yang belum bersumber.',
    evidenceLevel: 'E', verificationStatus: 'COMMUNITY_SUBMITTED',
    startDate: '1940-07-25', startDatePrecision: 'DAY',
    details: { role: 'Mursyid majlis TQN 165 Cikangkung', featured: 'FOUNDER_PICK', note: 'Ditandai khusus oleh Founder 165 (2025): "masukan sebagai spesial".', ...MARK },
    names: [
      { name: 'KH Krawang Ghanna', language: 'id', kind: 'ALIAS', note: 'pelafalan pada kanal komunitas' },
      { name: 'Abah Cikangkung', language: 'id', kind: 'ALIAS', note: 'kunjukan komunitas' },
    ],
  },
  {
    globalId: '165-PERSON-000010', slug: 'abah-sukanta', type: 'PERSON',
    primaryName: 'Abah Sukanta (Syekh Ahmad Sukanta)',
    subtitle: 'Mursyid thoriqoh Qodiriyyah dalam orbit TQN Banten — dinukil kanal komunitas',
    summary: 'Syekh mursyid yang oleh kanal komunitas disebut sebagai "Syekh Ahmad Sukanta, Mursyid Thoriqoh Qodiriyyah", tampil dalam lingkaran tausiyah dan khataman bersama tokoh-tokoh TQN Banten (menyanding nama beliau dengan Abah Krawanggana dan ulama-ulama Banten lainnya pada kanal komunitas yang sama). Catatan 165: profil direkam dari riwayat komunitas (Level E); biografi, ijazah, dan kaitan silsilah persisnya menunggu deposit arsip resmi — 165 menampilkan apa yang bersumber, tanpa menambahkan satu nama pun yang belum bersumber.',
    summaryId: 'Syekh mursyid yang oleh kanal komunitas disebut "Syekh Ahmad Sukanta, Mursyid Thoriqoh Qodiriyyah", tampil dalam lingkaran tausiyah dan khataman bersama tokoh-tokoh TQN Banten (kanal komunitas menyanding nama beliau dengan Abah Krawanggana dan ulama Banten lainnya). Catatan 165: profil direkam dari riwayat komunitas (Level E); biografi, ijazah, dan kaitan silsilah persisnya menunggu deposit arsip resmi — 165 menampilkan apa yang bersumber, tanpa menambah satu nama pun yang belum bersumber.',
    evidenceLevel: 'E', verificationStatus: 'COMMUNITY_SUBMITTED',
    details: { role: 'Mursyid thoriqoh (dinukil kanal komunitas)', featured: 'FOUNDER_PICK', note: 'Ditandai khusus oleh Founder 165 (2025): "masukan sebagai spesial".', ...MARK },
    names: [{ name: 'Syekh Ahmad Sukanta', language: 'id', kind: 'ALIAS' }],
  },
  {
    globalId: '165-PERSON-000011', slug: 'shohibulwafa-tajul-arifin-abah-anom', type: 'PERSON',
    primaryName: 'K.H. Shohibul Wafa Tajul Arifin (Abah Anom)',
    subtitle: 'Mursyid TQN Pondok Pesantren Suryalaya — figur referensi mursyid se-dunia',
    summary: 'Mursyid besar TQN Indonesia. Menurut publikasi IAILM (Dr. Asep Salahudin, MA), Abah Anom adalah panggilan populer K.H. Shohibul Wafa Tajul Arifin — mursyid sekaligus sesepuh Pondok Pesantren Suryalaya (Tanjungkerja, Tasikmalaya) berhaluan Tarekat Qadiriyah Naqsyabandiyah; di bawah bimbingannya cabang TQN Suryalaya menyebar di Jawa, Bali, Kalimantan, Sumatera, Malaysia, Singapura, dan Thailand, termasuk pondok rehabilitasi Inabah yang mendapat pengakuan PBB. Kanal komunitas memperingati milad ke-108 beliau (lahir ±1914). Catatan 165: Suryalaya adalah tradisi TQN yang terpisah dari majlis 165 — Abah Anom dicatat sebagai FIGUR REFERENSI mursyid TQN se-dunia, BUKAN sebagai simpul dalam sanad majlis 165.',
    summaryId: 'Mursyid besar TQN Indonesia. Menurut publikasi IAILM (Dr. Asep Salahudin, MA), Abah Anom adalah panggilan populer K.H. Shohibul Wafa Tajul Arifin — mursyid sekaligus sesepuh Pondok Pesantren Suryalaya (Tanjungkerja, Tasikmalaya) berhaluan Tarekat Qadiriyah Naqsyabandiyah; di bawah bimbingannya cabang TQN Suryalaya menyebar di Jawa, Bali, Kalimantan, Sumatera, Malaysia, Singapura, dan Thailand, termasuk pondok rehabilitasi Inabah yang diakui PBB. Kanal komunitas memperingati milad ke-108 beliau (lahir ±1914). Catatan 165: Suryalaya adalah tradisi TQN yang terpisah dari majlis 165 — Abah Anom dicatat sebagai FIGUR REFERENSI mursyid TQN se-dunia, BUKAN sebagai simpul dalam sanad majlis 165.',
    evidenceLevel: 'D', verificationStatus: 'DOCUMENTED',
    startDate: '1914', startDatePrecision: 'YEAR', endDate: '2011', endDatePrecision: 'YEAR',
    details: { role: 'Mursyid TQN Suryalaya · figur referensi global', featured: 'FOUNDER_PICK', note: 'Tahun wafat 2011 diterima luas dalam catatan komunitas — sitasi formal menunggu deposit.', ...MARK },
    names: [
      { name: 'Abah Anom', language: 'id', kind: 'ALIAS' },
      { name: 'Pangersa Abah Anom Suryalaya', language: 'su', kind: 'TITLE' },
    ],
  },
]

// ------------------------------------------------------------------
// TEMPAT & INSTITUSI
// ------------------------------------------------------------------
export const SANAD_GLOBAL_PLACES: EntitySeed[] = [
  {
    globalId: '165-PLACE-000004', slug: 'banten-province', type: 'PLACE',
    primaryName: 'Banten (provinsi)',
    subtitle: 'Provinsi di pulau Jawa — tanah Caringin, Menes, Cigandeng',
    summary: 'Provinsi tempat tumbuhnya jalur TQN Banten: Caringin (Labuan), Menes dan Cigandeng (Pandeglang).',
    evidenceLevel: 'C', verificationStatus: 'DOCUMENTED',
    latitude: -6.41, longitude: 106.15, region: 'Southeast Asia',
    names: [{ name: 'Banten', language: 'id', kind: 'PRIMARY' }],
    details: { ...MARK },
  },
  {
    globalId: '165-PLACE-000005', slug: 'menes-pandeglang', type: 'PLACE',
    primaryName: 'Menes, Pandeglang',
    subtitle: 'Kecamatan kelahiran Mama Kadzim',
    summary: 'Kecamatan di Kabupaten Pandeglang, Banten — tempat kelahiran Syaikh Tubagus Ahmad Kadzim Asnawi (±1912) menurut Pandeglang News.',
    summaryId: 'Kecamatan di Kabupaten Pandeglang, Banten — tempat kelahiran Syaikh Tubagus Ahmad Kadzim Asnawi (±1912) menurut Pandeglang News.',
    evidenceLevel: 'D', verificationStatus: 'DOCUMENTED',
    latitude: -6.43, longitude: 105.93, region: 'Southeast Asia',
    details: { ...MARK },
  },
  {
    globalId: '165-PLACE-000006', slug: 'cigandeng-menes', type: 'PLACE',
    primaryName: 'Cigandeng, Menes',
    subtitle: 'Pusat TQN Cigandeng Menes — lingkungan pengajaran Mama Kadzim',
    summary: 'Lingkungan di Menes yang menjadi nama bagi TQN Cigandeng Menes — pusat pengajaran tarekat yang dikaji repository UIN Banten.',
    evidenceLevel: 'C', verificationStatus: 'DOCUMENTED',
    latitude: -6.44, longitude: 105.92, region: 'Southeast Asia',
    details: { ...MARK },
  },
  {
    globalId: '165-PLACE-000007', slug: 'caringin-labuan-banten', type: 'PLACE',
    primaryName: 'Caringin, Labuan (Banten)',
    subtitle: 'Kampung kelahiran Syekh Asnawi Caringin · lokasi Masjid & Madrasah Caringin (1884)',
    summary: 'Kampung di pesisir Labuan, Banten — kelahiran Syekh Asnawi Caringin (±1850), lokasi Masjid Caringin dan Madrasah Masyarikul Anwar yang didirikan 1884, serta makam beliau.',
    evidenceLevel: 'C', verificationStatus: 'DOCUMENTED',
    latitude: -6.45, longitude: 105.79, region: 'Southeast Asia',
    details: { ...MARK },
  },
  {
    globalId: '165-PLACE-000008', slug: 'cikangkung-rengasdengklok-karawang', type: 'PLACE',
    primaryName: 'Cikangkung, Rengasdengklok (Karawang)',
    subtitle: 'Rumah majlis TQN 165 — jamaah yang memaknai nama platform ini',
    summary: 'Lingkungan di Rengasdengklok, Karawang, Jawa Barat — tempat majlis dzikir TQN 165 yang oleh kanal komunitas diiringi nama Abah Krawanggana. Nama "165" yang dipakai platform ini berakar pada majlis komunitas ini (riwayat komunitas — Level E).',
    summaryId: 'Lingkungan di Rengasdengklok, Karawang, Jawa Barat — tempat majlis dzikir TQN 165 yang oleh kanal komunitas diiringi nama Abah Krawanggana. Nama "165" yang dipakai platform ini berakar pada majlis komunitas ini (riwayat komunitas — Level E).',
    evidenceLevel: 'E', verificationStatus: 'COMMUNITY_SUBMITTED',
    latitude: -6.16, longitude: 107.30, region: 'Southeast Asia',
    details: { ...MARK },
  },
  {
    globalId: '165-PLACE-000009', slug: 'suryalaya-tanjungkerja', type: 'PLACE',
    primaryName: 'Pondok Pesantren Suryalaya, Tanjungkerja (Tasikmalaya)',
    subtitle: 'Pusat TQN Suryalaya — lingkungan mursyid Abah Anom',
    summary: 'Pondok Pesantren Suryalaya berhaluan Tarekat Qadiriyah Naqsyabandiyah, terletak di Tanjungkerja, Kabupaten Tasikmalaya, menurut publikasi IAILM; publikasi yang sama menyebut pesantren berusia ke-105 tahun pada 2010 dan cabang tarekatnya menyebar hingga Malaysia, Singapura, dan Thailand. 165 mencatatnya sebagai referensi — tradisi terpisah dari majlis 165.',
    evidenceLevel: 'D', verificationStatus: 'DOCUMENTED',
    region: 'Southeast Asia',
    details: { ...MARK },
  },
  {
    globalId: '165-PLACE-000010', slug: 'makkah-al-mukarramah', type: 'PLACE',
    primaryName: 'Makkah al-Mukarramah',
    subtitle: 'Tempat penyusunan gabungan TQN pada abad ke-19 & pasar ilmu ulama Nusantara',
    summary: 'Kota suci Makkah — menurut dokumen komunitas, tempat Syekh Ahmad Khatib Sambas menyusun gabungan Qadiriyyah–Naqsyabandiyyah pada abad ke-19; juga tempat Syekh Asnawi Caringin menuntut ilmu kepada Syekh Nawawi al-Bantani.',
    evidenceLevel: 'C', verificationStatus: 'DOCUMENTED',
    latitude: 21.42, longitude: 39.83, region: 'Middle East',
    names: [{ name: 'مكة المكرمة', language: 'ar', kind: 'PRIMARY' }],
    details: { ...MARK },
  },
  {
    globalId: '165-INST-000002', slug: 'madrasah-masyarikul-anwar', type: 'INSTITUTION',
    primaryName: 'Madrasah Masyarikul Anwar, Caringin',
    subtitle: 'Didirikan Syekh Asnawi Caringin pada 1884',
    summary: 'Madrasah yang didirikan Syekh Asnawi Caringin pada 1884 bersama Masjid Caringin — menurut Wikipedia, pembangunannya ditujukan juga untuk membangun kembali peradaban masyarakat pasca letusan Gunung Krakatau (1883).',
    summaryId: 'Madrasah yang didirikan Syekh Asnawi Caringin pada 1884 bersama Masjid Caringin — menurut Wikipedia, pembangunannya juga untuk membangun kembali peradaban masyarakat pasca letusan Gunung Krakatau (1883).',
    evidenceLevel: 'C', verificationStatus: 'DOCUMENTED',
    startDate: '1884', startDatePrecision: 'YEAR',
    details: { ...MARK },
  },
]

// ------------------------------------------------------------------
// KOLEKSI SPESIAL (permintaan Founder)
// ------------------------------------------------------------------
export const SANAD_GLOBAL_COLLECTION: EntitySeed = {
  globalId: '165-COLL-000002', slug: 'murshid-spesial-tqn', type: 'COLLECTION',
  primaryName: 'Murshid Spesial — Sanad TQN QN se-Dunia',
  subtitle: 'Koleksi istimewa atas permintaan langsung Founder 165 (2025)',
  summary: 'Koleksi kurasi khusus yang disusun atas permintaan Founder 165: tokoh-tokoh sanad TQN Qodiriah Naqsabandiyah dari silsilah klasik hingga majlis-majlis dunia — menonjolkan Abah Anom (Suryalaya), Abah Krawanggana (Cikangkung, Karawang), dan Abah Sukanta, beserta para penghubung silsilah Banten (Mama Kadzim, Syekh Asnawi Caringin, Syekh Ahmad Khatib Sambas).',
  summaryId: 'Koleksi kurasi khusus atas permintaan Founder 165: tokoh-tokoh sanad TQN Qodiriah Naqsabandiyah dari silsilah klasik hingga majlis-majlis dunia — menonjolkan Abah Anom (Suryalaya), Abah Krawanggana (Cikangkung, Karawang), dan Abah Sukanta, beserta para penghubung silsilah Banten (Mama Kadzim, Syekh Asnawi Caringin, Syekh Ahmad Khatib Sambas).',
  evidenceLevel: 'B', verificationStatus: 'DOCUMENTED',
  details: { curator: 'Founder 165 — via direktif langsung (2025)', ...MARK },
}

// ------------------------------------------------------------------
// RANTAI SANAD (entitas SANAD) + MATA RANTAI (SanadLink)
// Mata blok: context diawali "MATA BLOK —" dan ditampilkan jujur
// oleh UI sebagai segmen yang menunggu transkripsi.
// ------------------------------------------------------------------
export type SanadLinkSeed = {
  chain: string; order: number; fromName: string; toName: string
  person?: string // globalId person entity (untuk toName bila cocok)
  eraNote?: string; evidenceLevel: string; verificationStatus: string
  sourceRef?: string; context?: string
}

export const SANAD_CHAINS: EntitySeed[] = [
  {
    globalId: '165-SANAD-000001', slug: 'sanad-naqsyabandiyyah-jalur-sambas', type: 'SANAD',
    primaryName: 'Sanad Naqsyabandiyyah — jalur TQN (hingga Syekh Ahmad Khatib Sambas)',
    subtitle: 'Rantai klasik Rasulullah ﷺ → Khawājagān → Mujaddidiyyah → Ahmad Khatib Sambas — mata blok menunggu transkripsi kitab silsilah',
    summary: 'Rantai sanad jalur Naqsyabandiyyah sebagaimana diakui tradisi TQN: bermula dari Rasulullah ﷺ melalui Abu Bakar ash-Shiddiq, mengalir melalui para Khawājagān Bukhara (termasuk Imam Bahauddin Naqsyaband — tokoh eponim), lanjut ke jalur Mujaddidiyyah, hingga Syekh Ahmad Khatib Sambas. CATATAN JUJUR: 165 saat ini memegang struktur segmen rantai ini dari sumber komunitas; nama per-mata silsilah klasik belum ditranskripsi dari kitab silsilah resmi — segmen itu direkam sebagai MATA BLOK, bukan diisi nama karangan.',
    summaryId: 'Rantai sanad jalur Naqsyabandiyyah sebagaimana diakui tradisi TQN: bermula dari Rasulullah ﷺ melalui Abu Bakar ash-Shiddiq, mengalir melalui para Khawājagān Bukhara (termasuk Imam Bahauddin Naqsyaband — tokoh eponim), lanjut ke jalur Mujaddidiyyah, hingga Syekh Ahmad Khatib Sambas. CATATAN JUJUR: 165 memegang struktur segmen rantai ini dari sumber komunitas; nama per-mata silsilah klasik belum ditranskripsi dari kitab silsilah resmi — segmen itu direkam sebagai MATA BLOK, bukan diisi nama karangan.',
    evidenceLevel: 'E', verificationStatus: 'TRADITIONAL_ACCOUNT',
    details: { lineage: 'Naqsyabandiyyah', ...MARK },
  },
  {
    globalId: '165-SANAD-000002', slug: 'sanad-qadiriyyah-jalur-sambas', type: 'SANAD',
    primaryName: 'Sanad Qadiriyyah — jalur TQN (hingga Syekh Ahmad Khatib Sambas)',
    subtitle: 'Rantai klasik Rasulullah ﷺ → Ali bin Abi Thalib → Imam Abdul Qadir al-Jilani → Ahmad Khatib Sambas — mata blok menunggu transkripsi',
    summary: 'Rantai sanad jalur Qadiriyyah sebagaimana diakui tradisi TQN: bermula dari Rasulullah ﷺ melalui Ali bin Abi Thalib, mengalir melalui para gema Bashrah–Baghdad hingga Imam Abdul Qadir al-Jilani (tokoh eponim Qadiriyya), lalu turun-turun hingga Syekh Ahmad Khatib Sambas. CATATAN JUJUR: nama per-mata silsilah klasik belum ditranskripsi dari kitab silsilah resmi — segmen itu direkam sebagai MATA BLOK.',
    summaryId: 'Rantai sanad jalur Qadiriyyah sebagaimana diakui tradisi TQN: bermula dari Rasulullah ﷺ melalui Ali bin Abi Thalib, mengalir melalui para gema Bashrah–Baghdad hingga Imam Abdul Qadir al-Jilani (tokoh eponim Qadiriyya), lalu turun-turun hingga Syekh Ahmad Khatib Sambas. CATATAN JUJUR: nama per-mata silsilah klasik belum ditranskripsi dari kitab silsilah resmi — segmen itu direkam sebagai MATA BLOK.',
    evidenceLevel: 'E', verificationStatus: 'TRADITIONAL_ACCOUNT',
    details: { lineage: 'Qadiriyyah', ...MARK },
  },
  {
    globalId: '165-SANAD-000003', slug: 'jalur-tqn-banten-majlis-165-cikangkung', type: 'SANAD',
    primaryName: 'Jalur TQN Banten — dari era Sambas ke Majlis TQN 165 Cikangkung',
    subtitle: 'Sambas → penyebar di Banten → Mama Kadzim (Menes) → Abah Krawanggana & Abah Sukanta → jamaah dunia',
    summary: 'Jalur penyebaran TQN yang terdokumentasi dari sumber tersedia: TQN gabungan era Syekh Ahmad Khatib Sambas (abad ke-19, Makkah) disebarkan khalifah-khalifahnya hingga Banten; di Banten, Syaikh Tubagus Ahmad Kadzim Asnawi (Mama Kadzim) — putra Syekh Muhammad Asnawi al-Bantani (Caringin) — menjadi guru TQN paling berpengaruh (kajian UIN Banten); dari lingkaran pengajaran Menes itulah kanal komunitas menempatkan Abah Krawanggana (Cikangkung, Karawang) dan Abah Sukanta sebagai mursyid, hingga jamaah majlis TQN 165 Cikangkung yang menyebar ke berbagai wilayah. Mata rantai bernama hanya tercatat sejauh sumber menamai; segmen antara era Sambas dan Asnawi Caringin masih MATA BLOK menunggu deposit silsilah Menes/Cigandeng.',
    summaryId: 'Jalur penyebaran TQN yang terdokumentasi dari sumber tersedia: TQN gabungan era Syekh Ahmad Khatib Sambas (abad ke-19, Makkah) disebarkan khalifah-khalifahnya hingga Banten; di Banten, Syaikh Tubagus Ahmad Kadzim Asnawi (Mama Kadzim) — putra Syekh Muhammad Asnawi al-Bantani (Caringin) — menjadi guru TQN paling berpengaruh (kajian UIN Banten); dari lingkaran pengajaran Menes itulah kanal komunitas menempatkan Abah Krawanggana (Cikangkung, Karawang) dan Abah Sukanta sebagai mursyid, hingga jamaah majlis TQN 165 Cikangkung yang menyebar ke berbagai wilayah. Mata rantai bernama hanya tercatat sejauh sumber menamai; segmen antara era Sambas dan Asnawi Caringin masih MATA BLOK menunggu deposit silsilah Menes/Cigandeng.',
    evidenceLevel: 'D', verificationStatus: 'COMMUNITY_SUBMITTED',
    details: { lineage: 'Jalur Banten → Majlis 165', ...MARK },
  },
]

export const SANAD_LINKS: SanadLinkSeed[] = [
  // ---- 165-SANAD-000001 · Naqsyabandiyyah ----
  {
    chain: '165-SANAD-000001', order: 1,
    fromName: 'Rasulullah Muhammad ﷺ',
    toName: 'Silsilah klasik Naqsyabandiyyah — jalur Abu Bakar ash-Shiddiq (para Khawājagān)',
    eraNote: 'abad ke-7 → ke-14 M', evidenceLevel: 'E', verificationStatus: 'TRADITIONAL_ACCOUNT',
    sourceRef: '165-SRC-000010',
    context: 'MATA BLOK — urutan mata rantai dari Rasulullah ﷺ hingga Imam Bahauddin Naqsyaband tercatat dalam kitab-kitab silsilah TQN (dokumen silsilah komunitas membuka rantai dengan urutan Allah Swt → Sayyidina Jibril → Rasulullah ﷺ sebelum masuk jalur sahabat); transkripsi per-nama menunggu deposit kitab silsilah resmi. 165 tidak mengarang nama.',
  },
  {
    chain: '165-SANAD-000001', order: 2,
    fromName: 'Silsilah klasik Naqsyabandiyyah (…→ Imam Bahauddin Naqsyaband)',
    toName: 'Syekh Ahmad Khatib Sambas',
    person: '165-PERSON-000004',
    eraNote: 'jalur Mujaddidiyyah, abad ke-14 → ke-19 M', evidenceLevel: 'E', verificationStatus: 'TRADITIONAL_ACCOUNT',
    sourceRef: '165-SRC-000006',
    context: 'MATA BLOK — deret nama antara Naqsyaband dan Sambas (jalur Mujaddidiyyah–Khalidiyyah) menunggu transkripsi dari kitab silsilah TQN.',
  },
  {
    chain: '165-SANAD-000001', order: 3,
    fromName: 'Syekh Ahmad Khatib Sambas',
    toName: 'Khalifah-khalifah penyebar TQN di Banten (nama per-mata menunggu deposit silsilah Menes)',
    eraNote: 'abad ke-19 → ke-20 M', evidenceLevel: 'D', verificationStatus: 'TRADITIONAL_ACCOUNT',
    sourceRef: '165-SRC-000006',
    context: 'Dokumen komunitas menyebut TQN "kemudian disebarkan oleh" para penerusnya hingga Banten — nama per-mata belum tersedia pada sumber yang dapat diakses.',
  },
  // ---- 165-SANAD-000002 · Qadiriyyah ----
  {
    chain: '165-SANAD-000002', order: 1,
    fromName: 'Rasulullah Muhammad ﷺ',
    toName: 'Silsilah klasik Qadiriyyah — jalur Ali bin Abi Thalib (gema Bashrah–Baghdad)',
    eraNote: 'abad ke-7 → ke-12 M', evidenceLevel: 'E', verificationStatus: 'TRADITIONAL_ACCOUNT',
    sourceRef: '165-SRC-000010',
    context: 'MATA BLOK — urutan mata rantai dari Rasulullah ﷺ hingga Imam Abdul Qadir al-Jilani tercatat dalam kitab-kitab silsilah TQN (konvensi pembukaan: Allah Swt → Sayyidina Jibril → Rasulullah ﷺ); transkripsi per-nama menunggu deposit. 165 tidak mengarang nama.',
  },
  {
    chain: '165-SANAD-000002', order: 2,
    fromName: 'Silsilah klasik Qadiriyyah (…→ Imam Abdul Qadir al-Jilani)',
    toName: 'Syekh Ahmad Khatib Sambas',
    person: '165-PERSON-000004',
    eraNote: 'abad ke-12 → ke-19 M', evidenceLevel: 'E', verificationStatus: 'TRADITIONAL_ACCOUNT',
    sourceRef: '165-SRC-000006',
    context: 'MATA BLOK — deret nama antara Imam al-Jilani dan Sambas menunggu transkripsi dari kitab silsilah TQN.',
  },
  {
    chain: '165-SANAD-000002', order: 3,
    fromName: 'Syekh Ahmad Khatib Sambas',
    toName: 'Khalifah-khalifah penyebar TQN di Banten (nama per-mata menunggu deposit silsilah Menes)',
    eraNote: 'abad ke-19 → ke-20 M', evidenceLevel: 'D', verificationStatus: 'TRADITIONAL_ACCOUNT',
    sourceRef: '165-SRC-000006',
    context: 'Gabungan dua jalur (Qadiriyyah + Naqsyabandiyyah) inilah yang oleh dokumen komunitas disebut dibawa ke Banten.',
  },
  // ---- 165-SANAD-000003 · Jalur Banten → Majlis 165 ----
  {
    chain: '165-SANAD-000003', order: 1,
    fromName: 'Khalifah-khalifah penyebar TQN di Banten',
    toName: 'Syekh Muhammad Asnawi al-Bantani (Caringin) — lingkungan silsilahnya',
    person: '165-PERSON-000007',
    eraNote: 'abad ke-19 → ke-20 M', evidenceLevel: 'E', verificationStatus: 'UNVERIFIED',
    sourceRef: '165-SRC-000007',
    context: 'MATA BLOK — kanal komunitas menyebut "…bin Syekh Muhammad Asnawi (Caringin, Banten), murid …" (kalimat terpotong): siapa guru tarekat Asnawi Caringin belum terbaca pada sumber yang dapat diakses. Hubungan tarekat ini TIDAK ditegaskan oleh 165.',
  },
  {
    chain: '165-SANAD-000003', order: 2,
    fromName: 'Syekh Muhammad Asnawi al-Bantani (Caringin)',
    toName: 'Syaikh Tubagus Ahmad Kadzim Asnawi (Mama Kadzim)',
    person: '165-PERSON-000008',
    eraNote: 'Caringin → Menes', evidenceLevel: 'E', verificationStatus: 'COMMUNITY_SUBMITTED',
    sourceRef: '165-SRC-000007',
    context: 'Kanal komunitas: "Syekh Ahmad Kadzim Asnawi (Menes, Banten) bin Syekh Muhammad Asnawi (Caringin, Banten)". "Bin" menegaskan nasab (putra-ayah, didukung Wikipedia & Pandeglang News); kaitan ijazah tarekat spesifik menunggu deposit ijazah.',
  },
  {
    chain: '165-SANAD-000003', order: 3,
    fromName: 'Syaikh Tubagus Ahmad Kadzim Asnawi (Mama Kadzim)',
    toName: 'Abah Krawanggana (KH Krawang Ghanna / Abah Cikangkung)',
    person: '165-PERSON-000009',
    eraNote: 'Menes → Cikangkung, Karawang', evidenceLevel: 'E', verificationStatus: 'COMMUNITY_SUBMITTED',
    sourceRef: '165-SRC-000007',
    context: 'Kanal komunitas: "Abah Krawanggana (Cikangkung, Karawang) … murid dari Syekh Ahmad Kadzim Asnawi (Menes, Banten)".',
  },
  {
    chain: '165-SANAD-000003', order: 4,
    fromName: 'Syaikh Tubagus Ahmad Kadzim Asnawi (Mama Kadzim)',
    toName: 'Abah Sukanta (Syekh Ahmad Sukanta)',
    person: '165-PERSON-000010',
    eraNote: 'orbit TQN Menes, Banten', evidenceLevel: 'E', verificationStatus: 'COMMUNITY_SUBMITTED',
    sourceRef: '165-SRC-000007',
    context: 'Kanal komunitas menyanding Abah Sukanta sebagai mursyid thoriqoh dalam lingkaran TQN Banten dan menyebut "keduanya murid dari Syekh Ahmad Kadzim Asnawi" — subjek "keduanya" dibaca mencakup Abah Sukanta; konfirmasi per-nama menunggu deposit ijazah.',
  },
  {
    chain: '165-SANAD-000003', order: 5,
    fromName: 'Abah Krawanggana & Abah Sukanta',
    toName: 'Jamaah majlis TQN 165 Cikangkung — murid-murid di Karawang, Banten, dan wilayah lain',
    eraNote: 'kini — Indonesia & luar negeri', evidenceLevel: 'E', verificationStatus: 'COMMUNITY_SUBMITTED',
    sourceRef: '165-SRC-000007',
    context: 'MATA BLOK — jamaah sebagai kolektif; daftar murid per-orang tidak dan tidak akan dipublikasikan tanpa izin (privasi by design).',
  },
]

// ------------------------------------------------------------------
// RELASI (masing-masing eksplisit; tidak ada yang disimpulkan)
// ------------------------------------------------------------------
export const SANAD_GLOBAL_RELATIONSHIPS: {
  from: string; to: string; predicate: string; level: string; status: string
  source?: string; context: string
}[] = [
  // garis nasab Banten (tersumber Wikipedia + kanal komunitas)
  { from: '165-PERSON-000005', to: '165-PERSON-000007', predicate: 'PARENT_OF', level: 'C', status: 'DOCUMENTED', source: '165-SRC-000003', context: 'Ayah Syekh Asnawi Caringin menurut Wikipedia ("Asnawi bin Abdurrahman").' },
  { from: '165-PERSON-000007', to: '165-PERSON-000008', predicate: 'PARENT_OF', level: 'C', status: 'DOCUMENTED', source: '165-SRC-000003', context: 'Wikipedia mencantumkan "Tubagus Ahmad Kadzim Asnawi (Mama Kadzim)" dalam daftar keturunan Syekh Asnawi.' },
  { from: '165-PERSON-000006', to: '165-PERSON-000007', predicate: 'TEACHER_OF', level: 'C', status: 'DOCUMENTED', source: '165-SRC-000003', context: 'Wikipedia: Asnawi menjadi murid Syekh Nawawi al-Bantani di Makkah (studi agama umum — bukan klaim sanad tarekat).' },
  // Sambas ↔ TQN & Makkah
  { from: '165-PERSON-000004', to: '165-TRAD-000001', predicate: 'ASSOCIATED_WITH', level: 'D', status: 'TRADITIONAL_ACCOUNT', source: '165-SRC-000006', context: 'Menurut dokumen komunitas, penyusun gabungan Qadiriyyah–Naqsyabandiyyah pada abad ke-19 di Makkah.' },
  { from: '165-PERSON-000004', to: '165-PLACE-000010', predicate: 'ASSOCIATED_WITH', level: 'D', status: 'TRADITIONAL_ACCOUNT', source: '165-SRC-000006', context: 'Tempat penyusunan gabungan TQN menurut dokumen komunitas.' },
  // Mama Kadzim ↔ tempat & tradisi
  { from: '165-PERSON-000008', to: '165-PLACE-000005', predicate: 'ASSOCIATED_WITH', level: 'C', status: 'DOCUMENTED', source: '165-SRC-000004', context: 'Pusat pengajaran TQN Cigandeng Menes (kajian UIN Banten).' },
  { from: '165-PERSON-000008', to: '165-TRAD-000001', predicate: 'ASSOCIATED_WITH', level: 'C', status: 'DOCUMENTED', source: '165-SRC-000004', context: 'Guru TQN paling berpengaruh di Banten (kajian UIN Banten).' },
  { from: '165-PERSON-000008', to: '165-PLACE-000006', predicate: 'ASSOCIATED_WITH', level: 'D', status: 'DOCUMENTED', source: '165-SRC-000005', context: 'Kelahiran Menes ±1912 (Pandeglang News).' },
  // komunitas 165
  { from: '165-PERSON-000009', to: '165-PERSON-000008', predicate: 'STUDENT_OF', level: 'E', status: 'COMMUNITY_SUBMITTED', source: '165-SRC-000007', context: '"Murid dari Syekh Ahmad Kadzim Asnawi (Menes, Banten)" — riwayat kanal komunitas.' },
  { from: '165-PERSON-000010', to: '165-PERSON-000008', predicate: 'STUDENT_OF', level: 'E', status: 'COMMUNITY_SUBMITTED', source: '165-SRC-000007', context: 'Kanal komunitas: "keduanya murid dari Syekh Ahmad Kadzim Asnawi" — subjek "keduanya" dibaca mencakup Abah Sukanta; konfirmasi menunggu deposit.' },
  { from: '165-PERSON-000009', to: '165-PLACE-000008', predicate: 'ASSOCIATED_WITH', level: 'E', status: 'COMMUNITY_SUBMITTED', source: '165-SRC-000007', context: 'Abah Cikangkung — mursyid majlis TQN 165 Cikangkung (riwayat komunitas).' },
  // referensi Suryalaya
  { from: '165-PERSON-000011', to: '165-PLACE-000009', predicate: 'ASSOCIATED_WITH', level: 'D', status: 'DOCUMENTED', source: '165-SRC-000008', context: 'Mursyid sekaligus sesepuh Pesantren Suryalaya (publikasi IAILM). Catatan: sanad Suryalaya TIDAK dipegang 165 — Abah Anom hanya figur referensi.' },
  { from: '165-PERSON-000011', to: '165-TRAD-000001', predicate: 'ASSOCIATED_WITH', level: 'D', status: 'DOCUMENTED', source: '165-SRC-000008', context: 'Mursyid TQN — cabang Suryalaya menyebar hingga Malaysia, Singapura, Thailand (publikasi IAILM).' },
  // tempat → provinsi/negara
  { from: '165-PLACE-000004', to: '165-PLACE-000001', predicate: 'LOCATED_IN', level: 'C', status: 'DOCUMENTED', context: 'Provinsi di Indonesia.' },
  { from: '165-PLACE-000005', to: '165-PLACE-000004', predicate: 'LOCATED_IN', level: 'C', status: 'DOCUMENTED', context: 'Cigandeng di Menes, Pandeglang, Banten.' },
  { from: '165-PLACE-000006', to: '165-PLACE-000004', predicate: 'LOCATED_IN', level: 'D', status: 'DOCUMENTED', context: 'Menes di Kabupaten Pandeglang, Banten.' },
  { from: '165-PLACE-000007', to: '165-PLACE-000004', predicate: 'LOCATED_IN', level: 'C', status: 'DOCUMENTED', context: 'Caringin, Labuan, Banten.' },
  { from: '165-PLACE-000008', to: '165-PLACE-000002', predicate: 'LOCATED_IN', level: 'E', status: 'COMMUNITY_SUBMITTED', context: 'Rengasdengklok, Karawang, Jawa Barat.' },
  { from: '165-INST-000002', to: '165-PLACE-000007', predicate: 'LOCATED_IN', level: 'C', status: 'DOCUMENTED', source: '165-SRC-000003', context: 'Madrasah Masyarikul Anwar di Caringin (1884).' },
  { from: '165-PERSON-000007', to: '165-INST-000002', predicate: 'FOUNDED', level: 'C', status: 'DOCUMENTED', source: '165-SRC-000003', context: 'Pendiri Madrasah Masyarikul Anwar (1884) menurut Wikipedia.' },
]

// ------------------------------------------------------------------
// ISI KOLEKSI SPESIAL
// ------------------------------------------------------------------
export const SANAD_GLOBAL_COLLECTION_ITEMS: { collection: string; item: string; order: number }[] = [
  { collection: '165-COLL-000002', item: '165-PERSON-000011', order: 1 }, // Abah Anom
  { collection: '165-COLL-000002', item: '165-PERSON-000009', order: 2 }, // Abah Krawanggana
  { collection: '165-COLL-000002', item: '165-PERSON-000010', order: 3 }, // Abah Sukanta
  { collection: '165-COLL-000002', item: '165-PERSON-000008', order: 4 }, // Mama Kadzim
  { collection: '165-COLL-000002', item: '165-PERSON-000007', order: 5 }, // Syekh Asnawi Caringin
  { collection: '165-COLL-000002', item: '165-PERSON-000004', order: 6 }, // Sambas
  { collection: '165-COLL-000002', item: '165-PERSON-000006', order: 7 }, // Nawawi al-Bantani
]

export const SANAD_GLOBAL_ENTITIES: EntitySeed[] = [
  ...SANAD_GLOBAL_SOURCES,
  ...SANAD_GLOBAL_PERSONS,
  ...SANAD_GLOBAL_PLACES,
  SANAD_GLOBAL_COLLECTION,
  ...SANAD_CHAINS,
]
