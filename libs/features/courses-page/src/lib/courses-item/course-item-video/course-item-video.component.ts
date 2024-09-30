import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef, HostListener,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges, ViewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { CourseElementType, CourseProgramItem, VideoCourseElement } from "@sp/core/models";
import { VgControlsModule } from "@videogular/ngx-videogular/controls";
import { BitrateOptions, IMediaElement, VgApiService, VgCoreModule } from "@videogular/ngx-videogular/core";
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play";
import { BehaviorSubject, filter, map, Subject, switchMap, take, takeUntil, throttleTime } from "rxjs";
import { VgStreamingModule } from "@videogular/ngx-videogular/streaming";
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering";
import { RouterLink } from "@angular/router";
import { API_PATH } from "@sp/config";
import { CoursesApiService } from "@sp/core/providers/courses-api.service";
import { CoursesStateService } from "@sp/core/providers/courses-state.service";
import {
  TuiDataList,
  TuiDataListComponent,
  TuiDataListDirective,
  TuiDropdownDirective,
  TuiDropdownOpen, TuiLoader,
  TuiOptGroup
} from "@taiga-ui/core";
import { TuiComboBoxModule, TuiSelectModule } from '@taiga-ui/legacy';
import { TuiActiveZone } from "@taiga-ui/cdk";
import { NgDompurifyPipe } from "@taiga-ui/dompurify";


@Component({
  selector: 'sp-course-item-video',
  standalone: true,
  imports: [CommonModule, VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule, RouterLink, TuiDropdownDirective, TuiDropdownOpen, TuiDataListComponent, TuiOptGroup, TuiDataList,
    TuiComboBoxModule, TuiDataListDirective, TuiSelectModule, TuiActiveZone, NgDompurifyPipe, TuiLoader],
  templateUrl: './course-item-video.component.html',
  styleUrl: './course-item-video.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseItemVideoComponent implements OnDestroy {
  @ViewChild('myMedia', { static: false }) myMedia!: ElementRef<HTMLVideoElement>;

  @Input() courseElement!: VideoCourseElement;
  @Input() courseProgram!: CourseProgramItem[];

  bitrates: BitrateOptions[] = [];
  selectedBitrate: BitrateOptions | null = null;
  canShowPlayer = false;

  selectedSpeed: { label: string; value: number } = {label: '1x', value: 1};
  videoLoading$ = new BehaviorSubject(false)
  speeds: { label: string; value: number }[] = [
    {label: '0.5x', value: 0.5},
    {label: '1x', value: 1},
    {label: '1.5x', value: 1.5},
    {label: '2x', value: 2},
  ];


  api?: VgApiService;

  destroy$ = new Subject<void>();
  showQuality = false;
  showSpeed = false;

  constructor(@Inject(PLATFORM_ID) private platformId: string,
              @Inject(API_PATH) private apiPath: string,
              private cdr: ChangeDetectorRef,
              private coursesApiService: CoursesApiService,
              private coursesStateService: CoursesStateService) {
    if (isPlatformBrowser(platformId)) {
      this.canShowPlayer = true;
    }
  }

  get showPrevBtn() {
    return this.courseElement.order > 1;
  }

  get showNextBtn() {
    return this.courseElement.order < this.courseProgram.length;
  }

  get canGoNext() {
    return this.courseElement.isCompleted;
  }

  get nextButtonLabel() {
    //order идет с 1 поэтому используем order
    if (this.courseProgram[this.courseElement.order] && this.courseProgram[this.courseElement.order].type === CourseElementType.Video) {
      return 'Перейти к следующему уроку';
    }
    if (this.courseProgram[this.courseElement.order] && this.courseProgram[this.courseElement.order].type === CourseElementType.Assignment) {
      return 'Перейти к домашнему заданию';
    }
    return 'Далее';
  }

  get videoId(): string {
    return 'video-' + this.courseElement.id + '-' + this.courseElement.order;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseElement'] && !changes['courseElement'].firstChange) {
      // Если пришел новый courseElement
      this.canShowPlayer = false;
      // Через 50 мс устанавливаем обратно в true
      setTimeout(() => {
        this.canShowPlayer = true;
        this.cdr.detectChanges(); // Обновляем состояние компонента
      }, 50);
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
    console.log("onPlayerReady");
    this.api!.getMediaById(this.videoId).subscriptions.canPlay
      .pipe(take(1))
      .subscribe(
        canPlay => {
          this.api!.getMediaById(this.videoId).currentTime = this.courseElement.lastPosition ?? 0;
        }
      )

    this.api!.getMediaById(this.videoId).subscriptions.seeking
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        seeking => {
          // if (seeking.target.currentTime> this.courseElement.maxPosition){
          //   this.api!.getMediaById(this.videoId).currentTime = this.courseElement.maxPosition;
          // }
          this.videoLoading$.next(true);
          return false;
        }
      );

    this.api!.getMediaById(this.videoId).subscriptions.seeked
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        seeking => {
          this.videoLoading$.next(false);
          return false;
        }
      );

    this.api!.getMediaById(this.videoId).subscriptions.timeUpdate
      .pipe(
        takeUntil(this.destroy$),
        map((event) => Math.ceil(event.target.currentTime)),
        filter((currentTime) => currentTime > 4),
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

    this.api!.getMediaById(this.videoId).subscriptions.ended
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.coursesApiService.completeVideo(this.courseElement.id, this.courseElement.videoId))
      )
      .subscribe(
        _ => {
          this.courseElement.isCompleted = true;
          this.coursesStateService.completeItem(this.courseElement.order);
        }
      );
  }

  onSpeedActiveZone(active: boolean) {
    if (active && this.showSpeed) {
      this.showSpeed = false;
      return;
    }
    this.showSpeed = active;
  }

  onQualityActiveZone(active: boolean) {
    if (active && this.showQuality) {
      this.showQuality = false;
      return;
    }
    this.showQuality = active;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const video = this.api!.getMediaById(this.videoId);;

    switch (event.key) {
      case 'ArrowLeft':
        this.rewindVideo(5);
        break;
      case 'ArrowRight':
        this.fastForwardVideo(5);
        break;
      case ' ':
        event.stopPropagation();
        event.preventDefault();
        debugger;
        // video.pause();
        // Toggle play/pause
        if (video.state ==='paused') {
          video.play();
        } else {
          video.pause();
        }
        console.log('space');
        break;
      // Add more cases as needed
    }
  }

  rewindVideo(seconds: number) {
    const media= this.api!.getMediaById(this.videoId);
    media.currentTime = Math.max(0, media.currentTime - seconds);
  }

  fastForwardVideo(seconds: number) {
    const media= this.api!.getMediaById(this.videoId);
    this.api!.getMediaById(this.videoId).currentTime = Math.min(media.duration, media.currentTime + seconds);
  }

  toggleFullScreen() {
    console.log('toggleFullScreen');
    console.log(this.myMedia);
    const videoElement = this.myMedia.nativeElement;
    if (!document.fullscreenElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if ((videoElement as any).webkitRequestFullscreen) { /* Safari */
        (videoElement as any).webkitRequestFullscreen();
      } else if ((videoElement as any).msRequestFullscreen) { /* IE11 */
        (videoElement as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) { /* Safari */
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) { /* IE11 */
        (document as any).msExitFullscreen();
      }
    }
  }
}
