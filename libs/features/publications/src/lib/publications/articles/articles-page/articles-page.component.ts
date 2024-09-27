import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { CommonModule } from "@angular/common";
import { PublicationsApiService } from "@sp/core/providers";
import { PublicationType, TagDto } from "@sp/core/models";
import { Observable } from "rxjs";
import { ArticlesListComponent } from "../articles-list/articles-list.component";

@Component({
  selector: 'sp-articles-page',
  templateUrl: './articles-page.component.html',
  styleUrls: ['./articles-page.component.scss'],
  standalone: true,
  imports: [CommonModule, ArticlesListComponent]
})
export class ArticlesPageComponent {

  tags$:Observable<TagDto[]>
  constructor(private publicationsApi:PublicationsApiService,
              private router:Router
              ) {
    this.tags$ = this.publicationsApi.getTags(PublicationType.Article);
  }
}
