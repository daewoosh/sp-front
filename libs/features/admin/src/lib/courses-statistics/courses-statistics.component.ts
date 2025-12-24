import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../admin.api.service';
import { CourseStatisticsDto } from '../models';

@Component({
  selector: 'sp-courses-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses-statistics.component.html',
  styleUrl: './courses-statistics.component.scss',
})
export class CoursesStatisticsComponent implements OnInit {
  isLoading = true;
  stats: CourseStatisticsDto[] = [];
  error: string | null = null;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getCoursesStatistics().subscribe({
      next: (data) => {
        // Можно отсортировать по названию для стабильности
        this.stats = [...data].sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Не удалось загрузить статистику';
        this.isLoading = false;
      },
    });
  }

  trackByCourse = (_: number, item: CourseStatisticsDto) => item.courseId;
}

