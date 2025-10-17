export interface ManagerCallbacks<CT, ET> {
  readCallback: () => Promise<CT>
  writeCallback?: (content: CT) => Promise<void>
  makeCallback: (
    initialContent: CT,
    events?: ET,
    newContent?: CT,
  ) => Promise<CT>
  generateCallback?: (initialContent: CT) => Promise<CT>
  needsRegenerateCallback?: (content: CT, events?: ET) => Promise<boolean>
  name?: string
}

export interface Manager<CT, ET> {
  init: () => Promise<void>
  read: () => Promise<CT>
  make: () => Promise<void>
  handleEvent: (events: ET) => Promise<void>
  name: string
}
