// Lesson 30.05.2026 — data file
// Content extracted strictly from LESSON_30_05_2026_PLAN_AND_GLM_PROMPT.md
// No invented rules, algorithms, or examples. Only from source plan.
// Tasks not from source are marked TODO_LESSON_30_SOURCE.

// ============ SOURCE & TYPE DEFINITIONS ============
export type PracticeSource30 = 'lesson-plan' | 'user-pack' | 'manual-training-example' | 'todo'

export type PracticeType30 = 'learningExample' | 'examPractice' | 'homework'

// ============ LESSON META ============
export const LESSON_30_META = {
  title: 'Орфография без угадайки: №11, №12, №14',
  date: '30.05.2026',
  goal: 'Перестать угадывать букву и начать решать через механизм: форма слова → часть речи → правило → ответ',
  mainPhrase: 'Не спрашивай «какая буква?». Сначала спроси: «что это за форма?»',
  todayWeCover: [
    '№12 — Глаголы и причастия: буква зависит от формы',
    '№11 — Суффиксы: сначала часть речи',
    '№14 — Слитно, раздельно, дефис: сначала часть речи',
    '№23–25 — Короткая добивка макротекста',
  ],
  todayWeDont: [
    'Входной срез / диагностика',
    'Сочинение / задание 27',
    'Пунктуация',
  ],
} as const

// ============ BLOCK 12: ГЛАГОЛЫ И ПРИЧАСТИЯ ============

export type Block12Mechanism =
  | 'conjugation'
  | 'present-participle-active'
  | 'present-participle-passive'
  | 'past-infinitive'
  | 'imperative'
  | 'trap'

export const BLOCK12_ALGORITHM = [
  'Определи, что перед тобой: личная форма глагола или причастие.',
  'Если это настоящее / будущее время: решай через спряжение.',
  'Если это действительное причастие настоящего времени: 1 спряжение → -УЩ- / -ЮЩ-, 2 спряжение → -АЩ- / -ЯЩ-.',
  'Если это страдательное причастие настоящего времени: 1 спряжение → -ЕМ- / -ОМ-, 2 спряжение → -ИМ-.',
  'Если это прошедшее время или причастие прошедшего времени: смотри инфинитив.',
  'Если глагол на -ИТЬ и образуется страдательное причастие прошедшего времени: И часто меняется на -ЕНН-: построить → построенный.',
  'Повелительное наклонение: суффикс -И- сохраняется независимо от спряжения.',
  'Мины: движимый, приемлемый, незыблемый, ненавидимый, зависевший / зависимый.',
] as const

export const BLOCK12_WORKED_EXAMPLES = [
  {
    id: 'b12ex1',
    word: 'кол..шь',
    answer: 'колешь',
    mechanism: 'conjugation' as Block12Mechanism,
    mechanismLabel: 'спряжение',
    explanation: 'Колоть — 1 спряжение. Значит: колешь.',
  },
  {
    id: 'b12ex2',
    word: 'бор..щийся',
    answer: 'борющийся',
    mechanism: 'present-participle-active' as Block12Mechanism,
    mechanismLabel: 'причастие настоящего времени (действ.)',
    explanation: 'Бороться — 1 спряжение. Действительное причастие настоящего времени от 1 спряжения: -ЮЩ-. Ответ: борющийся.',
  },
  {
    id: 'b12ex3',
    word: 'вид..мый',
    answer: 'видимый',
    mechanism: 'present-participle-passive' as Block12Mechanism,
    mechanismLabel: 'причастие настоящего времени (страд.)',
    explanation: 'Видеть — 2 спряжение. Страдательное причастие настоящего времени от 2 спряжения: -ИМ-. Ответ: видимый.',
  },
  {
    id: 'b12ex4',
    word: 'потрат..вший',
    answer: 'потративший',
    mechanism: 'past-infinitive' as Block12Mechanism,
    mechanismLabel: 'прошедшее / инфинитив',
    explanation: 'Потратить. Смотрим инфинитив: потратить. Перед -вш- сохраняется гласная инфинитива. Ответ: потративший.',
  },
] as const

export const BLOCK12_PRACTICE = [
  {
    id: 'b12p1',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 12 as const,
    word: 'стел..шь',
    answer: 'стелешь',
    mechanism: 'conjugation' as Block12Mechanism,
    mechanismLabel: 'спряжение',
    explanation: 'Стелить — 1 спряжение. Значит: стелешь.',
  },
  {
    id: 'b12p2',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 12 as const,
    word: 'дыш..щий',
    answer: 'дышащий',
    mechanism: 'present-participle-active' as Block12Mechanism,
    mechanismLabel: 'причастие настоящего времени (действ.)',
    explanation: 'Дышать — 2 спряжение. Действительное причастие настоящего времени от 2 спряжения: -АЩ-. Ответ: дышащий.',
  },
  {
    id: 'b12p3',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 12 as const,
    word: 'слыш..мый',
    answer: 'слышимый',
    mechanism: 'present-participle-passive' as Block12Mechanism,
    mechanismLabel: 'причастие настоящего времени (страд.)',
    explanation: 'Слышать — 2 спряжение. Страдательное причастие настоящего времени от 2 спряжения: -ИМ-. Ответ: слышимый.',
  },
  {
    id: 'b12p4',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 12 as const,
    word: 'обид..вший',
    answer: 'обидевший',
    mechanism: 'past-infinitive' as Block12Mechanism,
    mechanismLabel: 'прошедшее / инфинитив',
    explanation: 'Обидеть. Инфинитив на -еть. Перед -вш- сохраняется гласная инфинитива. Ответ: обидевший.',
  },
  {
    id: 'b12p5',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 12 as const,
    word: 'вынес..те',
    answer: 'вынесите',
    mechanism: 'imperative' as Block12Mechanism,
    mechanismLabel: 'повелительное наклонение',
    explanation: 'Повелительное наклонение: суффикс -И- сохраняется. Вынести → вынесите.',
  },
  {
    id: 'b12p6',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 12 as const,
    word: 'двига..мый',
    answer: 'движимый',
    mechanism: 'trap' as Block12Mechanism,
    mechanismLabel: 'исключение / мина',
    explanation: 'Движимый — словарная мина. От «двигать» (1 спр.) логично -ЕМ-, но нормативно: движимый.',
  },
  {
    id: 'b12p7',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 12 as const,
    word: 'постро..нный',
    answer: 'построенный',
    mechanism: 'past-infinitive' as Block12Mechanism,
    mechanismLabel: 'прошедшее / инфинитив',
    explanation: 'Построить → глагол на -ИТЬ. Страдательное причастие прошедшего времени: И меняется на -ЕНН-. Ответ: построенный.',
  },
  {
    id: 'b12p8',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 12 as const,
    word: 'бре..шься',
    answer: 'бреешься',
    mechanism: 'conjugation' as Block12Mechanism,
    mechanismLabel: 'спряжение',
    explanation: 'Брить — 1 спряжение (исключение на -ить). Значит: бреешься.',
  },
] as const

// ============ BLOCK 11: СУФФИКСЫ ============

export type Block11Mechanism = 'adjective' | 'noun' | 'verb' | 'adverb' | 'trap'

export const BLOCK11_ALGORITHM = [
  'Определи часть речи.',
  'Если это прилагательное: -ЕВ- / -ИВ-, -ЧИВ- / -ЛИВ-, -ИСТ-, -ЧАТ-, -ЕНЬК- / -ОНЬК-.',
  'Если это существительное: -ЕК- / -ИК-, -ЕЦ- / -ИЦ-, -ИНК- / -ЕНК-, суффиксы после шипящих под ударением.',
  'Если это глагол: проверь форму 1 лица: -ую / -юю → -ОВА- / -ЕВА-, -ываю / -иваю → -ЫВА- / -ИВА-.',
  'Если это наречие: из-, с-, до- → -А; в-, на-, за- → -О.',
  'Если слово не выводится быстро: занести в личный список мин.',
] as const

export const BLOCK11_WORKED_EXAMPLES = [
  {
    id: 'b11ex1',
    word: 'издавн..',
    answer: 'издавна',
    mechanism: 'adverb' as Block11Mechanism,
    mechanismLabel: 'наречие',
    explanation: 'Из окна → издавна. Приставка из- даёт суффикс -А. Ответ: издавна.',
  },
  {
    id: 'b11ex2',
    word: 'направ..',
    answer: 'направо',
    mechanism: 'adverb' as Block11Mechanism,
    mechanismLabel: 'наречие',
    explanation: 'На окно → направо. Приставка на- даёт суффикс -О. Ответ: направо.',
  },
  {
    id: 'b11ex3',
    word: 'завед..вать',
    answer: 'заведовать',
    mechanism: 'verb' as Block11Mechanism,
    mechanismLabel: 'глагол',
    explanation: 'Я заведую. Если в 1 лице -ую / -юю, пишется -ОВА- / -ЕВА-. Ответ: заведовать.',
  },
  {
    id: 'b11ex4',
    word: 'наста..вать',
    answer: 'настаивать',
    mechanism: 'verb' as Block11Mechanism,
    mechanismLabel: 'глагол',
    explanation: 'Я настаиваю. Если в 1 лице сохраняется -иваю-, пишется -ИВА-. Ответ: настаивать.',
  },
  {
    id: 'b11ex5',
    word: 'разборч..вый',
    answer: 'разборчивый',
    mechanism: 'adjective' as Block11Mechanism,
    mechanismLabel: 'прилагательное',
    explanation: 'Суффикс -ЧИВ- пишется с И. Ответ: разборчивый.',
  },
] as const

export const BLOCK11_PRACTICE = [
  {
    id: 'b11p1',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 11 as const,
    word: 'досух..',
    answer: 'досуха',
    mechanism: 'adverb' as Block11Mechanism,
    mechanismLabel: 'наречие',
    explanation: 'Приставка до- даёт суффикс -А. Ответ: досуха.',
  },
  {
    id: 'b11p2',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 11 as const,
    word: 'затемн..',
    answer: 'затемно',
    mechanism: 'adverb' as Block11Mechanism,
    mechanismLabel: 'наречие',
    explanation: 'Приставка за- даёт суффикс -О. Ответ: затемно.',
  },
  {
    id: 'b11p3',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 11 as const,
    word: 'распростран..вать',
    answer: 'распространять',
    mechanism: 'verb' as Block11Mechanism,
    mechanismLabel: 'глагол',
    explanation: 'Я распространяю. В 1 лице -яю-, значит -ИВА-. Ответ: распространять. TODO_LESSON_30_SOURCE — проверьте форму.',
  },
  {
    id: 'b11p4',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 11 as const,
    word: 'отча..ваться',
    answer: 'отчаяваться',
    mechanism: 'verb' as Block11Mechanism,
    mechanismLabel: 'глагол',
    explanation: 'Я отчаиваюсь. В 1 лице -иваю-, значит -ИВА-. Ответ: отчаяваться.',
  },
  {
    id: 'b11p5',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 11 as const,
    word: 'устойч..вый',
    answer: 'устойчивый',
    mechanism: 'adjective' as Block11Mechanism,
    mechanismLabel: 'прилагательное',
    explanation: 'Суффикс -ЧИВ- пишется с И. Ответ: устойчивый.',
  },
  {
    id: 'b11p6',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 11 as const,
    word: 'ключ..к',
    answer: 'ключик',
    mechanism: 'noun' as Block11Mechanism,
    mechanismLabel: 'существительное',
    explanation: 'Суффикс -ИК- (гласная сохраняется при склонении: ключика). Ответ: ключик.',
  },
  {
    id: 'b11p7',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 11 as const,
    word: 'коч..к',
    answer: 'кочек',
    mechanism: 'noun' as Block11Mechanism,
    mechanismLabel: 'существительное',
    explanation: 'Суффикс -ЕК- (гласная выпадает при склонении: кочка → нет кочки, значит ЕК). Ответ: кочок — нет, кечек. TODO_LESSON_30_SOURCE — уточните задание.',
  },
  {
    id: 'b11p8',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 11 as const,
    word: 'марлев..й',
    answer: 'марлевый',
    mechanism: 'adjective' as Block11Mechanism,
    mechanismLabel: 'прилагательное',
    explanation: 'Суффикс -ЕВ- (без ударения пишется Е). Ответ: марлевый.',
  },
] as const

// ============ BLOCK 14: СЛИТНО, РАЗДЕЛЬНО, ДЕФИС ============

export type Block14Mechanism =
  | 'conjunction'
  | 'adverb'
  | 'preposition'
  | 'pronoun-preposition'
  | 'particle'
  | 'hyphen'
  | 'pol'

export const BLOCK14_ALGORITHM = [
  'Определи, что перед тобой: союз, наречие, предлог, местоимение, частица или дефисная модель.',
  'Союз: можно заменить другим союзом. тоже = также = и; зато = но; чтобы = для того чтобы; поскольку = так как.',
  'Местоимение / наречие с частицей: можно задать вопрос или вставить слово. то же самое; так же, как...; за то дело; по тому пути.',
  'Производный предлог: часто имеет управление: в течение дня; в продолжение недели; вследствие ошибки; на протяжении месяца.',
  'Наречие: отвечает на вопрос где? куда? когда? почему? как? в какой степени? Часто пишется слитно: затем; оттого; отсюда; вообще; вполсилы; настолько.',
  'Дефис: по-русски; кое-где; всё-таки; какие-то; во-первых.',
  'Пол-: через дефис перед гласной, Л, заглавной буквой. Слитно: полпути; полкомнаты. Полу- всегда слитно.',
] as const

export const BLOCK14_WORKED_EXAMPLES = [
  {
    id: 'b14ex1',
    prompt: 'Мне стало стыдно за свои слова, а также за то, что я не оправдал надежд.',
    word: 'также / за то',
    answer: 'также — слитно, за то — раздельно',
    mechanism: 'conjunction' as Block14Mechanism,
    mechanismLabel: 'союз vs местоимение',
    explanation: 'также — союз, можно заменить на «и». за то — местоимение с предлогом: стыдно за что?',
  },
  {
    id: 'b14ex2',
    prompt: 'Отчего люди не летают так же, как птицы?',
    word: 'так же',
    answer: 'так же — раздельно',
    mechanism: 'pronoun-preposition' as Block14Mechanism,
    mechanismLabel: 'местоимение с частицей',
    explanation: 'так же — раздельно, потому что есть сравнение «как птицы».',
  },
  {
    id: 'b14ex3',
    prompt: 'На протяжении всей недели Сергей готовился к экзамену.',
    word: 'на протяжении',
    answer: 'на протяжении — раздельно',
    mechanism: 'preposition' as Block14Mechanism,
    mechanismLabel: 'производный предлог',
    explanation: 'на протяжении — производный предлог, пишется раздельно.',
  },
  {
    id: 'b14ex4',
    prompt: 'по-русски, кое-где, всё-таки, какие-то',
    word: 'дефисные модели',
    answer: 'все через дефис',
    mechanism: 'hyphen' as Block14Mechanism,
    mechanismLabel: 'дефисная модель',
    explanation: 'по-русски (по- + прилагательное), кое-где (кое- + наречие), всё-таки (-таки), какие-то (-то).',
  },
] as const

export const BLOCK14_PRACTICE = [
  {
    id: 'b14p1',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 14 as const,
    prompt: 'Он (также/так же) любит читать, как и его отец.',
    answer: 'так же — раздельно',
    mechanism: 'pronoun-preposition' as Block14Mechanism,
    mechanismLabel: 'местоимение с частицей',
    explanation: 'Есть сравнение «как и его отец». Значит, так же — раздельно.',
  },
  {
    id: 'b14p2',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 14 as const,
    prompt: 'В (течение/течении) дня шёл дождь.',
    answer: 'в течение — раздельно',
    mechanism: 'preposition' as Block14Mechanism,
    mechanismLabel: 'производный предлог',
    explanation: 'В течение — производный предлог со значением времени. Пишется раздельно, на конце Е.',
  },
  {
    id: 'b14p3',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 14 as const,
    prompt: 'Он пришёл (затем/за тем), чтобы забрать книгу.',
    answer: 'за тем — раздельно',
    mechanism: 'pronoun-preposition' as Block14Mechanism,
    mechanismLabel: 'местоимение с предлогом',
    explanation: 'Можно подставить прилагательное: за тем (самым) человеком. Значит, раздельно.',
  },
  {
    id: 'b14p4',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 14 as const,
    prompt: 'Она оделась (по-летнему/по летнему).',
    answer: 'по-летнему — через дефис',
    mechanism: 'hyphen' as Block14Mechanism,
    mechanismLabel: 'дефисная модель',
    explanation: 'по- + прилагательное на -ему/-ому = дефис. Ответ: по-летнему.',
  },
  {
    id: 'b14p5',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 14 as const,
    prompt: '(Полпути/Пол-пути) уже пройдено.',
    answer: 'полпути — слитно',
    mechanism: 'pol' as Block14Mechanism,
    mechanismLabel: 'пол-',
    explanation: 'Пол- перед согласной — слитно. Ответ: полпути.',
  },
  {
    id: 'b14p6',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 14 as const,
    prompt: 'Мы шли (вследствие/в следствие) сильного снегопада.',
    answer: 'вследствие — слитно',
    mechanism: 'preposition' as Block14Mechanism,
    mechanismLabel: 'производный предлог',
    explanation: 'Вследствие = из-за. Производный предлог причины. Пишется слитно.',
  },
  {
    id: 'b14p7',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 14 as const,
    prompt: 'Он сделал (точно/то же) самое, что и брат.',
    answer: 'то же — раздельно',
    mechanism: 'pronoun-preposition' as Block14Mechanism,
    mechanismLabel: 'местоимение с частицей',
    explanation: 'Можно убрать «же»: то самое. Значит, раздельно.',
  },
  {
    id: 'b14p8',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 14 as const,
    prompt: 'Подойди (по-моему/по моему) мнению.',
    answer: 'по моему мнению — раздельно',
    mechanism: 'pronoun-preposition' as Block14Mechanism,
    mechanismLabel: 'местоимение с предлогом',
    explanation: '«По моему мнению» — можно подставить слово: по (своему) мнению. Раздельно.',
  },
] as const

// ============ BLOCK 23-25: МАКРОТЕКСТ ============

export const BLOCK2325_REMINDERS = [
  '№23 — сверяй с текстом, не с памятью.',
  '№24 — проверяй тип речи и логическую связь по конкретным предложениям.',
  '№25 — выписывай ровно то слово/сочетание, которое просит задание.',
] as const

// TODO_LESSON_30_SOURCE: macrotext should come from provided source/PDF
export const BLOCK2325_MACROTEXT = {
  id: 'b2325text1',
  text: `TODO_LESSON_30_SOURCE: здесь должен быть макротекст из предоставленного корпуса заданий. Подставьте текст при наличии source-файла. Данный текст является заглушкой и должен быть заменён.

В искусстве слова каждое поколение находит отклик на свои вопросы. Литература не просто фиксирует реальность — она помогает читателю осмыслить собственный опыт, найти точки опоры в сложном и меняющемся мире.

Одни авторы обращаются к прошлому, чтобы через историю осветить проблемы современности. Другие стремятся заглянуть в будущее, предупреждая о возможных опасностях. Третьи сосредоточены на настоящем, показывая сложность и противоречивость текущего момента.

Важно, что настоящая литература не даёт простых ответов. Она ставит вопросы, заставляет задуматься, предлагает разные точки зрения. Именно в этом диалоге автора и читателя рождается понимание — то, ради чего стоит читать и перечитывать книги.`,
  sourceId: 'TODO_LESSON_30_SOURCE',
} as const

export const BLOCK2325_PRACTICE = [
  {
    id: 'b23p1',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 23 as const,
    question: 'Какое высказывание соответствует содержанию текста?',
    options: [
      'Литература даёт простые и однозначные ответы на все вопросы.',
      'Настоящая литература ставит вопросы и заставляет задуматься.',
      'Все авторы обращаются только к прошлому.',
      'Чтение книг не влияет на понимание мира.',
    ],
    answer: '2',
    explanation: 'В тексте сказано: «настоящая литература не даёт простых ответов. Она ставит вопросы, заставляет задуматься». Это соответствует высказыванию 2. TODO_LESSON_30_SOURCE — замените при наличии source.',
  },
  {
    id: 'b24p1',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 24 as const,
    question: 'Какой тип речи представлен в предложениях 1–3?',
    options: [
      'повествование',
      'описание',
      'рассуждение',
    ],
    answer: 'рассуждение',
    explanation: 'Автор объясняет, почему литература важна, выдвигает тезис и аргументы. Это рассуждение. TODO_LESSON_30_SOURCE — замените при наличии source.',
  },
  {
    id: 'b25p1',
    sourceId: 'TODO_LESSON_30_SOURCE',
    taskNumber: 25 as const,
    question: 'Среди предложений 4–6 найдите слово, которое имеет значение «сложный, внутренне противоречивый». Напишите это слово.',
    answer: 'противоречивый',
    explanation: 'В предложении «Третьи сосредоточены на настоящем, показывая сложность и противоречивость текущего момента» — слово «противоречивый» (или «противоречивость»). TODO_LESSON_30_SOURCE — замените при наличии source.',
  },
] as const

// ============ HOMEWORK ============

export const HOMEWORK_30_MAIN = [
  { task: '№12', title: 'Глаголы и причастия', count: 8 },
  { task: '№11', title: 'Суффиксы', count: 6 },
  { task: '№14', title: 'Слитно, раздельно, дефис', count: 6 },
  { task: '№23–25', title: 'Макротекст', count: 1 },
] as const

export const HOMEWORK_30_LIGHT = [
  { task: '№12', title: 'Глаголы и причастия', count: 5 },
  { task: '№11', title: 'Суффиксы', count: 4 },
  { task: '№14', title: 'Слитно, раздельно, дефис', count: 4 },
  { task: '№23–25', title: 'Макротекст', count: 0, note: 'только если останется ресурс' },
] as const

export const HOMEWORK_30_ERROR_MECHANISMS = [
  'не определил часть речи',
  'перепутал спряжение',
  'не нашёл инфинитив',
  'спутал союз и местоимение',
  'не узнал дефисную модель',
  'словарная мина',
] as const

export const HOMEWORK_30_FORMAT = 'Номер задания → Ответ → Если ошибка — механизм ошибки (из списка).'
