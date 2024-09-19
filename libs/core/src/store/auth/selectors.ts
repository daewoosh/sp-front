import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUTH_STORE_FEATURE_KEY, AuthState } from './reducer';

// export const selectAuthFeature = createFeatureSelector<AuthState>(AUTH_STORE_FEATURE_KEY);
//
export const selectAuthFeature = (state: any) => state.auth;

export const selectAuthState = createSelector(
  selectAuthFeature,
  (state: AuthState) => state
);

export const selectCurrentRole = createSelector(
  selectAuthFeature,
  (state: AuthState) => state?.currentRole
);

export const selectUser = createSelector(
  selectAuthFeature,
  (state: AuthState) => state?.user
);

