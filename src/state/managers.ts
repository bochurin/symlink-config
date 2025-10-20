import { Manager } from '@shared/factories/manager'

const managers = new Map<string, Manager<any>>()

export function registerManager(name: string, manager: Manager<any>) {
  managers.set(name, manager)
}

export function getManagers(...names: string[]): Manager<any>[] {
  return names.map((name) => managers.get(name)).filter((m) => m !== undefined)
}
