import { createReducer, on } from "@ngrx/store";
import { AppUser, UserRole } from "@forty-thirty/core/models";

export const AUTH_STORE_FEATURE_KEY = 'auth-store';

export interface AuthState {
  currentRole?: UserRole;
  user: AppUser | null;
  isLoggedIn:boolean;
}

export const initialAppState: AuthState = {
  user: null,
  isLoggedIn: false
}

export const authReducer = createReducer(
  initialAppState,

)
