export function getMimeType(fileType: string): string {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return 'application/pdf';
    case 'excel':
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'csv':
      return 'text/csv';
    default:
      return 'application/octet-stream';
  }
}
