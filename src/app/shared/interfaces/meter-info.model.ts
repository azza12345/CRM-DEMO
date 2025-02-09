export interface BaseMeter {
  id: number;
  status: number;
  transactionId: number;
  type: any;
  meterSerial: string;
  lastReading: any;
  lastPurchase: any;
  image: string;
  meterYearOfManufacture: any;
  materialType: string[];
  materialQuantity: string[];
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
}
export interface MeterItem {
  name: string;
  quantity: string;
}
