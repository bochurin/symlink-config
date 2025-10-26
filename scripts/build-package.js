#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * Build package.json from numbered section files
 * Uses file order for sections, preserves entry order within sections
 */

const PACKAGE_DIR = 'package_json'
const OUTPUT_FILE = 'package.json'

function deepMerge(target, source) {
  const result = { ...target }
  
  for (const key in source) {
    if (Array.isArray(source[key])) {
      result[key] = (result[key] || []).concat(source[key])
    } else if (typeof source[key] === 'object' && source[key] !== null) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  
  return result
}

function buildPackageJson() {
  if (!fs.existsSync(PACKAGE_DIR)) {
    console.error(`Package directory '${PACKAGE_DIR}' not found`)
    process.exit(1)
  }

  const files = fs.readdirSync(PACKAGE_DIR)
    .filter(file => file.endsWith('.json'))
    .sort()

  if (files.length === 0) {
    console.error('No JSON files found in package directory')
    process.exit(1)
  }

  console.log('Building package.json from parts:')
  files.forEach(file => console.log(`  ${file}`))

  let result = {}
  
  for (const file of files) {
    const filePath = path.join(PACKAGE_DIR, file)
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    result = deepMerge(result, content)
  }
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2) + '\n')
  console.log(`✅ Generated ${OUTPUT_FILE}`)
}

if (require.main === module) {
  buildPackageJson()
}

module.exports = { buildPackageJson }