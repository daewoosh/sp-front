import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map, Observable, share, take, tap } from "rxjs";
import { CommonModule } from "@angular/common";
import { PublicationDto } from "@sp/core/models";

@Component({
  selector: 'sp-article-item-full-page',
  templateUrl: './article-item-full-page.component.html',
  styleUrls: ['./article-item-full-page.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class ArticleItemFullPageComponent {
  isAdmin = false;
  public publication$: Observable<PublicationDto> =
    this.activatedRoute.data.pipe(
      take(1),
      map(({publication = {}}) => publication as PublicationDto),
      share()
    );

  constructor(private activatedRoute: ActivatedRoute) {
  }
}
