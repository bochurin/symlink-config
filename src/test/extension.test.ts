import * as assert from 'assert'

// Import test suites
import './unit/file-ops/path-operations.test'
import './unit/gitignore-ops/parse-assemble.test'
import './unit/managers/manager-factory.test'
import './unit/shared/settings-ops.test'
import './integration/workflows/apply-config.test'

describe('Symlink Config Extension Test Suite', () => {
  beforeAll(() => {
    console.log('Starting symlink-config extension tests...')
  })
  
  afterAll(() => {
    console.log('Completed symlink-config extension tests.')
  })
  
  it('should run all test suites', () => {
    // This test ensures all test suites are imported and run
    assert.ok(true)
  })
})
