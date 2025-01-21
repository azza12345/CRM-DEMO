import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-dynamic-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-chart.component.html',
  styleUrl: './dynamic-chart.component.scss',
})
export class DynamicChartComponent implements AfterViewInit, OnDestroy {
  @Input() chartId!: string;
  @Input() chartOptions!: any;

  private chart!: any;

  ngAfterViewInit(): void {
    if (this.chartOptions && this.chartId) {
      // Validate that chartOptions contains required properties
      if (!this.chartOptions.chart || !this.chartOptions.chart.type) {
        console.error('Invalid chart options: Missing "chart.type"');
        return;
      }

      this.chart = new ApexCharts(document.querySelector(`#${this.chartId}`), this.chartOptions);

      try {
        this.chart?.render();
        // Code that might throw an error
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('An error occurred:', error.message);
        } else {
          console.error('An unknown error occurred:', error);
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
