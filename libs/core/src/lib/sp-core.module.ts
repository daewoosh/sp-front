import { NgModule, Optional, SkipSelf } from "@angular/core";
import { LocalStorageService, NavigationService } from "./providers";

@NgModule({
  declarations: [],
  // imports: [StoreModule.forRoot({ appState: appStateReducer }, {})],
  providers: [
    LocalStorageService,
    NavigationService
  ]
})
export class SpCoreModule {
  constructor(@Optional() @SkipSelf() parentModule: SpCoreModule) {
    if (parentModule) {
      throw new Error('KlnCoreModule is already loaded');
    }
  }
}
