import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-dynamic-chart',
  standalone: true,
  imports: [],
  templateUrl: './dynamic-chart.component.html',
  styleUrl: './dynamic-chart.component.scss',
})
export class DynamicChartComponent implements AfterViewInit, OnDestroy {
  @Input() chartId!: string;
  @Input() chartOptions!: any;

  private chart!: any;

  ngAfterViewInit(): void {
    if (this.chartOptions && this.chartId) {
      this.chart = new ApexCharts(document.querySelector(`#${this.chartId}`), this.chartOptions);
      this.chart?.render();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
