//FIXME: this interface will be changed based on api resonse
export interface Agent {
  id: string;
  code: string;
  userName: string;
  name: string;
  image?: string;
  email: string;
  ghanaCard: string;
  phone: string;
  state: 'enabled' | 'disabled';
  isActive: boolean;
  actionIcon?: string;
  actionTooltip?: string;
}
