export function normalizePath(path: string, addTrailingSlash = false): string {
  const normalized = path.split('\\').join('/')
  return addTrailingSlash && !normalized.endsWith('/') 
    ? normalized + '/' 
    : normalized
}
