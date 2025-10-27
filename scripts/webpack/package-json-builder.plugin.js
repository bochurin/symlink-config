#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PACKAGE_DIR = 'package';
const BASE_FILE = 'base.json';
const OUTPUT_FILE = 'package.json';

function processImports(obj, basePath) {
  if (typeof obj === 'string' && obj.startsWith('import:')) {
    const filename = obj.substring(7);
    const filePath = path.join(basePath, filename);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: Import file not found: ${filePath}`);
      return obj;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => processImports(item, basePath));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const key in obj) {
      result[key] = processImports(obj[key], basePath);
    }
    return result;
  }
  
  return obj;
}

function buildPackageJson() {
  const baseFilePath = path.join(PACKAGE_DIR, BASE_FILE);
  
  if (!fs.existsSync(baseFilePath)) {
    throw new Error(`Base file not found: ${baseFilePath}`);
  }
  
  const baseContent = JSON.parse(fs.readFileSync(baseFilePath, 'utf8'));
  const result = processImports(baseContent, PACKAGE_DIR);
  const newContent = JSON.stringify(result, null, 2) + '\n';
  
  // Compare with existing package.json
  let currentContent = '';
  if (fs.existsSync(OUTPUT_FILE)) {
    currentContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
  }
  
  if (newContent !== currentContent) {
    console.log('Building package.json from base with imports');
    fs.writeFileSync(OUTPUT_FILE, newContent);
    console.log('✅ Generated package.json');
  }
}

// Webpack plugin class
class PackageJsonBuilderPlugin {
  apply(compiler) {
    compiler.hooks.beforeRun.tapAsync('PackageJsonBuilderPlugin', (compiler, callback) => {
      try {
        buildPackageJson();
        callback();
      } catch (error) {
        callback(error);
      }
    });
    
    compiler.hooks.compilation.tap('PackageJsonBuilderPlugin', (compilation) => {
      // Add package files as dependencies so webpack watches them
      const packageFiles = fs.readdirSync(PACKAGE_DIR)
        .filter(file => file.endsWith('.json'))
        .map(file => path.resolve(PACKAGE_DIR, file));
      
      packageFiles.forEach(file => {
        compilation.fileDependencies.add(file);
      });
    });
    
    compiler.hooks.watchRun.tapAsync('PackageJsonBuilderPlugin', (compiler, callback) => {
      try {
        buildPackageJson();
        callback();
      } catch (error) {
        callback(error);
      }
    });
  }
}

// If run directly (not as webpack plugin)
if (require.main === module) {
  try {
    buildPackageJson();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = { PackageJsonBuilderPlugin, buildPackageJson };