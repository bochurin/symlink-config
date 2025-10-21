export interface ManagerCallbacks<CT> {
  objectNameCallback: (params?: { [key: string]: any }) => string
  makeCallback: (params?: { [key: string]: any }) => CT | undefined
  needsRegenerateCallback?: (params?: { [key: string]: any }) => boolean
  generateCallback?: (params?: { [key: string]: any }) => CT
  readCallback?: (params?: { [key: string]: any }) => CT
  writeCallback?: (params?: { [key: string]: any }) => Promise<void>
}

export interface Manager<CT> {
  objectName: (params?: { [key: string]: any }) => string
  init: () => Promise<void>
  handleEvent: (params?: { [key: string]: any }) => Promise<void>
  make: (params?: { [key: string]: any }) => void
  read?: (params?: { [key: string]: any }) => CT
}
