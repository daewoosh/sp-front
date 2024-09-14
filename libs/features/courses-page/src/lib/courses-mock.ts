import { Course, CourseElementType, CourseProgramItem } from "@sp/core/models/user-profile";

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
    progress:100
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
    progress:70,
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

