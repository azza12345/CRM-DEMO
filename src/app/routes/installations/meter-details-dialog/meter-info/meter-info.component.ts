import { Component, Input } from '@angular/core';

export interface MeterDetail {
  label: string;
  value: string | number | null;
}
@Component({
  selector: 'app-meter-info',
  standalone: true,
  imports: [],
  templateUrl: './meter-info.component.html',
  styleUrl: './meter-info.component.scss',
})
export class MeterInfoComponent {
  @Input() details: MeterDetail[] = [];
}
