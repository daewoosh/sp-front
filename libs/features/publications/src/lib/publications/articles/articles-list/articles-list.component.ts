import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { CommonModule } from "@angular/common";
import { PublicationShortDto, PublicationType, TagDto } from "@sp/core/models";
import { PublicationsApiService } from "@sp/core/providers";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { ArticleItemTileComponent } from "../article-item-tile/article-item-tile.component";

@Component({
  selector: 'sp-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss'],
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective, ArticleItemTileComponent]
})
export class ArticlesListComponent implements OnInit {

  @Input() tags: TagDto[] = [];
  selectedTag!: TagDto;
  @Input() isAdmin = false;
  articles: PublicationShortDto[] = [];
  pageSize = 20;
  pageNumber = 0;
  totalItemsCount = Number.MAX_SAFE_INTEGER;

  isTagListExpanded = false;

  constructor(private publicationsApi: PublicationsApiService,
              private cdr: ChangeDetectorRef,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    if (this.isAdmin) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          isAdmin: true,
        },
        queryParamsHandling: 'merge',
      });
    }

    this.tags!.unshift({value: "Последние статьи", id: null, publicationType: PublicationType.Article});
    this.selectedTag = this.tags![0];

    const method = this.isAdmin ? this.publicationsApi.getPublications(PublicationType.Article, null, this.pageSize, this.pageNumber)
      : this.publicationsApi.getActivePublications(PublicationType.Article, null, this.pageSize, this.pageNumber)

    method.subscribe(
      res => {
        this.articles = res.result;
        this.totalItemsCount = res.totalCount;
        this.pageNumber++;
        this.cdr.markForCheck();
      }
    )
  }

  select(tag: TagDto) {
    if (tag.id == this.selectedTag.id) {
      return;
    }
    this.selectedTag = tag;
    this.pageNumber = 0;
    this.totalItemsCount = Number.MAX_SAFE_INTEGER;
    this.articles = [];
    this.loadMore();
  }

  loadMore() {
    if (this.canLoadMore()) {
      const method = this.isAdmin ? this.publicationsApi.getPublications(PublicationType.Article, this.selectedTag.id, this.pageSize, this.pageNumber)
        : this.publicationsApi.getActivePublications(PublicationType.Article, this.selectedTag.id, this.pageSize, this.pageNumber)
      method.subscribe(
        res => {
          this.articles = this.articles.concat(res.result);
          this.pageNumber++;
          this.totalItemsCount = res.totalCount;
          this.cdr.markForCheck();
        }
      )
    }

  }

  canLoadMore(): boolean {
    return this.totalItemsCount > this.articles.length;
  }

}
