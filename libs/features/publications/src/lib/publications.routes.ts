import { Route } from "@angular/router";
import { PublicationByNameResolver } from "./publication-by-name-resolver.service";

export const publicationsRoutes: Route[] = [
  {
    path:':name',
    loadComponent: () => import('./publications/articles/article-item-full-page/article-item-full-page.component').then(mod => mod.ArticleItemFullPageComponent),
    resolve: {publication: PublicationByNameResolver},
    data: {loadAdditionalRelatedArticles: true}
  },
  {
    path:'',
    loadComponent: () => import('./publications/articles/articles-page/articles-page.component').then(mod => mod.ArticlesPageComponent),
    pathMatch: 'full'
  }
]
