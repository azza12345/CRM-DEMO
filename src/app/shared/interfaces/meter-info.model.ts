export interface BaseMeterInfo {
  meterType: string;
  meterMake: string;
  meterImage: string;
  items: MeterItem[];
}
export interface InstalledMeterInfo extends BaseMeterInfo {
  installationType: string;
  installationDate: string;
  meterModel: string;
  location: string;
}
export interface OldMeterInfo extends BaseMeterInfo {
  meterSerial: string;
  finalReading: number;
  replacementReason: string;
  manufactureYear: number;
  finalBalance: number;
  meterDisplay: string;
}
export interface MeterItem {
  name: string;
  quantity: number;
}
