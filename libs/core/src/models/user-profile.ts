export interface UserProfile {
  userName: string;
  telegramName: string;
}

export interface Course {
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  isAvailable: boolean;
}


export enum CourseElementType {
  Video,
  Assignment
}

export interface CourseProgramItem {
  type: CourseElementType;
  title: string;
  order: number;
  isCompleted: boolean;
  progress?: number;
}
