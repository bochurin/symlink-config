export interface ManagerCallbacks<CT, ET> {
  readCallback: () => CT
  writeCallback?: (content: CT) => Promise<void>

  makeCallbak: (initialContent: CT, events?: ET, newContent?: CT) => CT
  generateCallback?: (initialContent: CT) => CT
  needsRegenerateCallback?: (content: CT, events?: ET) => boolean

  nameCallback?: () => string
}

export interface Manager<CT, ET> {
  init: () => Promise<void>
  read: () => CT
  make: () => Promise<void>
  handleEvent: (events: ET) => Promise<void>
}
