import { createAction, props } from "@ngrx/store";
import { LoginResult, UserRole } from "../../models";

export const login = createAction(
  '[AUTH] Login',
  props<{ email: string, password: string }>()
);

export const loginSuccess = createAction(
  '[AUTH] Login Success',
  props<{ loginResult: LoginResult }>()
)


