// Статистика по одному курсу
export interface CourseStatisticsDto {
  courseId: number;
  courseTitle: string;
  // Кол-во игроков, которые активировали доступ
  activatedCount: number;
  // Активировали, но ни разу не открыли урок
  notStartedCount: number;
  // В процессе обучения (на текущем уроке < 5 дней)
  activeCount: number;
  // На одном уроке > 5 дней
  stuckCount: number;
  // Прогресс 100%
  completedCount: number;
}

