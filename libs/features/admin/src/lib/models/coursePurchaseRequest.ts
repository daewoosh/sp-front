import { UserCourseAccessState } from '@sp/core/models';
import { ProgressState } from './progressState';
import { CourseFeedbackDto } from './courseFeedbackDto';

export interface CoursePurchaseRequest {
  token: string;
}

export interface UserCourseInfo {
  userId: number;
  telegramId?: number;
  telegramName?: string;
  creationDate: Date;
  courses: UserCourseDto[];
  internalId: string;
  purchasedCoursesCount: number;
}

export interface UserCourseDto {
  id: number;
  activationDate?: string; // Date в ISO формате
  title: string;
  availableCourseItemsCount?: number;
  accessState: UserCourseAccessState;
  progressState?: ProgressState;
  currentItemTitle?: string; // название текущего (или последнего) элемента курса
  comment?: string;
  progressDescription?: string;
  lastActivityDate?: Date;
  feedback: CourseFeedbackDto | null;
}
