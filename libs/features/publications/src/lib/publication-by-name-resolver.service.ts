import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, ActivationStart, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { catchError, EMPTY, filter, Observable, takeUntil, tap } from "rxjs";
import { Meta, Title } from "@angular/platform-browser";
import { PublicationsApiService } from "@sp/core/providers";
import { PublicationType } from "@sp/core/models";

@Injectable({providedIn: 'root'})
export class PublicationByNameResolver implements Resolve<boolean> {

  constructor(
    private readonly publicationsApi: PublicationsApiService,
    private readonly router: Router,
    private titleService: Title, private metaService: Meta
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const name = route.paramMap.get('name');
    const loadAdditionalRelatedArticles = route.data['loadAdditionalRelatedArticles'];
    // Complete the entity stream upon navigating away
    const navigateAway$ = this.router.events.pipe(
      filter((event) => event instanceof ActivationStart)
    );

    let publicationType = PublicationType.None;
    if (route.url[0].path.includes('news') || (route.parent?.url[0]?.path?.includes('news') ?? false)) {
      publicationType = PublicationType.News;
    }
    if (route.url[0].path.includes('articles') || (route.parent?.url[0]?.path?.includes('articles') ?? false)) {
      publicationType = PublicationType.Article;
    }

    return this.publicationsApi.getPublicationByName(name || '', publicationType, loadAdditionalRelatedArticles).pipe(
      takeUntil(navigateAway$),
      tap(publication => {
        this.titleService.setTitle(publication.htmlTitle!);

        this.metaService.updateTag({name: 'description', content: publication.htmlDescription!});
        this.metaService.updateTag({name: 'og:description', content: publication.htmlDescription!});
        this.metaService.updateTag({name: 'og:title', content: publication.htmlTitle!});
        this.metaService.updateTag({name: 'og:image', content: publication.coverImageUrl!});
        this.metaService.updateTag({name: 'og:type', content: 'website'});
        this.metaService.updateTag({name: 'og:url', content: 'https://devpokerpay.site'});
      }),
      catchError((error) => {
        console.log({error})
        this.router.navigate(['/404']);
        return EMPTY;
      })
    );
  }
}
