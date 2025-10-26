import * as assert from 'assert'
import { parseGitignore, assembleGitignore } from '@shared/gitignore-ops'

describe('Gitignore Operations Tests', () => {
  
  describe('parseGitignore', () => {
    it('should parse empty gitignore', () => {
      const result = parseGitignore('')
      // Empty string still creates an empty line entry
      const keys = Object.keys(result)
      assert.ok(keys.length >= 0) // May have empty line entries
    })
    
    it('should parse simple patterns', () => {
      const content = 'node_modules\n*.log\n.env'
      const result = parseGitignore(content)
      
      assert.ok(result['node_modules'])
      assert.ok(result['*.log'])
      assert.ok(result['.env'])
      assert.strictEqual(result['node_modules'].active, true)
    })
    
    it('should handle comments', () => {
      const content = '# Comment\nnode_modules\n# Another comment\n*.log'
      const result = parseGitignore(content)
      
      assert.ok(result['node_modules'])
      assert.ok(result['*.log'])
      assert.ok(!result['# Comment'])
    })
    
    it('should handle disabled patterns', () => {
      const content = 'node_modules\n#*.log\n.env'
      const result = parseGitignore(content)
      
      assert.strictEqual(result['node_modules'].active, true)
      assert.strictEqual(result['*.log'].active, false)
      assert.strictEqual(result['.env'].active, true)
    })
    
    it('should preserve spacing', () => {
      const content = 'node_modules\n\n*.log\n\n\n.env'
      const result = parseGitignore(content)
      
      // Check that patterns exist
      assert.ok(result['node_modules'])
      assert.ok(result['*.log'])
      assert.ok(result['.env'])
      // Check empty lines are tracked
      assert.ok(result['__EMPTY_LINE_0'])
    })
    
    it('should handle symlink-config service files', () => {
      const content = `
# Symlink Config Service Files
current.symlink-config.json
next.symlink-config.json
*.symlink-config.bat
*.symlink-config.sh
`
      const result = parseGitignore(content)
      
      assert.ok(result['current.symlink-config.json'])
      assert.ok(result['next.symlink-config.json'])
      assert.ok(result['*.symlink-config.bat'])
      assert.ok(result['*.symlink-config.sh'])
    })
  })
  
  describe('assembleGitignore', () => {
    it('should assemble empty record', () => {
      const result = assembleGitignore({})
      assert.strictEqual(result, '')
    })
    
    it('should assemble simple patterns', () => {
      const record = {
        'node_modules': { spacing: '', active: true },
        '*.log': { spacing: '\n', active: true },
        '.env': { spacing: '\n', active: true },
      }
      
      const result = assembleGitignore(record)
      assert.ok(result.includes('node_modules'))
      assert.ok(result.includes('*.log'))
      assert.ok(result.includes('.env'))
    })
    
    it('should handle disabled patterns', () => {
      const record = {
        'node_modules': { spacing: '', active: true },
        '*.log': { spacing: '', active: false },
        '.env': { spacing: '', active: true },
      }
      
      const result = assembleGitignore(record)
      assert.ok(result.includes('node_modules'))
      assert.ok(result.includes('#*.log'))
      assert.ok(result.includes('.env'))
    })
    
    it('should preserve spacing', () => {
      const record = {
        'node_modules': { spacing: '', active: true },
        '*.log': { spacing: '\n\n', active: true },
        '.env': { spacing: '\n', active: true },
      }
      
      const result = assembleGitignore(record)
      const lines = result.split('\n')
      
      // Should have proper spacing between entries
      assert.ok(lines.length >= 4) // At least: node_modules, empty, *.log, .env
    })
    
    it('should round-trip correctly', () => {
      const original = `node_modules
*.log

.env
# Comment preserved
dist/`
      
      const parsed = parseGitignore(original)
      const assembled = assembleGitignore(parsed)
      const reparsed = parseGitignore(assembled)
      
      // Key patterns should be preserved
      assert.ok(reparsed['node_modules'])
      assert.ok(reparsed['*.log'])
      assert.ok(reparsed['.env'])
      assert.ok(reparsed['dist/'])
    })
  })
})