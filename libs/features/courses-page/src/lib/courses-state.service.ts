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
}
