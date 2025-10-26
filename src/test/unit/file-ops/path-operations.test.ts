import * as assert from 'assert'
import { basename, fullPath, normalizePath, join, relative } from '@shared/file-ops'

describe('Path Operations Tests', () => {
  
  describe('basename', () => {
    it('should extract filename from string path', () => {
      assert.strictEqual(basename('C:\\test\\file.txt'), 'file.txt')
      assert.strictEqual(basename('/test/file.txt'), 'file.txt')
      assert.strictEqual(basename('file.txt'), 'file.txt')
    })
    
    it('should handle directories', () => {
      assert.strictEqual(basename('C:\\test\\dir\\'), 'dir')
      assert.strictEqual(basename('/test/dir/'), 'dir')
    })
  })
  
  describe('fullPath', () => {
    it('should join root and relative paths', () => {
      const result = fullPath('C:\\workspace', 'src\\file.ts')
      assert.ok(result.includes('workspace'))
      assert.ok(result.includes('file.ts'))
    })
    
    it('should normalize the result', () => {
      const result = fullPath('C:\\workspace\\', '\\src\\file.ts')
      assert.ok(!result.includes('\\\\'))
    })
  })
  
  describe('normalizePath', () => {
    it('should normalize Windows paths', () => {
      assert.strictEqual(
        normalizePath('C:\\test\\\\path\\file.txt'),
        'C:/test//path/file.txt'
      )
    })
    
    it('should handle trailing slashes', () => {
      assert.strictEqual(
        normalizePath('C:\\test\\path\\', true),
        'C:/test/path/'
      )
      assert.strictEqual(
        normalizePath('C:\\test\\path\\', false),
        'C:/test/path/'
      )
    })
  })
  
  describe('join', () => {
    it('should join multiple path segments', () => {
      const result = join('workspace', 'src', 'file.ts')
      assert.ok(result.includes('workspace'))
      assert.ok(result.includes('src'))
      assert.ok(result.includes('file.ts'))
    })
    
    it('should handle empty segments', () => {
      const result = join('workspace', '', 'file.ts')
      assert.strictEqual(result, join('workspace', 'file.ts'))
    })
  })
  
  describe('relative', () => {
    it('should calculate relative path', () => {
      const result = relative('C:\\workspace', 'C:\\workspace\\src\\file.ts')
      assert.ok(result.includes('src'))
      assert.ok(result.includes('file.ts'))
    })
    
    it('should handle same directory', () => {
      const result = relative('C:\\workspace', 'C:\\workspace')
      assert.strictEqual(result, '')
    })
  })
})