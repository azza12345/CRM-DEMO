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

export interface AgentOperationData {
  agentId: number;
  agentName: string;
  onAssignCount: number;
  onAgentCount: number;
  onCustomerCount: number;
  totalRetireReceived: number;
  totalRetireNotReceived: number;
  totalCustomerReplacement: number;
}
