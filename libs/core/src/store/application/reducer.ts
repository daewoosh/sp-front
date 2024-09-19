import { createReducer, on } from "@ngrx/store";
import { setShowLoader } from "./actions";

export const APPLICATION_STORE_FEATURE_KEY = 'application-store';

export interface ApplicationState {
  showLoader: boolean;
}

export const initialAppState: ApplicationState = {
  showLoader: false,
}

export const applicationReducer = createReducer(
  initialAppState,

  on(setShowLoader, (state, {showLoader}) => ({
    ...state,
    showLoader,
  })),
)
