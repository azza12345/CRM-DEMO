export interface RetiredMeterStatusDto {
  totalCount: number;
  receivedCount: number;
  notReceivedCount: number;
}

export interface MeterStatusDto {
  onCustomer: number;
  onStock: number;
  onAgent: number;
}
