import type { L, Lang } from "@/lib/lang";

export type RegionId =
  | "almaty"
  | "zhetisu"
  | "altai"
  | "akmola"
  | "mangystau"
  | "turkistan";

export type Transport = "car" | "suv" | "bus" | "horse" | "mixed" | "hike";
export type Difficulty = "easy" | "moderate" | "hard";

export type Region = { id: RegionId; name: L };
export type Stop = { name: L; position: [number, number]; night?: boolean };

export type Guide = {
  id: string;
  name: string;
  village: L;
  regionId: RegionId;
  bio: L;
  years: number;
  languages: Lang[];
  verified: boolean;
};

export type Tour = {
  id: string;
  regionId: RegionId;
  guideId: string;
  title: L;
  summary: L;
  days: number;
  priceKzt: number;
  difficulty: Difficulty;
  transport: Transport;
  meeting: L;
  includes: L[];
  image: string;
  position: [number, number];
  route: [number, number][];
  stops: Stop[];
};

const L3 = (kk: string, ru: string, en: string): L => ({ kk, ru, en });

export const regions: Region[] = [
  { id: "almaty", name: L3("Алматы және Іле Алатауы", "Алматы и Заилийский Алатау", "Almaty and the Ile Alatau") },
  { id: "zhetisu", name: L3("Жетісу", "Жетысу", "Zhetisu") },
  { id: "altai", name: L3("Қатонқарағай, Алтай", "Катон-Карагай, Алтай", "Katon-Karagay, Altai") },
  { id: "akmola", name: L3("Бурабай, Ақмола", "Бурабай, Акмола", "Burabay, Akmola") },
  { id: "mangystau", name: L3("Маңғыстау", "Мангистау", "Mangystau") },
  { id: "turkistan", name: L3("Түркістан облысы", "Туркестанская область", "Turkistan Region") },
];

export const guides: Guide[] = [
  {
    id: "aizhan",
    name: "Айжан Нұрпейіс",
    village: L3("Шелек", "Шелек", "Shelek"),
    regionId: "almaty",
    years: 8,
    languages: ["kk", "ru"],
    verified: true,
    bio: L3(
      "Шарын мен Көлсайды бала күнінен біледі. Топты жолда ұстайды, бағаны алдын ала айтады.",
      "Знает Чарын и Кольсай с детства. Держит темп группы и называет цену до выезда.",
      "Grew up between Charyn and Kolsai. Sets the pace and quotes the price before you leave.",
    ),
  },
  {
    id: "asel",
    name: "Әсел Жұмабек",
    village: L3("Медеу, Алматы", "Медеу, Алматы", "Medeu, Almaty"),
    regionId: "almaty",
    years: 7,
    languages: ["kk", "ru", "en"],
    verified: true,
    bio: L3(
      "Бір күндік тау жорықтары. Ағылшынша түсіндіреді, қаладан қайту уақытын ұстайды.",
      "Однодневные выходы в горы. Объясняет по-английски и возвращает группу в город вовремя.",
      "Day hikes above the city. Explains the trail in English and gets you back on time.",
    ),
  },
  {
    id: "serik",
    name: "Серік Әлімхан",
    village: L3("Басши", "Басши", "Basshi"),
    regionId: "zhetisu",
    years: 12,
    languages: ["kk", "ru"],
    verified: true,
    bio: L3(
      "Алтынемелдің шаңы мен желін біледі. Құмға жеңіл көлікпен шықпайды.",
      "Знает пыль и ветер Алтын-Эмеля. На бархан на легковушке не выезжает.",
      "Knows the wind on Altyn-Emel. He will not take a city car onto the dune.",
    ),
  },
  {
    id: "arman",
    name: "Арман Бекетай",
    village: L3("Қатонқарағай", "Катон-Карагай", "Katon-Karagay"),
    regionId: "altai",
    years: 15,
    languages: ["kk", "ru"],
    verified: true,
    bio: L3(
      "Жылқы мен жол талғамайтын көлік. Берел мен Рахман — оның әдеттегі аптасы.",
      "Лошади и внедорожник. Берель и Рахмановские ключи — его обычная неделя.",
      "Horses and a four-wheel drive. Berel and the Rakhman springs are a normal week.",
    ),
  },
  {
    id: "dana",
    name: "Дана Оспан",
    village: L3("Бурабай", "Бурабай", "Burabay"),
    regionId: "akmola",
    years: 6,
    languages: ["kk", "ru", "en"],
    verified: true,
    bio: L3(
      "Астанадан келген топты күтіп алады. Көл мен қарағай арасында асықпайтын маршрут.",
      "Встречает группы из Астаны. Спокойный маршрут между озером и соснами.",
      "Meets groups coming up from Astana. A slow route between the lake and the pines.",
    ),
  },
  {
    id: "yerlan",
    name: "Ерлан Сәрсен",
    village: L3("Ақтау", "Актау", "Aktau"),
    regionId: "mangystau",
    years: 14,
    languages: ["kk", "ru"],
    verified: true,
    bio: L3(
      "Үстірттің жиегін жолсыз жерден өткізеді. Су, жанармай және кері қайту — оның жауапкершілігі.",
      "Ведёт по кромке Устюрта вне асфальта. Вода, топливо и обратная дорога — на нём.",
      "Drives the Ustyurt rim off the pavement. Water, fuel, and the way back are his job.",
    ),
  },
  {
    id: "nurlan",
    name: "Нұрлан Тілеу",
    village: L3("Жабағылы", "Жабаглы", "Zhabagly"),
    regionId: "turkistan",
    years: 10,
    languages: ["kk", "ru"],
    verified: true,
    bio: L3(
      "Қорық жиегінде өскен. Ақсуға апарар соқпақты артық әңгімесіз көрсетеді.",
      "Вырос у границы заповедника. Показывает тропу к Аксу без лишних речей.",
      "Raised on the edge of the reserve. He shows the Aksu path without a speech.",
    ),
  },
  {
    id: "madina",
    name: "Мәдина Қайрат",
    village: L3("Түркістан", "Туркестан", "Turkestan"),
    regionId: "turkistan",
    years: 9,
    languages: ["kk", "ru", "en"],
    verified: true,
    bio: L3(
      "Кесене мен Сауран қалашығын бір күнге сыйғызады. Тарихты қысқа және дәл айтады.",
      "Укладывает мавзолей и городище Сауран в один день. История — коротко и точно.",
      "Fits the mausoleum and the ruins of Sauran into one day. History, short and exact.",
    ),
  },
];

export const tours: Tour[] = [
  {
    id: "charyn-day",
    regionId: "almaty",
    guideId: "aizhan",
    title: L3("Шарын шатқалы — бір күн", "Чарынский каньон — один день", "Charyn Canyon in a day"),
    summary: L3(
      "Алматыдан Шелек арқылы Қорғандар аңғарына дейін көлікпен. Кешке қалаға ораласыз.",
      "На машине из Алматы через Шелек в Долину замков. К вечеру вы снова в городе.",
      "A car day from Almaty through Shelek to the Valley of Castles, back by evening.",
    ),
    days: 1,
    priceKzt: 32000,
    difficulty: "easy",
    transport: "car",
    meeting: L3("Алматы, Достық даңғылы, 06:30", "Алматы, проспект Достык, 06:30", "Almaty, Dostyq Avenue, 06:30"),
    includes: [
      L3("Көлік және жанармай", "Машина и топливо", "Car and fuel"),
      L3("Кіру және гид", "Вход и гид", "Entry and the guide"),
      L3("Су", "Вода", "Water"),
    ],
    image: "/tours/charyn.jpg",
    position: [43.325, 79.059],
    route: [
      [43.238, 76.945],
      [43.36, 77.28],
      [43.5, 77.82],
      [43.599, 78.249],
      [43.48, 78.62],
      [43.39, 78.88],
      [43.325, 79.059],
    ],
    stops: [
      { name: L3("Алматы", "Алматы", "Almaty"), position: [43.238, 76.945] },
      { name: L3("Көкпек", "Кокпек", "Kokpek"), position: [43.452, 78.062] },
      { name: L3("Шелек", "Шелек", "Shelek"), position: [43.599, 78.249] },
      { name: L3("Шарын", "Чарын", "Charyn"), position: [43.325, 79.059] },
    ],
  },
  {
    id: "kolsai",
    regionId: "almaty",
    guideId: "aizhan",
    title: L3("Көлсай көлдері", "Озёра Кольсай", "Kolsai Lakes"),
    summary: L3(
      "Екі күн: Шелек, Саты ауылы және төменгі Көлсай. Түн ауыл үйінде.",
      "Два дня: Шелек, село Саты и нижний Кольсай. Ночь в деревенском доме.",
      "Two days: Shelek, Saty village, and the lower Kolsai lake. A night in the village.",
    ),
    days: 2,
    priceKzt: 68000,
    difficulty: "moderate",
    transport: "car",
    meeting: L3("Алматы, 07:00", "Алматы, 07:00", "Almaty, 07:00"),
    includes: [
      L3("Көлік", "Трансфер", "Transfers"),
      L3("Бір түн ауылда", "Ночь в селе", "One night in the village"),
      L3("Таңғы ас", "Завтрак", "Breakfast"),
    ],
    image: "/tours/kolsai.jpg",
    position: [42.991, 78.327],
    route: [
      [43.238, 76.945],
      [43.45, 77.6],
      [43.599, 78.249],
      [43.35, 78.42],
      [43.071, 78.409],
      [42.991, 78.327],
    ],
    stops: [
      { name: L3("Алматы", "Алматы", "Almaty"), position: [43.238, 76.945] },
      { name: L3("Шелек", "Шелек", "Shelek"), position: [43.599, 78.249] },
      { name: L3("Саты — түн", "Саты — ночь", "Saty — night"), position: [43.071, 78.409], night: true },
      { name: L3("Көлсай", "Кольсай", "Kolsai"), position: [42.991, 78.327] },
    ],
  },
  {
    id: "kaindy",
    regionId: "almaty",
    guideId: "aizhan",
    title: L3("Қайынды көлі", "Озеро Каинды", "Kaindy Lake"),
    summary: L3(
      "Сатыдан суға батқан шыршаларға дейін қысқа көлік. Көл жағасында жаяу.",
      "Короткий переезд из Саты к затопленным елям. Дальше пешком вдоль берега.",
      "A short drive from Saty to the drowned spruces, then a walk along the shore.",
    ),
    days: 1,
    priceKzt: 26000,
    difficulty: "easy",
    transport: "car",
    meeting: L3("Саты ауылы, 09:00", "Село Саты, 09:00", "Saty village, 09:00"),
    includes: [
      L3("Ауылдан трансфер", "Трансфер из села", "Transfer from the village"),
      L3("Гид", "Гид", "Guide"),
      L3("Кіру", "Вход", "Park entry"),
    ],
    image: "/tours/kaindy.jpg",
    position: [42.985, 78.466],
    route: [
      [43.071, 78.409],
      [43.04, 78.45],
      [42.985, 78.466],
    ],
    stops: [
      { name: L3("Саты", "Саты", "Saty"), position: [43.071, 78.409] },
      { name: L3("Қайынды бекеті", "Кордон Каинды", "Kaindy gate"), position: [43.016, 78.448] },
      { name: L3("Қайынды", "Каинды", "Kaindy"), position: [42.985, 78.466] },
    ],
  },
  {
    id: "big-almaty",
    regionId: "almaty",
    guideId: "asel",
    title: L3("Үлкен Алматы көлі", "Большое Алматинское озеро", "Big Almaty Lake"),
    summary: L3(
      "Қаланың оңтүстігінен тау жолымен көлге. Биіктікке үйренбегендерге асықпаймыз.",
      "Горная дорога от юга города к озеру. Без спешки, если высота непривычна.",
      "The mountain road from the south of the city up to the lake. No rush if altitude is new.",
    ),
    days: 1,
    priceKzt: 24000,
    difficulty: "easy",
    transport: "car",
    meeting: L3("Алматы, Әл-Фараби, 08:00", "Алматы, Аль-Фараби, 08:00", "Almaty, Al-Farabi, 08:00"),
    includes: [
      L3("Көлік", "Машина", "Car"),
      L3("Гид", "Гид", "Guide"),
      L3("Кіру төлемі", "Вход", "Entry fee"),
    ],
    image: "/tours/bal.jpg",
    position: [43.051, 76.985],
    route: [
      [43.222, 76.91],
      [43.15, 76.93],
      [43.09, 76.96],
      [43.051, 76.985],
    ],
    stops: [
      { name: L3("Алматы", "Алматы", "Almaty"), position: [43.222, 76.91] },
      { name: L3("Космостанция", "Космостанция", "Cosmostation"), position: [43.081, 76.972] },
      { name: L3("Үлкен Алматы көлі", "Большое Алматинское", "Big Almaty Lake"), position: [43.051, 76.985] },
    ],
  },
  {
    id: "kok-zhailau",
    regionId: "almaty",
    guideId: "asel",
    title: L3("Көк-Жайлау жорығы", "Поход на Кок-Жайляу", "Kok-Zhailau hike"),
    summary: L3(
      "Медеуден жайлауға дейін жаяу. Көлік жоқ — картада соқпақ көрсетілген.",
      "Пешком от Медеу до джайляу. Машины нет — на карте сама тропа.",
      "On foot from Medeu to the pasture. No vehicle — the map shows the trail itself.",
    ),
    days: 1,
    priceKzt: 18000,
    difficulty: "moderate",
    transport: "hike",
    meeting: L3("Медеу, 08:30", "Медеу, 08:30", "Medeu, 08:30"),
    includes: [
      L3("Гид", "Гид", "Guide"),
      L3("Маршрут сызбасы", "Схема тропы", "Trail sketch"),
      L3("Су", "Вода", "Water"),
    ],
    image: "/tours/meadow.jpg",
    position: [43.133, 76.956],
    route: [
      [43.157, 77.059],
      [43.15, 77.02],
      [43.142, 76.99],
      [43.133, 76.956],
    ],
    stops: [
      { name: L3("Медеу", "Медеу", "Medeu"), position: [43.157, 77.059] },
      { name: L3("Жота ертоқымы", "Седловина", "Saddle"), position: [43.145, 77.005] },
      { name: L3("Көк-Жайлау", "Кок-Жайляу", "Kok-Zhailau"), position: [43.133, 76.956] },
    ],
  },
  {
    id: "singing-dune",
    regionId: "zhetisu",
    guideId: "serik",
    title: L3("Әнші құм — Алтынемел", "Поющий бархан — Алтын-Эмель", "The Singing Dune, Altyn-Emel"),
    summary: L3(
      "Алматыдан Қонаев пен Басши арқылы құмға. Екі күн, түн кордонда.",
      "Из Алматы через Конаев и Басши к бархану. Два дня, ночь на кордоне.",
      "From Almaty through Qonaev and Basshi to the dune. Two days, a night at the ranger post.",
    ),
    days: 2,
    priceKzt: 76000,
    difficulty: "easy",
    transport: "car",
    meeting: L3("Алматы, 07:00", "Алматы, 07:00", "Almaty, 07:00"),
    includes: [
      L3("Көлік", "Машина", "Vehicle"),
      L3("Парк төлемі", "Билеты в парк", "Park fees"),
      L3("Түндеу", "Ночёвка", "Overnight stay"),
    ],
    image: "/tours/dune.jpg",
    position: [43.855, 78.528],
    route: [
      [43.238, 76.945],
      [43.55, 77.02],
      [43.856, 77.062],
      [44.12, 77.7],
      [44.156, 78.749],
      [43.98, 78.62],
      [43.855, 78.528],
    ],
    stops: [
      { name: L3("Алматы", "Алматы", "Almaty"), position: [43.238, 76.945] },
      { name: L3("Қонаев", "Конаев", "Qonaev"), position: [43.856, 77.062] },
      { name: L3("Басши — түн", "Басши — ночь", "Basshi — night"), position: [44.156, 78.749], night: true },
      { name: L3("Әнші құм", "Поющий бархан", "Singing dune"), position: [43.855, 78.528] },
    ],
  },
  {
    id: "rakhman",
    regionId: "altai",
    guideId: "arman",
    title: L3("Қатонқарағай — Рахман бұлақтары", "Катон-Карагай — Рахмановские ключи", "Katon-Karagay to Rakhman springs"),
    summary: L3(
      "Төрт күн жол талғамайтын көлікпен: ауыл, Берел, ыстық бұлақ. Жол ұзын, байланыс әлсіз.",
      "Четыре дня на внедорожнике: село, Берель, горячие ключи. Дорога длинная, связь слабая.",
      "Four days by 4×4: the village, Berel, then the hot springs. The road is long and the signal is thin.",
    ),
    days: 4,
    priceKzt: 148000,
    difficulty: "moderate",
    transport: "suv",
    meeting: L3("Қатонқарағай, 09:00", "Катон-Карагай, 09:00", "Katon-Karagay, 09:00"),
    includes: [
      L3("Жол талғамайтын көлік", "Внедорожник", "4×4"),
      L3("Үш түн", "Три ночи", "Three nights"),
      L3("Ауыл асханасы", "Еда в селе", "Village meals"),
    ],
    image: "/tours/altai.jpg",
    position: [49.548, 86.508],
    route: [
      [49.172, 85.615],
      [49.25, 85.98],
      [49.32, 86.25],
      [49.373, 86.432],
      [49.46, 86.49],
      [49.548, 86.508],
    ],
    stops: [
      { name: L3("Қатонқарағай", "Катон-Карагай", "Katon-Karagay"), position: [49.172, 85.615] },
      { name: L3("Үрел", "Урыль", "Uryl"), position: [49.282, 86.338] },
      { name: L3("Берел — түн", "Берель — ночь", "Berel — night"), position: [49.373, 86.432], night: true },
      { name: L3("Рахман", "Рахмановские ключи", "Rakhman springs"), position: [49.548, 86.508] },
    ],
  },
  {
    id: "belukha",
    regionId: "altai",
    guideId: "arman",
    title: L3("Белуха етегіне атпен", "К подножию Белухи верхом", "Horseback toward Belukha"),
    summary: L3(
      "Рахманнан шекара жотасына қарай атты соқпақ. Алты күн, тәжірибесі барларға.",
      "Верховая тропа от ключей к пограничному хребту. Шесть дней, нужен опыт.",
      "A horse trail from the springs toward the border ridge. Six days, for people who have ridden.",
    ),
    days: 6,
    priceKzt: 230000,
    difficulty: "hard",
    transport: "horse",
    meeting: L3("Рахман бұлақтары", "Рахмановские ключи", "Rakhman springs"),
    includes: [
      L3("Ат және ер", "Лошадь и седло", "Horse and saddle"),
      L3("Лагерь", "Лагерь", "Camp"),
      L3("Гид-атбегі", "Проводник", "Horse guide"),
    ],
    image: "/tours/altai.jpg",
    position: [49.72, 86.56],
    route: [
      [49.548, 86.508],
      [49.61, 86.53],
      [49.67, 86.55],
      [49.72, 86.56],
    ],
    stops: [
      { name: L3("Рахман", "Ключи", "Springs"), position: [49.548, 86.508] },
      { name: L3("Лагерь — түн", "Лагерь — ночь", "Camp — night"), position: [49.64, 86.54], night: true },
      { name: L3("Жота етегі", "Подножие хребта", "Ridge approach"), position: [49.72, 86.56] },
    ],
  },
  {
    id: "burabay",
    regionId: "akmola",
    guideId: "dana",
    title: L3("Бурабай демалысы", "Выходные в Бурабае", "A Burabay weekend"),
    summary: L3(
      "Астанадан Щучинск арқылы автобус. Көл, қарағай, екі күн.",
      "Автобус из Астаны через Щучинск. Озеро, сосны, два дня.",
      "A bus from Astana through Shchuchinsk. The lake, the pines, two days.",
    ),
    days: 2,
    priceKzt: 45000,
    difficulty: "easy",
    transport: "bus",
    meeting: L3("Астана, теміржол вокзалы, 08:00", "Астана, ж/д вокзал, 08:00", "Astana railway station, 08:00"),
    includes: [
      L3("Автобус", "Автобус", "Bus"),
      L3("Бір түн", "Ночь", "One night"),
      L3("Гид", "Гид", "Guide"),
    ],
    image: "/tours/burabay.jpg",
    position: [53.083, 70.309],
    route: [
      [51.128, 71.43],
      [51.5, 71.15],
      [51.95, 70.85],
      [52.45, 70.42],
      [52.939, 70.186],
      [53.083, 70.309],
    ],
    stops: [
      { name: L3("Астана", "Астана", "Astana"), position: [51.128, 71.43] },
      { name: L3("Щучинск — түн", "Щучинск — ночь", "Shchuchinsk — night"), position: [52.939, 70.186], night: true },
      { name: L3("Бурабай", "Бурабай", "Burabay"), position: [53.083, 70.309] },
    ],
  },
  {
    id: "bozzhyra",
    regionId: "mangystau",
    guideId: "yerlan",
    title: L3("Бозжыра — 4×4", "Бозжыра на внедорожнике", "Bozzhyra by 4×4"),
    summary: L3(
      "Ақтаудан Жаңаөзен арқылы үстірт жиегіне. Үш күн, соңғы шақырымдар — топырақ жол.",
      "Из Актау через Жанаозен к кромке плато. Три дня, последние километры — грунт.",
      "From Aktau through Zhanaozen to the plateau rim. Three days; the last kilometres are dirt.",
    ),
    days: 3,
    priceKzt: 112000,
    difficulty: "moderate",
    transport: "suv",
    meeting: L3("Ақтау, 07:30", "Актау, 07:30", "Aktau, 07:30"),
    includes: [
      L3("4×4 және жанармай", "Внедорожник и топливо", "4×4 and fuel"),
      L3("Екі түн", "Две ночи", "Two nights"),
      L3("Су қоры", "Запас воды", "Water cache"),
    ],
    image: "/tours/bozzhyra.jpg",
    position: [43.417, 54.073],
    route: [
      [43.635, 51.168],
      [43.52, 51.85],
      [43.42, 52.35],
      [43.338, 52.856],
      [43.4, 53.45],
      [43.417, 54.073],
    ],
    stops: [
      { name: L3("Ақтау", "Актау", "Aktau"), position: [43.635, 51.168] },
      { name: L3("Жаңаөзен — түн", "Жанаозен — ночь", "Zhanaozen — night"), position: [43.338, 52.856], night: true },
      { name: L3("Үстірт бекеті", "Пост Устюрта", "Ustyurt post"), position: [43.39, 53.55] },
      { name: L3("Бозжыра", "Бозжыра", "Bozzhyra"), position: [43.417, 54.073] },
    ],
  },
  {
    id: "aksu",
    regionId: "turkistan",
    guideId: "nurlan",
    title: L3("Ақсу шатқалы", "Каньон Аксу", "Aksu Canyon"),
    summary: L3(
      "Шымкенттен Жабағылыға көлік, әрі қарай шатқалға жаяу. Екі күн.",
      "Машина из Шымкента в Жабаглы, дальше к каньону пешком. Два дня.",
      "A car from Shymkent to Zhabagly, then on foot toward the canyon. Two days.",
    ),
    days: 2,
    priceKzt: 56000,
    difficulty: "moderate",
    transport: "mixed",
    meeting: L3("Шымкент, 08:00", "Шымкент, 08:00", "Shymkent, 08:00"),
    includes: [
      L3("Трансфер", "Трансфер", "Transfer"),
      L3("Ауылда түн", "Ночь в селе", "Village night"),
      L3("Қорық гиді", "Проводник заповедника", "Reserve guide"),
    ],
    image: "/tours/aksu.jpg",
    position: [42.308, 70.635],
    route: [
      [42.315, 69.588],
      [42.38, 70.05],
      [42.42, 70.35],
      [42.438, 70.478],
      [42.37, 70.55],
      [42.308, 70.635],
    ],
    stops: [
      { name: L3("Шымкент", "Шымкент", "Shymkent"), position: [42.315, 69.588] },
      { name: L3("Жабағылы — түн", "Жабаглы — ночь", "Zhabagly — night"), position: [42.438, 70.478], night: true },
      { name: L3("Соқпақ", "Тропа", "Trail"), position: [42.36, 70.56] },
      { name: L3("Ақсу", "Аксу", "Aksu"), position: [42.308, 70.635] },
    ],
  },
  {
    id: "turkestan",
    regionId: "turkistan",
    guideId: "madina",
    title: L3("Түркістан және Сауран", "Туркестан и Сауран", "Turkestan and Sauran"),
    summary: L3(
      "Кесенеден Сауран қалашығына дейін бір күндік көлік. Жаяу аралау қысқа.",
      "Один день на машине от мавзолея до городища Сауран. Пешие участки короткие.",
      "A car day from the mausoleum out to the ruins of Sauran. The walks are short.",
    ),
    days: 1,
    priceKzt: 22000,
    difficulty: "easy",
    transport: "car",
    meeting: L3("Түркістан, кесене алаңы, 09:30", "Туркестан, площадь мавзолея, 09:30", "Turkestan, mausoleum square, 09:30"),
    includes: [
      L3("Көлік", "Машина", "Car"),
      L3("Гид", "Гид", "Guide"),
      L3("Кіру билеттері", "Входные билеты", "Tickets"),
    ],
    image: "/tours/yasawi.jpg",
    position: [43.298, 68.271],
    route: [
      [43.298, 68.271],
      [43.38, 68.08],
      [43.45, 67.92],
      [43.515, 67.77],
    ],
    stops: [
      { name: L3("Түркістан", "Туркестан", "Turkestan"), position: [43.298, 68.271] },
      { name: L3("Қарнақ", "Карнак", "Karnak"), position: [43.42, 67.95] },
      { name: L3("Сауран", "Сауран", "Sauran"), position: [43.515, 67.77] },
    ],
  },
];

export function regionById(id: RegionId): Region {
  const region = regions.find((item) => item.id === id);
  if (!region) throw new Error(`Unknown region ${id}`);
  return region;
}

export function guideById(id: string): Guide | undefined {
  return guides.find((guide) => guide.id === id);
}

export function tourById(id: string): Tour | undefined {
  return tours.find((tour) => tour.id === id);
}

export function toursForGuide(id: string): Tour[] {
  return tours.filter((tour) => tour.guideId === id);
}

export const vehicleTransports: Transport[] = ["car", "suv", "bus", "horse", "mixed"];
