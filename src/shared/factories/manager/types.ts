export interface ManagerCallbacks<CT, ET> {
  objectName: string
  makeCallback: (
    initContent?: CT,
    newContent?: CT,
    events?: ET,
    payload?: any,
  ) => Promise<CT | undefined>
  needsRegenerateCallback?: (
    content?: CT,
    events?: ET,
    payload?: any,
  ) => boolean
  generateCallback?: (content?: CT, events?: ET, payload?: any) => CT
  readCallback?: (spec?: any) => CT
  writeCallback?: (content?: CT) => Promise<void>
}

export interface Manager<CT, ET> {
  objectName: string
  init: () => Promise<void>
  handleEvent: (events?: ET, payload?: any) => Promise<void>
  read: (spec?: any) => CT | undefined
}
