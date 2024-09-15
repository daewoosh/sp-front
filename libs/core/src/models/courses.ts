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

export interface CourseElement {
  type: CourseElementType;
  title: string;
  order: number;
}

export interface VideoCourseElement extends CourseElement {
  url: string;
  lastPosition: number;
  maxPosition: number;
}
