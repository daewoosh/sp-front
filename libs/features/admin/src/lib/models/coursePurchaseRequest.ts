import { UserCourseAccessState } from '@sp/core/models';

export interface CoursePurchaseRequest {
  token: string;
}

export interface UserCourseInfo {
  userId: number;
  telegramName?: string;
  creationDate: Date;
  courses: UserCourseDto[];
  internalId: string;
}

export interface UserCourseDto {
  id: number;
  activationDate?: string; // Date в ISO формате
  title: string;
  availableCourseItemsCount?: number;
  accessState: UserCourseAccessState;
}
