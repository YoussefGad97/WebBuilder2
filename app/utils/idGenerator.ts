let counter = 0;

export function generateUniqueId(prefix: string = 'id'): string {
  counter += 1;
  return `${prefix}-${counter}-${Date.now()}`;
}
