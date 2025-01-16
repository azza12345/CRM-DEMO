import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PageEvent } from '@angular/material/paginator';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { EndPoint, HttpVerb } from '@shared/enums';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, BehaviorSubject, Observable, switchMap, catchError } from 'rxjs';
import { ApiService } from '@shared/services/api.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-adaptive-table',
  standalone: true,
  imports: [MtxGridModule, MatFormFieldModule, AsyncPipe],
  templateUrl: './adaptive-table.component.html',
  styleUrl: './adaptive-table.component.scss',
})
export class AdaptiveTableComponent implements OnInit, OnChanges {
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
  data$!: Observable<any[]>;
  private fetchSubject = new BehaviorSubject<void>(undefined);

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.data$ = this.fetchSubject.pipe(switchMap(() => this.fetchData()));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filters || changes.apiUrl || changes.additionalParams) {
      this.resetPagination();
      this.fetchSubject.next();
    }
  }

  resetPagination(): void {
    this.pageIndex = 0;
    this.pageSize = 5;
    this.totalRecords = 0;
  }

  buildRequestParams() {
    return {
      limit: this.pageSize,
      skip: this.pageIndex * this.pageSize,
      ...this.additionalParams,
      ...this.filters,
    };
  }

  fetchData(): Observable<any[]> {
    this.isLoading = true;
    return this.apiService
      .triggerApiRequest(this.apiUrl, this.httpMethod, this.buildRequestParams())
      .pipe(
        debounceTime(300),
        takeUntilDestroyed(this.destroyRef),
        switchMap((response: any) => {
          this.totalRecords = response.total;
          this.isLoading = false;
          return [response];
        }),
        catchError(error => {
          this.isLoading = false;
          return [];
        })
      );
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchSubject.next();
  }
}
