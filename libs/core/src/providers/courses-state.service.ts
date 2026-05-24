import { inject, Injectable, INJECTOR } from '@angular/core';
import { StateService } from '../state';
import { Course, CourseProgramItem } from '../models';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { FeedbackModalComponent } from '../state/feedback-modal/feedback-modal.component';

export interface CoursesState {
  courses: Course[];
  courseProgram: CourseProgramItem[];
  coursesLoaded: boolean;
  courseItemHeight: number; // Высота элемента программы курса (полная информация об элементе курса)
  currentSelectedCourse?: Course | undefined;
}

const initialState: CoursesState = {
  courses: [],
  courseProgram: [],
  coursesLoaded: false,
  courseItemHeight: 0,
};

@Injectable({ providedIn: 'root' })
export class CoursesStateService extends StateService<CoursesState> {
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);

  public selectCourses = this.select(({ courses }: CoursesState) => courses);

  public selectCourseProgram = this.select(
    ({ courseProgram }: CoursesState) => courseProgram
  );
  public selectCoursesLoaded = this.select(
    ({ coursesLoaded }: CoursesState) => coursesLoaded
  );
  public selectCourseItemHeight = this.select(
    ({ courseItemHeight }: CoursesState) => courseItemHeight
  );

  public selectSelectedCourse = this.select(
    (currentSelectedCourse: CoursesState) =>
      currentSelectedCourse.currentSelectedCourse
  );

  constructor() {
    super(initialState);
  }

  public setCourses(courses: Course[]): void {
    this.setState({ courses, coursesLoaded: true });
  }

  public setCourseProgram(courseProgram: CourseProgramItem[]): void {
    this.setState({ courseProgram });
  }

  public setCurrentCourse(courseSlug: string): void {
    const course = {
      ...this.state.courses.find((c) => c.slug === courseSlug),
    } as Course;
    if (course) {
      this.setState({ currentSelectedCourse: course });
    }
  }

  updateVideoProgress(
    order: number,
    lastPosition: number,
    duration: number
  ): void {
    const currentProgram = [...this.state.courseProgram];
    for (const item of currentProgram) {
      if (item.order === order) {
        const newProgress = Math.ceil((lastPosition / duration) * 100);
        const itemProgress = item.progress || 0;
        if (newProgress > itemProgress && newProgress <= 100) {
          item.progress = newProgress;
        }
      }
    }
    this.setState({ courseProgram: currentProgram });
  }

  completeItem(order: number, courseFinished: boolean): void {
    const currentProgram = [...this.state.courseProgram];
    for (const item of currentProgram) {
      if (item.order === order) {
        item.progress = 100;
        item.isCompleted = true;
        item.isCurrent = false;
      }
      if (item.order === order + 1 && !item.isCompleted) {
        item.isCurrent = true;
      }
      this.setState({ courseProgram: currentProgram });
    }
    if (courseFinished) {
      this.handleCourseFinish();
    }
  }

  setCourseItemHeight(height: number): void {
    this.setState({ courseItemHeight: height });
  }

  clearCourses() {
    this.setState(initialState);
  }

  private handleCourseFinish(){
    const selectedCourse = this.state.currentSelectedCourse;
    if (!selectedCourse) {
      return;
    }
    this.dialogs
      .open<boolean>(
        new PolymorpheusComponent(FeedbackModalComponent, this.injector),
        {
          data: {
            course: selectedCourse,
            // userName: course.userName,
          }, // Pass any data if needed
          dismissible: true,
          appearance: 'sp-modal',
        }
      )
      .subscribe();
    const updatedCourses = this.state.courses.map((c) => {
      if (c.slug === selectedCourse.slug) {
        return {
          ...c,
          hasPendingFeedback: true,
        };
      }
      return c;
    });
    this.setCourses(updatedCourses);
    this.setCurrentCourse(selectedCourse.slug);
  }
}
