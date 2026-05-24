export interface CourseFeedbackDto {
  title: string;
  slug: string;
  displayName: string;
  comment?: string | null;
  isCompleted: boolean;
  completedAt?: Date | null;
  telegramId: number;
}
