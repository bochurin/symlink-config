let processingQueue = Promise.resolve()

export function queue(fn: () => Promise<void>): Promise<void> {
  processingQueue = processingQueue.then(fn)
  return processingQueue
}
