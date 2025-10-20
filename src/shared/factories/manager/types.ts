export interface ManagerCallbacks<CT> {
  objectNameCallback: (params?: { [key: string]: any }) => string
  makeCallback: (params?: { [key: string]: any }) => Promise<CT | undefined>
  needsRegenerateCallback?: (params?: { [key: string]: any }) => boolean
  generateCallback?: (params?: { content?: CT; [key: string]: any }) => CT
  readCallback?: (params?: { [key: string]: any }) => CT
  writeCallback?: (params?: { [key: string]: any }) => Promise<void>
}

export interface Manager<CT> {
  objectName: (params?: { [key: string]: any }) => string
  init: () => Promise<void>
  handleEvent: (params?: { [key: string]: any }) => Promise<void>
  read?: (params?: { [key: string]: any }) => CT
}
