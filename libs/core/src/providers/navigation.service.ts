import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";

export function notEmptyObject(obj: any) {
  return obj && obj !== null && Object.keys(obj).length > 0;
}

@Injectable({providedIn:'root'})
export class NavigationService {

  constructor(private localStorageService: LocalStorageService) {
  }

  getUrlWithUtm(path: string) {
    const utm = this.localStorageService.get("utm");
    if (notEmptyObject(utm)) {
      const params = new URLSearchParams();
      for (const key in utm) {
        params.set(key, utm[key])
      }
      path = path + '?' + params.toString();
    }
    return path;
  }

}
