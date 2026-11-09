export function withBase(path: string): string {
  const baseWithoutTrailingSlash = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${baseWithoutTrailingSlash}${path}`;
}
