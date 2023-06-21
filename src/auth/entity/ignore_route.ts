const IRoutes = new Set(['POST /api/user']);

export function IgnoreRoute(method: string, url: string): boolean {
  const route = `${method} ${url}`;
  return IRoutes.has(route);
}
