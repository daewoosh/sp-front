import {Injectable} from '@angular/core';
import {StateService} from "./state.service";
import {Observable} from "rxjs";
import {UserRole} from "../models";

interface UserState {
  isLoggedIn?: boolean;
  user?: User;
}

interface User {
  role: number;
  id: string;
  telegramId: number;
}

interface AppState {
  userState: UserState;
}

const initialState: AppState = {
  userState: {
    isLoggedIn: false,
  },
};

@Injectable({
  providedIn: 'root'
})
export class AppStateService extends StateService<AppState> {
  public cselectUser: Observable<User | undefined> = this.select(
    ({userState}: AppState) => userState.user
  );

  public role: Observable<UserRole | undefined> = this.select(
    ({userState}: AppState) => userState.user?.role
  );


  public userState: Observable<UserState> = this.select(
    (state: AppState) => state.userState
  );

  public isLoggedIn$: Observable<boolean> = this.select(
    (state: AppState) => state.userState?.isLoggedIn??false
  )

  constructor() {
    super(initialState);
  }

  public setUserState(userState: UserState): void {
    this.setState({userState});
  }


  getUserId(): string | undefined {
    return this.state.userState.user?.id;
  }
}

