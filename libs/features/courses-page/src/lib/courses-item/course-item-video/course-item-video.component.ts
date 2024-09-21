import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { VideoCourseElement } from "@sp/core/models";
import { VgControlsModule } from "@videogular/ngx-videogular/controls";
import { BitrateOptions, IMediaElement, VgApiService, VgCoreModule } from "@videogular/ngx-videogular/core";
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play";
import { HttpClient } from "@angular/common/http";
import { take, throttleTime } from "rxjs";
import { VgStreamingModule } from "@videogular/ngx-videogular/streaming";
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'sp-course-item-video',
  standalone: true,
  imports: [CommonModule, VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule, RouterLink],
  templateUrl: './course-item-video.component.html',
  styleUrl: './course-item-video.component.css'
})
export class CourseItemVideoComponent {
  @Input() courseElement!: VideoCourseElement;

  bitrates: BitrateOptions[] = [];
  canShowPlayer = false;

  api?: VgApiService;

  constructor(@Inject(PLATFORM_ID) private platformId: string,
              private httpClient: HttpClient) {
    if (isPlatformBrowser(platformId)) {
      this.canShowPlayer = true;
    }

  }

  getBitrates($event: BitrateOptions[]) {
    console.log($event);
    this.bitrates = $event;
  }


  aaaa(myMedia: HTMLVideoElement): IMediaElement {
    return myMedia as unknown as IMediaElement;
  }

  getVideoUrl(): string {
    // return 'assets/filename.m3u8';
    // return  'https://localhost:43802/filename.m3u8'
    // return 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    return 'https://localhost:43802/Video/2.m3u8';
    // return this.httpClient.get('https://localhost:43802/Video/1',{observe:'body'})
    //   .pipe(take(1));
  }

  onPlayerReady($event: VgApiService) {
    this.api = $event;
    console.log(this.api?.isCompleted);
    // this.api!.getDefaultMedia().subscriptions.progress.subscribe(
    //   (res) => {
    //     console.log(res);
    //     // Set the video to the beginning
    //     // this.api.getDefaultMedia().currentTime = 0;
    //   }
    // );

    this.api!.getDefaultMedia().subscriptions.canPlay
      .pipe(take(1))
      .subscribe(
        canPlay => {
          console.log(canPlay);
          this.api!.getDefaultMedia().currentTime = 24;
        }
      )

    this.api!.getDefaultMedia().subscriptions.seeking.subscribe(
      seeking => {
        console.log(seeking);
        return false;
      }
    );

    this.api!.getDefaultMedia().subscriptions.seeked.subscribe(
      seeked => {
        console.log(seeked);
      }
    );

    this.api!.getDefaultMedia().subscriptions.timeUpdate

      .pipe(throttleTime(1000))
      .subscribe(
        (res2) => {
          console.log(res2);
          console.log(res2.target.currentTime);
          console.log(res2.timeStamp);
          // Set the video to the beginning
          // this.api.getDefaultMedia().currentTime = 0;
        }
      );
  }
}
