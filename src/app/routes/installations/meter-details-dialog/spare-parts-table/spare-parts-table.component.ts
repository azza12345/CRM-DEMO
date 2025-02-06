import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MeterItem } from '@shared/interfaces/meter-info.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-spare-parts-table',
  standalone: true,
  imports: [AsyncPipe, MatTableModule],
  templateUrl: './spare-parts-table.component.html',
  styleUrl: './spare-parts-table.component.scss',
})
export class SparePartsTableComponent {
  private _spareParts$: Observable<MeterItem[]> = of([]);

  @Input() title!: string;

  @Input() set spareParts(value: MeterItem[] | null) {
    this._spareParts$ = of(value || []);
  }

  get spareParts$(): Observable<MeterItem[]> {
    return this._spareParts$;
  }
}
