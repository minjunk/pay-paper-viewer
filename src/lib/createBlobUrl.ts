export function createBlobUrl(data: string): string {
  const blob = new Blob([data], { type: 'text/html' });
  return URL.createObjectURL(blob);
}

export default createBlobUrl;
