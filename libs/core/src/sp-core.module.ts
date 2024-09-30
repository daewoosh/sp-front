import { NgModule, Optional, SkipSelf } from "@angular/core";
import { LocalStorageService, NavigationService } from "./providers";

@NgModule({
  providers: [NavigationService,LocalStorageService]
})
export class SpCoreModule {
  constructor(@Optional() @SkipSelf() parentModule: SpCoreModule) {
    if (parentModule) {
      throw new Error('SpCoreModule is already loaded');
    }
  }
}
