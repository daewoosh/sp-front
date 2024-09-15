import { CourseElement } from ".";

export interface Assignment extends CourseElement{
  isCompleted: boolean;
  questions: Question[];
}

export interface Question {
  text: string;
  answer: string;
  userAnswer?: string;
  order: number;
}
