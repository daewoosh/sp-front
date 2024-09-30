import {Component, Input, OnInit} from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { PublicationDto } from "@sp/core/models";
import {
  PublicationsReadMoreComponent
} from "../../../common components/publications-read-more/publications-read-more.component";
import {
  PublicationHtmlDisplayComponent
} from "../../../common components/publication-html-display/publication-html-display.component";

@Component({
  selector: 'sp-article-full-content',
  templateUrl: './article-full-content.component.html',
  styleUrls: ['./article-full-content.component.scss'],
  standalone: true,
  imports: [CommonModule, PublicationsReadMoreComponent, PublicationHtmlDisplayComponent]
})
export class ArticleFullContentComponent implements OnInit {

  @Input() publication!: PublicationDto;

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.publication.htmlTitle!);

    this.metaService.updateTag({name: 'description', content: this.publication.htmlDescription!});
    this.metaService.updateTag({name: 'og:description', content: this.publication.htmlDescription!});
    this.metaService.updateTag({name: 'og:title', content: this.publication.htmlTitle!});
    this.metaService.updateTag({name: 'og:image', content: this.publication.coverImageUrl!});
    this.metaService.updateTag({name: 'og:type', content: 'website'});
    this.metaService.updateTag({name: 'og:url', content: 'https://safe-poker.io'});
  }

}
