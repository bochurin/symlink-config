import * as path from 'path'

export function join(...paths: string[]): string {
  return path.join(...paths)
}

export function relative(from: string, to: string): string {
  return path.relative(from, to)
}

export function dirname(filePath: string): string {
  return path.dirname(filePath)
}

export function resolve(...paths: string[]): string {
  return path.resolve(...paths)
}

export function extname(filePath: string): string {
  return path.extname(filePath)
}