//FIXME: this interface will be changed based on api resonse
export interface Agent {
  id: string;
  code: string;
  amcUsername: string;
  name: string;
  email: string;
  ghanaCard: string;
  phone: string;
  state: 'enabled' | 'disabled';
  isActive: boolean;
  actionIcon?: string;
  actionTooltip?: string;
}
