import { CourseElement } from ".";

export interface Assignment extends CourseElement {
  assignmentId: number;
  questions: Question[];
  answersSaved: boolean;
  isResetMode: boolean;
  isCourseFinished: boolean;
}

export interface Question {
  text: string;
  answer: string;
  userAnswer: string|string[];
  order: number;
  id: number;
  type: QuestionType;
}

export enum QuestionType
{
  /// <summary>
  /// Ответ текстом.
  /// </summary>
  Text,
  /// <summary>
  /// Ответ с выбором одного варианта.
  /// </summary>
  SingleChoice,
  /// <summary>
  /// Ответ с выбором нескольких вариантов.
  /// </summary>
  MultipleChoice

}
