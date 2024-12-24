import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PageEvent } from '@angular/material/paginator';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { EndPoint, HttpVerb } from '@shared/enums';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { ApiService } from '@shared/services/api.service';

@Component({
  selector: 'app-adaptive-table',
  standalone: true,
  imports: [MtxGridModule, MatFormFieldModule],
  templateUrl: './adaptive-table.component.html',
  styleUrl: './adaptive-table.component.scss',
})
export class AdaptiveTableComponent implements OnChanges {
  @Input() apiUrl!: EndPoint;
  @Input() filters: any = {};
  @Input() columns: MtxGridColumn[] = [];
  @Input() isLoading: boolean = false;
  @Input() pageSizeOptions: number[] = [5, 10, 50, 100];
  @Input() additionalParams: any = {};
  @Input() httpMethod: HttpVerb = HttpVerb.GET;
  destroyRef = inject(DestroyRef);

  @Output() actionTriggered: EventEmitter<{ action: string; rowData: any }> = new EventEmitter<{
    action: string;
    rowData: any;
  }>();

  pageIndex = 0;
  pageSize = 5;
  totalRecords = 0;
  data: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filters || changes.apiUrl || changes.additionalParams) {
      this.resetPagination();
      this.fetchData();
    }
  }

  resetPagination(): void {
    this.pageIndex = 0;
    this.pageSize = 5;
    this.totalRecords = 0;
  }

  buildRequestParams() {
    const requestParams: any = {
      sortColumn: '',
      sortColumnDirection: '',
      pageSize: this.pageSize,
      startIndex: this.pageIndex * this.pageSize,
      ...this.additionalParams,
      ...this.filters,
    };

    return requestParams;
  }

  fetchData(): void {
    this.isLoading = true;
    this.apiService
      .triggerApiRequest(this.apiUrl, this.httpMethod, this.buildRequestParams())
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.data = response.data;
          this.totalRecords = response.recordsTotal;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchData();
  }
}
