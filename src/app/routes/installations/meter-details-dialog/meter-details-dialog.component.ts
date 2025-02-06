import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { InstalledMeterInfo, MeterItem, OldMeterInfo } from '@shared/interfaces/meter-info.model';
import { MeterInfoComponent } from './meter-info/meter-info.component';
import { SparePartsTableComponent } from './spare-parts-table/spare-parts-table.component';

interface MeterDetail {
  label: string;
  value: string | number | null;
}

@Component({
  selector: 'app-meter-details-dialog',
  standalone: true,
  imports: [MatTabsModule, MeterInfoComponent, SparePartsTableComponent],
  templateUrl: './meter-details-dialog.component.html',
  styleUrl: './meter-details-dialog.component.scss',
})
export class MeterDetailsDialogComponent implements OnInit {
  oldMeterDetails: MeterDetail[] = [];
  newMeterDetails: MeterDetail[] = [];
  oldMeterSpareParts: MeterItem[] = [];
  newMeterSpareParts: MeterItem[] = [];

  constructor(
    public dialogRef: MatDialogRef<MeterDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      showTabs: boolean;
      oldMeter: OldMeterInfo | null;
      newMeter: InstalledMeterInfo;
    }
  ) {}

  ngOnInit(): void {
    this.prepareMeterDetails();
  }

  private prepareMeterDetails(): void {
    if (this.data.oldMeter) {
      this.oldMeterDetails = [
        { label: 'Meter Serial', value: this.data.oldMeter.meterSerial },
        { label: 'Final Reading', value: this.data.oldMeter.finalReading },
        { label: 'Replacement Reason', value: this.data.oldMeter.replacementReason },
        { label: 'Manufacture Year', value: this.data.oldMeter.manufactureYear },
        { label: 'Final Balance', value: this.data.oldMeter.finalBalance },
        { label: 'Meter Display', value: this.data.oldMeter.meterDisplay },
      ];
      this.oldMeterSpareParts = this.data.oldMeter.items || [];
    }

    this.newMeterDetails = [
      { label: 'Installation Type', value: this.data.newMeter.installationType },
      { label: 'Installation Date', value: this.data.newMeter.installationDate },
      { label: 'Meter Model', value: this.data.newMeter.meterModel },
      { label: 'Location', value: this.data.newMeter.location },
      { label: 'Meter Make', value: this.data.newMeter.meterMake },
    ];
    this.newMeterSpareParts = this.data.newMeter.items || [];
  }
}
