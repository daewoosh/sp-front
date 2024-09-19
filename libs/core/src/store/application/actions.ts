import { createAction, props } from "@ngrx/store";

export const setShowLoader = createAction(
  '[COMMON] Set Show Loader',
  props<{ showLoader: boolean }>()
);


