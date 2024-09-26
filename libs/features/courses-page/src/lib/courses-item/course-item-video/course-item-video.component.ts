import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { CourseElement, CourseProgramItem, VideoCourseElement } from "@sp/core/models";
import { VgControlsModule } from "@videogular/ngx-videogular/controls";
import { BitrateOptions, IMediaElement, VgApiService, VgCoreModule } from "@videogular/ngx-videogular/core";
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play";
import { HttpClient } from "@angular/common/http";
import { filter, map, Subject, switchMap, take, takeUntil, tap, throttleTime } from "rxjs";
import { VgStreamingModule } from "@videogular/ngx-videogular/streaming";
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering";
import { RouterLink } from "@angular/router";
import { API_PATH } from "@sp/config";
import { CoursesApiService } from "../../courses-api.service";
import { CoursesStateService } from "../../courses-state.service";
import {
  TuiDataList,
  TuiDataListComponent,
  TuiDataListDirective,
  TuiDropdownDirective,
  TuiDropdownOpen,
  TuiOptGroup
} from "@taiga-ui/core";
import { TuiComboBoxModule, TuiSelectModule } from '@taiga-ui/legacy';
import { TuiActiveZone } from "@taiga-ui/cdk";



@Component({
  selector: 'sp-course-item-video',
  standalone: true,
  imports: [CommonModule, VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule, RouterLink, TuiDropdownDirective, TuiDropdownOpen, TuiDataListComponent, TuiOptGroup, TuiDataList,
    TuiComboBoxModule, TuiDataListDirective, TuiSelectModule, TuiActiveZone],
  templateUrl: './course-item-video.component.html',
  styleUrl: './course-item-video.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseItemVideoComponent implements OnDestroy{
  @Input() courseElement!: VideoCourseElement;
  @Input() courseProgram!: CourseProgramItem[];

  bitrates: BitrateOptions[] = [];
  selectedBitrate: BitrateOptions | null = null;
  canShowPlayer = false;

  selectedSpeed: { label: string; value: number } = { label: '1x', value: 1 };

  speeds: { label: string; value: number }[] = [
    { label: '0.5x', value: 0.5 },
    { label: '1x', value: 1 },
    { label: '1.5x', value: 1.5 },
    { label: '2x', value: 2 },
  ];


  api?: VgApiService;

  destroy$ = new Subject<void>();

  constructor(@Inject(PLATFORM_ID) private platformId: string,
              @Inject(API_PATH) private apiPath: string,
              private cdr: ChangeDetectorRef,
              private coursesApiService: CoursesApiService,
              private coursesStateService: CoursesStateService) {
    if (isPlatformBrowser(platformId)) {
      this.canShowPlayer = true;
    }

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getBitrates($event: BitrateOptions[]) {
    this.bitrates = $event;
    this.selectedBitrate = $event[0];
  }


  aaaa(myMedia: HTMLVideoElement): IMediaElement {
    return myMedia as unknown as IMediaElement;
  }

  getVideoUrl(): string {
    return `${API_URL}/Video/${this.courseElement.courseSlug}/${this.courseElement.order}/master.m3u8`;
  }

  onPlayerReady($event: VgApiService) {
    this.api = $event;

    this.api!.getDefaultMedia().subscriptions.canPlay
      .pipe(take(1))
      .subscribe(
        canPlay => {
          this.api!.getDefaultMedia().currentTime = this.courseElement.lastPosition??0;
        }
      )

    this.api!.getDefaultMedia().subscriptions.seeking
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      seeking => {
        // if (seeking.target.currentTime> this.courseElement.maxPosition){
        //   this.api!.getDefaultMedia().currentTime = this.courseElement.maxPosition;
        // }
        return false;
      }
    );

    this.api!.getDefaultMedia().subscriptions.timeUpdate
      .pipe(
        takeUntil(this.destroy$),
        map((event)=> Math.ceil(event.target.currentTime)),
        filter((currentTime) => currentTime  > 4),
        throttleTime(5000),
        switchMap((currentTime) => this.coursesApiService.updateVideoProgress(this.courseElement.id, this.courseElement.videoId, currentTime))
      )
      .subscribe(
        (videoContent) => {
          this.courseElement.maxPosition = videoContent.maxPosition;
          this.courseElement.lastPosition = videoContent.lastPosition;
          this.coursesStateService.updateVideoProgress(this.courseElement.order, videoContent.lastPosition, videoContent.duration);
        }
      );

    this.api!.getDefaultMedia().subscriptions.ended
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.coursesApiService.completeVideo(this.courseElement.id, this.courseElement.videoId))
      )
      .subscribe(
      _=> {
        this.courseElement.isCompleted = true;
        this.coursesStateService.completeItem(this.courseElement.order);}
    )
  }

  get showPrevBtn(){
    return this.courseElement.order > 1;
  }

  get showNextBtn(){
    return this.courseElement.order < this.courseProgram.length;
  }
  get canGoNext(){
    return this.courseElement.isCompleted;
  }

  showQuality = false;
  showSpeed = false;

  onSpeedActiveZone(active: boolean) {
    if (active && this.showSpeed){
      this.showSpeed = false;
      return;
    }
    this.showSpeed = active;
  }

  onQualityActiveZone(active: boolean) {
    if (active && this.showQuality){
      this.showQuality = false;
      return;
    }
    this.showQuality = active;
  }
}
