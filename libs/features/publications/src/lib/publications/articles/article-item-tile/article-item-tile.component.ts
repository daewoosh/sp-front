import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from "@angular/common";
import { PublicationShortDto } from "@sp/core/models";
import { RouterLink } from "@angular/router";
import { TuiLineClamp } from "@taiga-ui/kit";

@Component({
  selector: 'sp-article-item-tile',
  templateUrl: './article-item-tile.component.html',
  styleUrls: ['./article-item-tile.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, TuiLineClamp]
})
export class ArticleItemTileComponent {

  @Input() article!: PublicationShortDto;
  @Input() isAdmin = false;

}
