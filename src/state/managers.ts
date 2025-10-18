import { Manager } from '@shared/factories/manager'

const managers = new Map<string, Manager<any, any>>()

export function registerManager(name: string, manager: Manager<any, any>) {
  managers.set(name, manager)
}

export function getManagers(...names: string[]): Manager<any, any>[] {
  return names.map((name) => managers.get(name)).filter((m) => m !== undefined)
}
