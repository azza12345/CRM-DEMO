export interface DialogData {
  title: string;
  fields: { label: string; formControlName: string; type: string; options?: any[] }[];
}
