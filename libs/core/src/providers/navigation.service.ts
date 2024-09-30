import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { Observable, of } from "rxjs";

export function notEmptyObject(obj: any) {
  return obj && obj !== null && Object.keys(obj).length > 0;
}

// не спрашивайте меня, как так вышло
// я просто сделал это потому что нужен был сервис доступный в коммоне, а реализация была не в коммоне
// этот сервис переопределяется в модуле курсов.
@Injectable()
export class CourseActivationService{

  activateCourse(token:string):Observable<{wasAdded:boolean}>{
    // do nothing by default
    return of({wasAdded:false});
  }
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
