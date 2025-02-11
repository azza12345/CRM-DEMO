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

export interface ContractorOperationData {
  contractorId: number;
  contractorName: string;
  onAssignCount: number;
  onAgentCount: number;
  onCustomerCount: number;
  totalRetireReceived: number;
  totalRetireNotReceived: number;
  totalCustomerReplacement: number;
}
