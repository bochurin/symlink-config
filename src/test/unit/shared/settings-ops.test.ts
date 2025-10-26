import * as assert from 'assert'
import { readSettings, writeSettings } from '@shared/settings-ops'

// Mock vscode configuration
const mockConfig = new Map<string, any>()

jest.mock('vscode', () => ({
  workspace: {
    getConfiguration: () => ({
      get: (key: string, defaultValue?: any) => mockConfig.get(key) ?? defaultValue,
      update: (key: string, value: any) => {
        mockConfig.set(key, value)
        return Promise.resolve()
      }
    })
  }
}), { virtual: true })

describe('Settings Operations Tests', () => {
  
  beforeEach(() => {
    mockConfig.clear()
  })
  
  describe('readSettings', () => {
    it('should read existing setting', () => {
      mockConfig.set('test.setting', 'test-value')
      const result = readSettings('test.setting', 'default')
      assert.strictEqual(result, 'test-value')
    })
    
    it('should return default for missing setting', () => {
      const result = readSettings('missing.setting', 'default-value')
      assert.strictEqual(result, 'default-value')
    })
    
    it('should handle boolean settings', () => {
      mockConfig.set('test.boolean', true)
      const result = readSettings('test.boolean', false)
      assert.strictEqual(result, true)
    })
    
    it('should handle number settings', () => {
      mockConfig.set('test.number', 42)
      const result = readSettings('test.number', 0)
      assert.strictEqual(result, 42)
    })
    
    it('should handle object settings', () => {
      const testObject = { key: 'value' }
      mockConfig.set('test.object', testObject)
      const result = readSettings('test.object', {})
      assert.deepStrictEqual(result, testObject)
    })
  })
  
  describe('writeSettings', () => {
    it('should write string setting', async () => {
      await writeSettings('test.setting', 'new-value')
      assert.strictEqual(mockConfig.get('test.setting'), 'new-value')
    })
    
    it('should write boolean setting', async () => {
      await writeSettings('test.boolean', true)
      assert.strictEqual(mockConfig.get('test.boolean'), true)
    })
    
    it('should write number setting', async () => {
      await writeSettings('test.number', 123)
      assert.strictEqual(mockConfig.get('test.number'), 123)
    })
    
    it('should write object setting', async () => {
      const testObject = { nested: { key: 'value' } }
      await writeSettings('test.object', testObject)
      assert.deepStrictEqual(mockConfig.get('test.object'), testObject)
    })
    
    it('should overwrite existing setting', async () => {
      mockConfig.set('test.setting', 'old-value')
      await writeSettings('test.setting', 'new-value')
      assert.strictEqual(mockConfig.get('test.setting'), 'new-value')
    })
  })
})