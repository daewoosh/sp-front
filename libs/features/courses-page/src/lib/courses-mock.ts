import { Course } from "@sp/core/models/user-profile";

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
  }]
