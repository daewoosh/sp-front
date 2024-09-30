import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map, Observable, share, take } from "rxjs";
import { CommonModule } from "@angular/common";
import { PublicationDto } from "@sp/core/models";
import { ArticleFullContentComponent } from "./article-full-content/article-full-content.component";

@Component({
  selector: 'sp-article-item-full-page',
  templateUrl: './article-item-full-page.component.html',
  styleUrls: ['./article-item-full-page.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, ArticleFullContentComponent]
})
export class ArticleItemFullPageComponent {
  isAdmin = false;
  public publication$: Observable<PublicationDto>;

  constructor(private activatedRoute: ActivatedRoute) {
    this.publication$ =
      this.activatedRoute.data.pipe(
        take(1),
        map(({publication = {}}) => publication as PublicationDto),
        share()
      );
  }
}
