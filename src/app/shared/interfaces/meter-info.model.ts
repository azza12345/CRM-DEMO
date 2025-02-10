export interface BaseMeter {
  id: number;
  transactionId: number;
  type: any;
  meterSerial: string;
  lastReading: any;
  lastPurchase: any;
  image: string;
  meterYearOfManufacture: any;
  installationDate: string;
  location: string;
  meterMakeId: number;
  meterModelId: any;
  meterTypeId: number;
  meterType: string;
  replacement_reason: string;
  meterMake: string;
  meterModel: string;
  meterDisplay: string;
  materialDetailsOutPutModels: MeterItem[];
}

export interface MeterItem {
  materialType: string;
  materialQuantity: string;
}
