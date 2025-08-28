export interface Course {
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  purchased: boolean;
  isAvailable: boolean;
  accessState: UserCourseAccessState;
  productType: ProductType;
  url?: string;

}

export enum ProductType
{
  Course = 1,
  Range = 2,
}

export enum CourseElementType {
  Video,
  Assignment
}

/// <summary>
/// Определяет доступ пользователя к курсу уже после покупки.
/// </summary>
export enum UserCourseAccessState
{
  Unknown = 0,
  Available = 1,
  Blocked = 2,
}

export interface CourseProgramItem {
  type: CourseElementType;
  title: string;
  order: number;
  isCompleted: boolean;
  progress?: number;
  isCurrent?: boolean;
  isAvailable?: boolean;
  purchased?: boolean;
}

export interface CourseElement {
  type: CourseElementType;
  title: string;
  order: number;
  courseName: string;
  isCompleted: boolean;
  courseSlug: string;
  id: number;
}

export interface VideoCourseElement extends CourseElement {
  description: string;
  url: string;
  lastPosition: number;
  maxPosition: number;
  videoId: number;
}
