import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  Input,
  OnInit,
  SecurityContext,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { SafeHtml } from "@angular/platform-browser";
import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { AdvancedBannerComponent } from "./advanced-banner/advanced-banner.component";
import { BeginnerBannerComponent } from "./beginner-banner/beginner-banner.component";
import { BoosterBannerComponent } from "./booster-banner/booster-banner.component";
import { ExchangerBannerComponent } from "./exchanger-banner/exchanger-banner.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'sp-publication-html-display',
  templateUrl: './publication-html-display.component.html',
  styleUrls: ['./publication-html-display.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule]
})
export class PublicationHtmlDisplayComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('bannerTemplate', {read: ViewContainerRef}) container: any;
  @Input() htmlString!: string;
  valueToDisplay: SafeHtml = '';

  @Input() publicationDate!: Date;

  constructor(private domSanitizer: NgDompurifySanitizer,
              private resolver: ComponentFactoryResolver) {
  }

  ngAfterViewInit(): void {
    this.processContent('from init');
  }

  ngOnInit(): void {
    this.valueToDisplay = this.domSanitizer.sanitize(SecurityContext.HTML, this.htmlString, {
      ALLOWED_ATTR: ['href']
    });
  }

  ngAfterViewChecked() {
    this.processContent('from checker');
  }

  private processContent(from: string) {
    this.replaceBanner('&lt;%banner-beginner&gt;&lt;/%banner-beginner&gt;', BeginnerBannerComponent);
    this.replaceBanner('&lt;%banner-advanced&gt;&lt;/%banner-advanced&gt;', AdvancedBannerComponent);
    this.replaceBanner('&lt;%banner-booster&gt;&lt;/%banner-booster&gt;', BoosterBannerComponent);
    this.replaceBanner('&lt;%banner-exchanger&gt;&lt;/%banner-exchanger&gt;', ExchangerBannerComponent);

    const videoLinkRegex = /&lt;%video-link&gt;(.+?)&lt;%\/&gt;/g;

    let match;
    while ((match = videoLinkRegex.exec(this.htmlString)) !== null) {
      const videoLink = match[1];
      const videoTag = `<video controls> <source src="${videoLink}" type="video/mp4"></video>`;
      this.htmlString = this.htmlString.replace(match[0], videoTag);
    }

    this.valueToDisplay = this.domSanitizer.sanitize(SecurityContext.HTML, this.htmlString);
  }


  private replaceBanner(name: string, componentType: Type<any>) {
    this.container.clear();
    const isThere = this.htmlString.includes(name);
    if (isThere) {
      const factory: ComponentFactory<any> =
        this.resolver.resolveComponentFactory(componentType);
      const componentRef = this.container.createComponent(factory);

      // // Вручную вызываем ngOnInit у созданного компонента
      if (componentRef.instance.ngOnInit) {
        componentRef.instance.ngOnInit();
      }

      // Ждем завершения отрисовки компонента
      setTimeout(() => {
        const htmlString2 = componentRef.location.nativeElement.innerHTML;
        this.htmlString = this.htmlString.replace(name, htmlString2);
      });
    }

  }
}
