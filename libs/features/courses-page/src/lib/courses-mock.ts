import { Assignment, Course, CourseElementType, CourseProgramItem, VideoCourseElement } from "@sp/core/models";

export const COURSES: Course[] = [{
  title: 'Only Покер',
  subtitle: 'новый подход к покерному образованию',
  slug: 'only-poker',
  description: 'Уникальный формат обучения в команде единомышленников, состоящий из индивидуальных и групповых тренировок!',
  icon: 'only-poker.svg',
  image: 'only-poker.png',
  isAvailable: true
},
  {
    title: 'Осознанное начало',
    subtitle: '(для начинающих игроков)',
    slug: 'osoznannoe-nachalo',
    description: 'Все необходимые знания для новичков, с помощью которых вы положите уверенное начало в покере и начнете расти как игрок.',
    icon: 'osoznannoe-nachalo.svg',
    image: 'osoznannoe-nachalo.png',
    isAvailable: false
  },
  {
    title: 'Продвинутый курс',
    subtitle: '(для опытных игроков)',
    slug: 'prodvinutyi-kurs',
    description: 'Курс для опытных игроков в покер, состоящий из 13-летнего концентрата знаний Глеба Тремзина, а также лучших тренеров SafePoker и MVP Team.',
    icon: 'prodvinutyi-kurs.svg',
    image: 'prodvinutyi-kurs.png',
    isAvailable: false
  }
];

export const COURSE_PROGRAM: CourseProgramItem[] = [
  {
    type: CourseElementType.Video,
    title: 'Урок 1. Введение в МТТ',
    order: 1,
    isCompleted: true,
    progress: 100
  },
  {
    type: CourseElementType.Assignment,
    title: 'Домашнее задание 1',
    order: 2,
    isCompleted: true
  },
  {
    type: CourseElementType.Video,
    title: 'Урок 2. Игра против любителей',
    order: 3,
    isCompleted: false,
    progress: 70,
  },
  {
    type: CourseElementType.Assignment,
    title: 'Домашнее задание 2',
    order: 4,
    isCompleted: false
  },
  {
    type: CourseElementType.Video,
    title: 'Урок 3. Игра R vs BB',
    order: 5,
    isCompleted: false
  },
  {
    type: CourseElementType.Assignment,
    title: 'Домашнее задание 3',
    order: 6,
    isCompleted: false
  },
  {
    type: CourseElementType.Video,
    title: 'Урок 4. Игра без позиции',
    order: 7,
    isCompleted: false
  },
  {
    type: CourseElementType.Assignment,
    title: 'Домашнее задание 4',
    order: 8,
    isCompleted: false
  },
  {
    type: CourseElementType.Video,
    title: 'Урок 5. Игра в 3-bet потах',
    order: 9,
    isCompleted: false
  },
  {
    type: CourseElementType.Assignment,
    title: 'Домашнее задание 5',
    order: 10,
    isCompleted: false
  },
  {
    type: CourseElementType.Video,
    title: 'Урок 6. Игра на малом блайнде',
    order: 11,
    isCompleted: false
  },
  {
    type: CourseElementType.Assignment,
    title: 'Домашнее задание 6',
    order: 12,
    isCompleted: false
  },
  {
    type: CourseElementType.Video,
    title: 'Урок 7. Защита большого блайнда',
    order: 13,
    isCompleted: false
  },
  {
    type: CourseElementType.Assignment,
    title: 'Домашнее задание 7',
    order: 14,
    isCompleted: false
  },
  {
    type: CourseElementType.Video,
    title: 'Урок 8. Бабл фактор и риск премиум',
    order: 15,
    isCompleted: false
  },
  {
    type: CourseElementType.Assignment,
    title: 'Домашнее задание 8',
    order: 16,
    isCompleted: false
  },
  {
    type: CourseElementType.Video,
    title: 'Урок 9. Flopzilla',
    order: 17,
    isCompleted: false
  },
  {
    type: CourseElementType.Assignment,
    title: 'Домашнее задание 9',
    order: 18,
    isCompleted: false
  }
];


export const VIDEO_COURSE_ELEMENT: VideoCourseElement = {
  order: 1,
  title: 'Урок 2. МТТ турниры и чекфолд',
  type: CourseElementType.Video,
  url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  lastPosition: 0,
  maxPosition: 0,
  courseName: 'Only Покер',
  description: "Введение в МТТ, терминология, особенности (GTO vs exploit), механика игры, ренжи.<br> <br>" +
    "Не секрет, что профессиональные игроки в покер общаются на «своем» языке. Для того чтобы понимать, о чем они говорят, необходимо изучить покерную терминологию.\n"
}

export const ASSIGNMENT_COURSE_ELEMENT: Assignment = {
  isCompleted: false,
  order: 2,
  type: CourseElementType.Assignment,
  title: 'Домашнее задание 2. МТТ турниры',
  courseName: 'Only Покер',
  questions: [{
    order: 1,
    answer: 'Мы должны обязательно поизолить . При этом выбор сайза рассматривать от 8бб в такой глубине, так как у разномастных АК чуть меньше эквити, чем у одномастных . ',
    text: 'Глубина стеков 100бб, мы на баттоне с АКо. На позиции MP1 игрок залимпил. Наше действие на префлопе?'
  },
    {
      order: 2,
      answer: 'Если бы я никак не попал в доску, использовал бы мелкие сайзинги (флоп 33% - тёрн 33% - ривер 44-66%) на трех улицах и доблефовывал ривер только в том случае, если с флопа и терна не закрылись бы какие-то дрова. На этой доске делал бы доблеф. \n' +
        'Если бы я проставлял на велью, использовал бы подкрученные сайзы на всех улицах, так какк оппонент телефон (Флоп 66% + Тёрн 90% + Ривер пот+).\n',
      text: 'Игра против лимпера на СО в эффективном стеке 60бб. Игрок на утг+1 сыграл лимп, мы поизолили 3.5 бб с 8♠️7♠️ , оппонент играет колл.\n' +
        'Как бы вы сыграли по улицам и почему?  Наш оппонент пассивный фиш, который играет только колл.\n' +
        'флоп 10♥️ J♥️ 4♦️  Терн 2♦️  и ривер 6♠️.\n'
    },
    {
      order: 3,
      answer: 'На префлопе бы изолировал в такой глубине сайзингом 6бб+. Постфлоп на всех трех улицах мы сильно старше против диапазона колла соперника. Использовал бы только крупные сайзинги по всем улицам - флоп 66% + тёрн 90% + Ривер пот+. ',
      text: 'Игра против лимпера на HJ, мы его поизолили на SB c AQo? эффективный стек 80бб. \n' +
        'Как бы вы сыграли на префлопе и как бы вы сыграли по улицам и почему? Наш оппонент любитель.\n' +
        'Флоп Q♥️9♦️8♦️, Терн 6♥️, ривер 3♠️\n'
    },
    {
      order: 4,
      answer: 'В такой ситуации мы часто будем играть против линейного диапазона. На постфлопе нам нужны комбинации 2 пары +, топ пары будет часто не достаточно. Поэтому разыгрываем аккуратно.',
      text: 'Игра против лимпера на СО в эффективном стеке 60бб. Игрок на утг+1 сыграл лимп, мы поизолили 3.5 бб с 8♠️7♠️, он нас 3-бетнул 9бб. Наша реакция и наши мысли.'
    },]
}
