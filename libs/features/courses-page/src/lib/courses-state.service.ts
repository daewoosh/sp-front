import { Injectable } from "@angular/core";
import { StateService } from "@sp/core/state";
import { Course, CourseProgramItem } from "@sp/core/models";

export interface CoursesState {
  courses: Course[];
  courseProgram: CourseProgramItem[];
}

const initialState: CoursesState = {
  courses: [],
  courseProgram: []
}

@Injectable({providedIn: 'root'})
export class CoursesStateService extends StateService<CoursesState> {

  public selectCourses = this.select(({courses}: CoursesState) => courses);
  public selectCourseProgram = this.select(({courseProgram}: CoursesState) => courseProgram);

  constructor() {
    super(initialState);
  }

  public setCourses(courses: Course[]): void {
    this.setState({courses});
  }

  public setCourseProgram(courseProgram: CourseProgramItem[]): void {
    this.setState({courseProgram});
  }

  updateVideoProgress(order: number, lastPosition: number, duration: number): void {
    const currentProgram = [...this.state.courseProgram];
    for (const item of currentProgram) {
      if (item.order === order) {
        const newProgress = Math.ceil(lastPosition / duration * 100);
        const itemProgress = item.progress || 0;
        if (newProgress > itemProgress && newProgress <= 100) {
          item.progress = newProgress;
        }
      }
    }
    this.setState({courseProgram: currentProgram});
  }

  completeItem(order: number) {
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
      this.setState({courseProgram: currentProgram});
    }
  }
}
