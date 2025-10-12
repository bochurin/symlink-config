#!/usr/bin/env node

const os = require('os')
const fs = require('fs')
const path = require('path')

console.log(`Testing on: ${os.platform()} (${os.arch()})`)
console.log(`Node.js: ${process.version}`)
console.log(`Working directory: ${process.cwd()}`)

// Test core symlink logic without VSCode dependencies
async function testCoreLogic() {
  try {
    // Test 1: Check if test workspace exists
    const testWorkspace = path.join(process.cwd(), 'test-workspace')
    if (!fs.existsSync(testWorkspace)) {
      console.log('❌ test-workspace not found')
      return
    }
    console.log('✅ test-workspace found')

    // Test 2: Load and test tree generation
    const { generateTree } = require('./out/views/symlink-tree/generate')
    process.chdir(testWorkspace)
    
    const tree = generateTree('targets')
    console.log('✅ Tree generated with keys:', Object.keys(tree))

    // Test 3: Test symlink operations collection
    const { applyConfiguration } = require('./out/commands/apply-configuration')
    
    // Mock VSCode dependencies that would fail in Node.js
    const mockVscode = {
      window: {
        showErrorMessage: (msg) => console.log('ERROR:', msg),
        showInformationMessage: (msg) => console.log('INFO:', msg)
      },
      env: {
        clipboard: { writeText: (text) => console.log('CLIPBOARD:', text) },
        openExternal: (uri) => console.log('OPEN:', uri.toString())
      },
      workspace: {
        openTextDocument: (path) => console.log('OPEN DOC:', path)
      }
    }

    // Test core logic
    console.log('🧪 Testing core symlink logic...')
    await applyConfiguration()
    
    console.log('✅ Core logic test completed')

  } catch (error) {
    console.log('❌ Test failed:', error.message)
    console.log('Stack:', error.stack)
  }
}

testCoreLogic()