import * as assert from 'assert'
import { createManager } from '@shared/factories'

describe('Manager Factory Tests', () => {
  
  describe('createManager', () => {
    it('should create manager with all callbacks', () => {
      const callbacks = {
        objectNameCallback: () => 'test-object',
        generateCallback: () => 'generated-content',
        readCallback: () => 'existing-content',
        writeCallback: async (params?: any) => { /* mock write */ },
        logCallback: (message: string) => { /* mock log */ },
      }
      
      const manager = createManager(callbacks)
      
      assert.ok(manager.read)
      assert.ok(manager.make)
      assert.ok(manager.objectName)
      assert.strictEqual(typeof manager.read, 'function')
      assert.strictEqual(typeof manager.make, 'function')
      assert.strictEqual(typeof manager.objectName, 'function')
    })
    
    it('should execute read callback', () => {
      let readCalled = false
      const callbacks = {
        objectNameCallback: () => 'test-object',
        generateCallback: () => 'generated-content',
        readCallback: () => {
          readCalled = true
          return 'existing-content'
        },
        writeCallback: async (params?: any) => { /* mock write */ },
        logCallback: (message: string) => { /* mock log */ },
      }
      
      const manager = createManager(callbacks)
      const result = manager.read!()
      
      assert.ok(readCalled)
      assert.strictEqual(result, 'existing-content')
    })
    
    it('should execute make workflow', async () => {
      let writeCalled = false
      let logCalled = false
      const callbacks = {
        objectNameCallback: () => 'test-object',
        generateCallback: () => 'new-content',
        readCallback: () => 'old-content',
        writeCallback: async (params?: any) => {
          writeCalled = true
          assert.strictEqual(params?.content, 'new-content')
        },
        logCallback: (message: string) => {
          logCalled = true
          assert.ok(message.includes('test-object'))
        },
      }
      
      const manager = createManager(callbacks)
      await manager.make()
      
      assert.ok(writeCalled)
      assert.ok(logCalled)
    })
    
    it('should skip write if content unchanged', async () => {
      let writeCalled = false
      let logCalled = false
      const callbacks = {
        objectNameCallback: () => 'test-object',
        generateCallback: () => 'same-content',
        readCallback: () => 'same-content',
        writeCallback: async (params?: any) => {
          writeCalled = true
        },
        logCallback: (message: string) => {
          logCalled = true
        },
      }
      
      const manager = createManager(callbacks)
      await manager.make()
      
      assert.ok(!writeCalled)
      assert.ok(!logCalled)
    })
  })
})