import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from "@angular/common";
import { TuiLineClamp } from "@taiga-ui/kit";
import { PublicationShortDto, PublicationType } from "@sp/core/models";

@Component({
  selector: 'sp-read-more-item',
  templateUrl: './read-more-item.component.html',
  styleUrls: ['./read-more-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TuiLineClamp]
})
export class ReadMoreItemComponent {

  @Input() publication!: PublicationShortDto;
  @Input() publicationType!: PublicationType;


  get link(): string {
    const link = this.publicationType === PublicationType.Article ? '/articles/' : '/news/';
    return link + this.publication?.name;
  }

}
