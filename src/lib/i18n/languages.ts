// 165 — Registry bahasa dunia
// Cakupan: seluruh bahasa berkode ISO 639-1 yang hidup + bahasa regional utama
// (termasuk bahasa-bahasa Nusantara) + bahasa liturgis/scholarly terpilih.
// Tier:
//   curated — kamus ditulis tangan penuh (id, en, ms, jv, su, ar)
//   ai      — kamus 131 string diterjemahkan mesin AI (scripts/gen-i18n.ts)
//   core    — dapat dipilih; antarmuka mengikuti Bahasa Indonesia (bawaan)
export type LangTier = 'curated' | 'ai' | 'core'

export type LangRegion =
  | 'Nusantara & Melayu'
  | 'Asia Timur'
  | 'Asia Selatan'
  | 'Timur Tengah & Asia Tengah'
  | 'Eropa'
  | 'Afrika'
  | 'Amerika'
  | 'Pasifik & Lainnya'

export interface LanguageDef {
  code: string
  /** nama bahasa dalam bahasanya sendiri */
  native: string
  /** nama dalam Bahasa Indonesia */
  name: string
  dir: 'ltr' | 'rtl'
  region: LangRegion
  tier: LangTier
}

const L = (code: string, native: string, name: string, region: LangRegion, tier: LangTier, dir: 'ltr' | 'rtl' = 'ltr'): LanguageDef => ({
  code, native, name, region, tier, dir,
})

export const REGION_ORDER: LangRegion[] = [
  'Nusantara & Melayu',
  'Asia Timur',
  'Asia Selatan',
  'Timur Tengah & Asia Tengah',
  'Eropa',
  'Afrika',
  'Amerika',
  'Pasifik & Lainnya',
]

export const LANGUAGES: readonly LanguageDef[] = [
  // ---------- Nusantara & Melayu ----------
  L('id', 'Bahasa Indonesia', 'Bahasa Indonesia', 'Nusantara & Melayu', 'curated'),
  L('jv', 'Basa Jawa', 'Bahasa Jawa', 'Nusantara & Melayu', 'curated'),
  L('su', 'Basa Sunda', 'Bahasa Sunda', 'Nusantara & Melayu', 'curated'),
  L('ms', 'Bahasa Melayu', 'Bahasa Melayu', 'Nusantara & Melayu', 'curated'),
  L('ban', 'Basa Bali', 'Bahasa Bali', 'Nusantara & Melayu', 'core'),
  L('bug', 'ᨅᨔ ᨕᨘᨁᨗ', 'Bahasa Bugis', 'Nusantara & Melayu', 'core'),
  L('ace', 'Acèh', 'Bahasa Aceh', 'Nusantara & Melayu', 'core'),
  L('mad', 'Madhurâ', 'Bahasa Madura', 'Nusantara & Melayu', 'core'),
  L('min', 'Minangkabau', 'Bahasa Minangkabau', 'Nusantara & Melayu', 'core'),
  L('sas', 'Basa Sasak', 'Bahasa Sasak', 'Nusantara & Melayu', 'core'),
  L('mak', 'Basa Mangkasara', 'Bahasa Makassar', 'Nusantara & Melayu', 'core'),
  L('bbc', 'Hata Batak Toba', 'Bahasa Batak Toba', 'Nusantara & Melayu', 'core'),
  L('iba', 'Jaku Iban', 'Bahasa Iban', 'Nusantara & Melayu', 'core'),
  L('tet', 'Tetun', 'Bahasa Tetum', 'Nusantara & Melayu', 'core'),

  // ---------- Asia Timur ----------
  L('zh', '中文', 'Bahasa Mandarin', 'Asia Timur', 'ai'),
  L('ja', '日本語', 'Bahasa Jepang', 'Asia Timur', 'ai'),
  L('ko', '한국어', 'Bahasa Korea', 'Asia Timur', 'ai'),
  L('mn', 'Монгол', 'Bahasa Mongolia', 'Asia Timur', 'ai'),
  L('yue', '粵語', 'Bahasa Kanton', 'Asia Timur', 'core'),
  L('ii', 'ꆈꌠꁱꂷ', 'Bahasa Yi', 'Asia Timur', 'core'),
  L('bo', 'བོད་སྐད།', 'Bahasa Tibet', 'Asia Timur', 'core'),
  L('dz', 'རྫོང་ཁ', 'Bahasa Dzongkha', 'Asia Timur', 'core'),
  L('za', 'Vahcuengh', 'Bahasa Zhuang', 'Asia Timur', 'core'),

  // ---------- Asia Selatan ----------
  L('hi', 'हिन्दी', 'Bahasa Hindi', 'Asia Selatan', 'ai'),
  L('ur', 'اردو', 'Bahasa Urdu', 'Asia Selatan', 'ai', 'rtl'),
  L('bn', 'বাংলা', 'Bahasa Bengali', 'Asia Selatan', 'ai'),
  L('pa', 'ਪੰਜਾਬੀ', 'Bahasa Punjabi', 'Asia Selatan', 'ai'),
  L('gu', 'ગુજરાતી', 'Bahasa Gujarati', 'Asia Selatan', 'ai'),
  L('mr', 'मराठी', 'Bahasa Marathi', 'Asia Selatan', 'ai'),
  L('ta', 'தமிழ்', 'Bahasa Tamil', 'Asia Selatan', 'ai'),
  L('te', 'తెలుగు', 'Bahasa Telugu', 'Asia Selatan', 'ai'),
  L('kn', 'ಕನ್ನಡ', 'Bahasa Kannada', 'Asia Selatan', 'ai'),
  L('ml', 'മലയാളം', 'Bahasa Malayalam', 'Asia Selatan', 'ai'),
  L('si', 'සිංහල', 'Bahasa Sinhala', 'Asia Selatan', 'ai'),
  L('ne', 'नेपाली', 'Bahasa Nepal', 'Asia Selatan', 'ai'),
  L('sd', 'سنڌي', 'Bahasa Sindhi', 'Asia Selatan', 'ai', 'rtl'),
  L('sa', 'संस्कृतम्', 'Bahasa Sanskerta', 'Asia Selatan', 'core'),
  L('pi', 'पालि', 'Bahasa Pali', 'Asia Selatan', 'core'),
  L('as', 'অসমীয়া', 'Bahasa Assam', 'Asia Selatan', 'core'),
  L('or', 'ଓଡ଼ିଆ', 'Bahasa Odia', 'Asia Selatan', 'core'),
  L('mai', 'मैथिली', 'Bahasa Maithili', 'Asia Selatan', 'core'),
  L('ks', 'कॉशुर', 'Bahasa Kashmir', 'Asia Selatan', 'core'),
  L('dv', 'ދިވެހި', 'Bahasa Divehi', 'Asia Selatan', 'core', 'rtl'),

  // ---------- Timur Tengah & Asia Tengah ----------
  L('ar', 'العربية', 'Bahasa Arab', 'Timur Tengah & Asia Tengah', 'curated', 'rtl'),
  L('fa', 'فارسی', 'Bahasa Persia', 'Timur Tengah & Asia Tengah', 'ai', 'rtl'),
  L('he', 'עברית', 'Bahasa Ibrani', 'Timur Tengah & Asia Tengah', 'ai', 'rtl'),
  L('tr', 'Türkçe', 'Bahasa Turki', 'Timur Tengah & Asia Tengah', 'ai'),
  L('ku', 'Kurdî', 'Bahasa Kurdi', 'Timur Tengah & Asia Tengah', 'ai'),
  L('ckb', 'کوردیی ناوەندی', 'Bahasa Kurdi Sorani', 'Timur Tengah & Asia Tengah', 'core', 'rtl'),
  L('ps', 'پښتو', 'Bahasa Pashto', 'Timur Tengah & Asia Tengah', 'ai', 'rtl'),
  L('ug', 'ئۇيغۇرچە', 'Bahasa Uighur', 'Timur Tengah & Asia Tengah', 'ai', 'rtl'),
  L('az', 'Azərbaycan', 'Bahasa Azerbaijan', 'Timur Tengah & Asia Tengah', 'ai'),
  L('kk', 'Қазақша', 'Bahasa Kazakh', 'Timur Tengah & Asia Tengah', 'ai'),
  L('ky', 'Кыргызча', 'Bahasa Kirgiz', 'Timur Tengah & Asia Tengah', 'ai'),
  L('uz', 'Oʻzbekcha', 'Bahasa Uzbek', 'Timur Tengah & Asia Tengah', 'ai'),
  L('tk', 'Türkmençe', 'Bahasa Turkmen', 'Timur Tengah & Asia Tengah', 'ai'),
  L('tg', 'Тоҷикӣ', 'Bahasa Tajik', 'Timur Tengah & Asia Tengah', 'ai'),
  L('tt', 'Татарча', 'Bahasa Tatar', 'Timur Tengah & Asia Tengah', 'core'),
  L('hy', 'Հայերեն', 'Bahasa Armenia', 'Timur Tengah & Asia Tengah', 'ai'),
  L('ka', 'ქართული', 'Bahasa Georgia', 'Timur Tengah & Asia Tengah', 'ai'),
  L('ab', 'Аҧсуа', 'Bahasa Abkhaz', 'Timur Tengah & Asia Tengah', 'core'),
  L('os', 'Ирон', 'Bahasa Ossetia', 'Timur Tengah & Asia Tengah', 'core'),
  L('ba', 'Башҡортса', 'Bahasa Bashkir', 'Timur Tengah & Asia Tengah', 'core'),
  L('cv', 'Чӑвашла', 'Bahasa Chuvash', 'Timur Tengah & Asia Tengah', 'core'),
  L('ce', 'Нохчийн мотт', 'Bahasa Chechen', 'Timur Tengah & Asia Tengah', 'core'),
  L('av', 'авар мацӏ', 'Bahasa Avar', 'Timur Tengah & Asia Tengah', 'core'),

  // ---------- Eropa ----------
  L('en', 'English', 'Bahasa Inggris', 'Eropa', 'curated'),
  L('fr', 'Français', 'Bahasa Prancis', 'Eropa', 'ai'),
  L('es', 'Español', 'Bahasa Spanyol', 'Eropa', 'ai'),
  L('de', 'Deutsch', 'Bahasa Jerman', 'Eropa', 'ai'),
  L('pt', 'Português', 'Bahasa Portugis', 'Eropa', 'ai'),
  L('it', 'Italiano', 'Bahasa Italia', 'Eropa', 'ai'),
  L('nl', 'Nederlands', 'Bahasa Belanda', 'Eropa', 'ai'),
  L('el', 'Ελληνικά', 'Bahasa Yunani', 'Eropa', 'ai'),
  L('ru', 'Русский', 'Bahasa Rusia', 'Eropa', 'ai'),
  L('uk', 'Українська', 'Bahasa Ukraina', 'Eropa', 'ai'),
  L('pl', 'Polski', 'Bahasa Polandia', 'Eropa', 'ai'),
  L('ro', 'Română', 'Bahasa Rumania', 'Eropa', 'ai'),
  L('hu', 'Magyar', 'Bahasa Hungaria', 'Eropa', 'ai'),
  L('cs', 'Čeština', 'Bahasa Ceko', 'Eropa', 'ai'),
  L('sk', 'Slovenčina', 'Bahasa Slovak', 'Eropa', 'ai'),
  L('bg', 'Български', 'Bahasa Bulgaria', 'Eropa', 'ai'),
  L('sr', 'Српски', 'Bahasa Serbia', 'Eropa', 'ai'),
  L('hr', 'Hrvatski', 'Bahasa Kroasia', 'Eropa', 'ai'),
  L('bs', 'Bosanski', 'Bahasa Bosnia', 'Eropa', 'ai'),
  L('sl', 'Slovenščina', 'Bahasa Slovenia', 'Eropa', 'ai'),
  L('mk', 'Македонски', 'Bahasa Makedonia', 'Eropa', 'ai'),
  L('sq', 'Shqip', 'Bahasa Albania', 'Eropa', 'ai'),
  L('lt', 'Lietuvių', 'Bahasa Lituania', 'Eropa', 'ai'),
  L('lv', 'Latviešu', 'Bahasa Latvia', 'Eropa', 'ai'),
  L('et', 'Eesti', 'Bahasa Estonia', 'Eropa', 'ai'),
  L('fi', 'Suomi', 'Bahasa Finlandia', 'Eropa', 'ai'),
  L('sv', 'Svenska', 'Bahasa Swedia', 'Eropa', 'ai'),
  L('no', 'Norsk', 'Bahasa Norwegia', 'Eropa', 'ai'),
  L('da', 'Dansk', 'Bahasa Denmark', 'Eropa', 'ai'),
  L('is', 'Íslenska', 'Bahasa Islandia', 'Eropa', 'ai'),
  L('ga', 'Gaeilge', 'Bahasa Irlandia', 'Eropa', 'ai'),
  L('cy', 'Cymraeg', 'Bahasa Wales', 'Eropa', 'ai'),
  L('mt', 'Malti', 'Bahasa Malta', 'Eropa', 'ai'),
  L('ca', 'Català', 'Bahasa Katalan', 'Eropa', 'ai'),
  L('gl', 'Galego', 'Bahasa Galisia', 'Eropa', 'ai'),
  L('eu', 'Euskara', 'Bahasa Basque', 'Eropa', 'ai'),
  L('eo', 'Esperanto', 'Bahasa Esperanto', 'Eropa', 'ai'),
  L('be', 'Беларуская', 'Bahasa Belarus', 'Eropa', 'core'),
  L('gd', 'Gàidhlig', 'Bahasa Gaelik Skotlandia', 'Eropa', 'core'),
  L('br', 'Brezhoneg', 'Bahasa Breton', 'Eropa', 'core'),
  L('fy', 'Frysk', 'Bahasa Frisia', 'Eropa', 'core'),
  L('lb', 'Lëtzebuergesch', 'Bahasa Luksemburg', 'Eropa', 'core'),
  L('fo', 'Føroyskt', 'Bahasa Faroe', 'Eropa', 'core'),
  L('kl', 'Kalaallisut', 'Bahasa Greenland', 'Eropa', 'core'),
  L('se', 'Davvisámegiella', 'Bahasa Sami Utara', 'Eropa', 'core'),
  L('rm', 'Rumantsch', 'Bahasa Romansh', 'Eropa', 'core'),
  L('oc', 'Occitan', 'Bahasa Oksitan', 'Eropa', 'core'),
  L('co', 'Corsu', 'Bahasa Korsika', 'Eropa', 'core'),
  L('sc', 'Sardu', 'Bahasa Sardinia', 'Eropa', 'core'),
  L('ast', 'Asturianu', 'Bahasa Asturia', 'Eropa', 'core'),
  L('an', 'Aragonés', 'Bahasa Aragon', 'Eropa', 'core'),
  L('li', 'Lèmburgs', 'Bahasa Limburg', 'Eropa', 'core'),
  L('gv', 'Gaelg', 'Bahasa Manx', 'Eropa', 'core'),
  L('kw', 'Kernewek', 'Bahasa Kornish', 'Eropa', 'core'),
  L('la', 'Latina', 'Bahasa Latin', 'Eropa', 'core'),
  L('yi', 'ייִדיש', 'Bahasa Yiddish', 'Eropa', 'core', 'rtl'),

  // ---------- Afrika ----------
  L('sw', 'Kiswahili', 'Bahasa Swahili', 'Afrika', 'ai'),
  L('am', 'አማርኛ', 'Bahasa Amharik', 'Afrika', 'ai'),
  L('ha', 'Hausa', 'Bahasa Hausa', 'Afrika', 'ai'),
  L('yo', 'Yorùbá', 'Bahasa Yoruba', 'Afrika', 'ai'),
  L('ig', 'Igbo', 'Bahasa Igbo', 'Afrika', 'ai'),
  L('zu', 'isiZulu', 'Bahasa Zulu', 'Afrika', 'ai'),
  L('xh', 'isiXhosa', 'Bahasa Xhosa', 'Afrika', 'ai'),
  L('af', 'Afrikaans', 'Bahasa Afrikaans', 'Afrika', 'ai'),
  L('sn', 'chiShona', 'Bahasa Shona', 'Afrika', 'ai'),
  L('so', 'Soomaali', 'Bahasa Somali', 'Afrika', 'ai'),
  L('mg', 'Malagasy', 'Bahasa Malagasi', 'Afrika', 'ai'),
  L('ff', 'Fulfulde', 'Bahasa Fula', 'Afrika', 'ai'),
  L('rw', 'Kinyarwanda', 'Bahasa Kinyarwanda', 'Afrika', 'ai'),
  L('ti', 'ትግርኛ', 'Bahasa Tigrinya', 'Afrika', 'core'),
  L('om', 'Afaan Oromoo', 'Bahasa Oromo', 'Afrika', 'core'),
  L('aa', 'Afaraf', 'Bahasa Afar', 'Afrika', 'core'),
  L('st', 'Sesotho', 'Bahasa Sesotho', 'Afrika', 'core'),
  L('tn', 'Setswana', 'Bahasa Setswana', 'Afrika', 'core'),
  L('ts', 'Xitsonga', 'Bahasa Tsonga', 'Afrika', 'core'),
  L('ss', 'SiSwati', 'Bahasa Swati', 'Afrika', 'core'),
  L('ve', 'Tshivenḓa', 'Bahasa Venda', 'Afrika', 'core'),
  L('nd', 'isiNdebele', 'Bahasa Ndebele', 'Afrika', 'core'),
  L('ny', 'Chichewa', 'Bahasa Chichewa', 'Afrika', 'core'),
  L('lg', 'Luganda', 'Bahasa Luganda', 'Afrika', 'core'),
  L('ln', 'Lingála', 'Bahasa Lingala', 'Afrika', 'core'),
  L('kg', 'Kikongo', 'Bahasa Kongo', 'Afrika', 'core'),
  L('ki', 'Gĩkũyũ', 'Bahasa Kikuyu', 'Afrika', 'core'),
  L('kj', 'Kuanyama', 'Bahasa Kwanyama', 'Afrika', 'core'),
  L('ng', 'Oshiwambo', 'Bahasa Ndonga', 'Afrika', 'core'),
  L('hz', 'Otjiherero', 'Bahasa Herero', 'Afrika', 'core'),
  L('wo', 'Wolof', 'Bahasa Wolof', 'Afrika', 'core'),
  L('bm', 'Bamanankan', 'Bahasa Bambara', 'Afrika', 'core'),
  L('ee', 'Eʋegbe', 'Bahasa Ewe', 'Afrika', 'core'),
  L('tw', 'Twi', 'Bahasa Twi', 'Afrika', 'core'),
  L('ak', 'Akan', 'Bahasa Akan', 'Afrika', 'core'),
  L('kab', 'Kabyle', 'Bahasa Kabyle', 'Afrika', 'core'),

  // ---------- Amerika ----------
  L('qu', 'Runa Simi', 'Bahasa Quechua', 'Amerika', 'core'),
  L('ay', 'Aymar aru', 'Bahasa Aymara', 'Amerika', 'core'),
  L('gn', "Avañe'ẽ", 'Bahasa Guarani', 'Amerika', 'core'),
  L('nv', 'Diné bizaad', 'Bahasa Navajo', 'Amerika', 'core'),
  L('cr', 'ᓀᐦᐃᔭᐍᐏᐣ', 'Bahasa Cree', 'Amerika', 'core'),
  L('iu', 'ᐃᓄᒃᑎᑐᑦ', 'Bahasa Inuktitut', 'Amerika', 'core'),
  L('ik', 'Iñupiaq', 'Bahasa Inupiaq', 'Amerika', 'core'),
  L('ht', 'Kreyòl ayisyen', 'Bahasa Kreol Haiti', 'Amerika', 'ai'),

  // ---------- Pasifik & Lainnya ----------
  L('mi', 'Te Reo Māori', 'Bahasa Maori', 'Pasifik & Lainnya', 'core'),
  L('sm', "Gagana faʻa Sāmoa", 'Bahasa Samoa', 'Pasifik & Lainnya', 'core'),
  L('to', 'Lea faka-Tonga', 'Bahasa Tonga', 'Pasifik & Lainnya', 'core'),
  L('fj', 'Na Vosa Vakaviti', 'Bahasa Fiji', 'Pasifik & Lainnya', 'core'),
  L('haw', 'ʻŌlelo Hawaiʻi', 'Bahasa Hawaii', 'Pasifik & Lainnya', 'core'),
  L('ty', 'Reo Tahiti', 'Bahasa Tahiti', 'Pasifik & Lainnya', 'core'),
  L('bi', 'Bislama', 'Bahasa Bislama', 'Pasifik & Lainnya', 'core'),
  L('ch', 'Chamoru', 'Bahasa Chamorro', 'Pasifik & Lainnya', 'core'),
  L('mh', 'Kajin M̧ajeļ', 'Bahasa Marshall', 'Pasifik & Lainnya', 'core'),
  L('na', 'Dorerin Naoero', 'Bahasa Nauru', 'Pasifik & Lainnya', 'core'),
  L('ia', 'Interlingua', 'Interlingua', 'Pasifik & Lainnya', 'core'),
  L('sah', 'Саха тыла', 'Bahasa Yakut', 'Pasifik & Lainnya', 'core'),
]

export const DEFAULT_LANG = 'id'

export function getLanguage(code: string): LanguageDef | undefined {
  return LANGUAGES.find((l) => l.code === code)
}

export function isSupported(code: string): boolean {
  return LANGUAGES.some((l) => l.code === code)
}

export function dirOf(code: string): 'ltr' | 'rtl' {
  return getLanguage(code)?.dir ?? 'ltr'
}

export function tierCounts() {
  const curated = LANGUAGES.filter((l) => l.tier === 'curated').length
  const ai = LANGUAGES.filter((l) => l.tier === 'ai').length
  const core = LANGUAGES.filter((l) => l.tier === 'core').length
  return { curated, ai, core, total: LANGUAGES.length }
}
