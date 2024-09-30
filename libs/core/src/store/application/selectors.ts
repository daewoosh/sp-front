import { createSelector } from '@ngrx/store';
import { ApplicationState } from "./reducer";

// export const selectCommonFeature = createFeatureSelector<ApplicationState>(APPLICATION_STORE_FEATURE_KEY);
//
export const selectCommonFeature = (state: any) => state.application;

export const selectShowLoader = createSelector(
  selectCommonFeature,
  (state: ApplicationState) => state?.showLoader
);
