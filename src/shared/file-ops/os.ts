import * as os from 'os'

export enum Platform {
  Windows = 'windows',
  Unix = 'unix',
}

export function platform(): Platform {
  return os.platform() === 'win32' ? Platform.Windows : Platform.Unix
}