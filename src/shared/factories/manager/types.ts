export interface ManagerCallbacks<CT, ET> {
  objectName: string
  makeCallback: (params?: {
    initContent?: CT
    newContent?: CT
    events?: ET
    [key: string]: any
  }) => Promise<CT | undefined>
  needsRegenerateCallback?: (params?: {
    content?: CT
    events?: ET
    [key: string]: any
  }) => boolean
  generateCallback?: (params?: {
    content?: CT
    events?: ET
    [key: string]: any
  }) => CT
  readCallback?: (params?: { [key: string]: any }) => CT
  writeCallback?: (params?: {
    content?: CT
    [key: string]: any
  }) => Promise<void>
}

export interface Manager<CT, ET> {
  objectName: string
  init: () => Promise<void>
  handleEvent: (params?: { events?: ET; [key: string]: any }) => Promise<void>
  read: (params?: { [key: string]: any }) => CT | undefined
}
