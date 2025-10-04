import * as fs from 'fs';
import * as path from 'path';
import { SymlinkConfig, SymlinkMode, ProcessResult } from './types';
import { resolvePath, relativePath, shouldExclude, isWindows } from './utils';
import { appendToGitignore, getSymlinksFromGitignore } from './gitignore';
import { SymlinkCreator } from './creator';

/**
 * Main symlink management class
 * Based on CVHere process-path.sh logic
 */
export class SymlinkManager {
  private creator = new SymlinkCreator();
  
  /**
   * Process symlinks in a directory (main entry point)
   */
  async processPath(
    configDir: string, 
    mode: SymlinkMode = 'full', 
    rootDir?: string
  ): Promise<ProcessResult> {
    const actualRootDir = rootDir || configDir;
    const configFile = path.join(configDir, 'symlink.config.json');
    const results: string[] = [];
    
    try {
      // Step 1: Clean old symlinks
      const cleanResult = await this.removeOldSymlinks(configDir, mode);
      results.push(cleanResult.message);
      
      // Step 2: Process new symlinks (if not clean mode)
      if (mode !== 'clean' && fs.existsSync(configFile)) {
        const config = await this.loadConfig(configFile);
        const processResult = await this.processSymlinks(config, configDir, mode);
        results.push(processResult.message);
        
        // Step 3: Recurse into subdirectories
        const recurseResult = await this.recurseDirectories(
          configDir, 
          mode, 
          actualRootDir, 
          config.exclude_paths || []
        );
        results.push(recurseResult.message);
      }
      
      // Step 4: Handle Windows batch file generation
      if (isWindows() && configDir === actualRootDir && mode !== 'dry') {
        const batchResult = this.handleWindowsBatch(mode, actualRootDir);
        results.push(batchResult.message);
      }
      
      return {
        success: true,
        message: `Symlink ${mode} operation completed`,
        details: results.filter(r => r.length > 0)
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Symlink operation failed: ${error}`,
        details: results
      };
    }
  }
  
  /**
   * Load symlink configuration from JSON file
   */
  private async loadConfig(configFile: string): Promise<SymlinkConfig> {
    const content = fs.readFileSync(configFile, 'utf8');
    return JSON.parse(content);
  }
  
  /**
   * Process symlinks from configuration
   */
  private async processSymlinks(
    config: SymlinkConfig, 
    configDir: string, 
    mode: SymlinkMode
  ): Promise<ProcessResult> {
    const results: string[] = [];
    
    // Process directories
    if (config.directories && config.directories.length > 0) {
      for (const entry of config.directories) {
        const result = await this.createSymlinkEntry(entry, configDir, 'dir', mode);
        results.push(result.message);
      }
    } else {
      results.push('No directory symlinks found');
    }
    
    // Process files
    if (config.files && config.files.length > 0) {
      for (const entry of config.files) {
        const result = await this.createSymlinkEntry(entry, configDir, 'file', mode);
        results.push(result.message);
      }
    } else {
      results.push('No file symlinks found');
    }
    
    return {
      success: true,
      message: `Processed symlinks from ${path.basename(configDir)}`,
      details: results
    };
  }
  
  /**
   * Create individual symlink entry
   */
  private async createSymlinkEntry(
    entry: any, 
    configDir: string, 
    type: 'file' | 'dir', 
    mode: SymlinkMode
  ): Promise<ProcessResult> {
    const target = resolvePath(configDir, entry.target);
    const source = resolvePath(configDir, entry.source);
    const relSource = relativePath(path.dirname(target), source);
    const relTarget = relativePath(configDir, target);
    
    // Create symlink
    const createResult = await this.creator.createSymlink(target, relSource, type, mode);
    
    if (createResult.success && mode !== 'dry' && mode !== 'clean') {
      // Add to .gitignore
      if (appendToGitignore(relTarget, configDir, 'SymLinks')) {
        return {
          success: true,
          message: `${createResult.message} (added to .gitignore)`
        };
      } else {
        return {
          success: true,
          message: `${createResult.message} (already in .gitignore)`
        };
      }
    }
    
    return createResult;
  }
  
  /**
   * Remove old symlinks based on .gitignore SymLinks block
   */
  private async removeOldSymlinks(configDir: string, mode: SymlinkMode): Promise<ProcessResult> {
    const symlinks = getSymlinksFromGitignore(configDir);
    const results: string[] = [];
    
    if (symlinks.length === 0) {
      return {
        success: true,
        message: 'No symlinks found in .gitignore SymLinks block'
      };
    }
    
    for (const symlinkPath of symlinks) {
      const fullPath = path.join(configDir, symlinkPath);
      
      if (fs.existsSync(fullPath)) {
        const stats = fs.lstatSync(fullPath);
        if (stats.isSymbolicLink()) {
          if (mode === 'dry') {
            results.push(`DRY: Would remove symlink: ${symlinkPath}`);
          } else {
            fs.unlinkSync(fullPath);
            results.push(`Removed old symlink: ${symlinkPath}`);
          }
        } else {
          results.push(`Warning: Path exists but is not a symlink: ${symlinkPath}`);
        }
      }
    }
    
    return {
      success: true,
      message: `Processed ${symlinks.length} symlink entries`,
      details: results
    };
  }
  
  /**
   * Recursively process subdirectories
   */
  private async recurseDirectories(
    configDir: string, 
    mode: SymlinkMode, 
    rootDir: string, 
    excludePatterns: string[]
  ): Promise<ProcessResult> {
    const results: string[] = [];
    
    try {
      const entries = fs.readdirSync(configDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.isSymbolicLink()) {
          if (shouldExclude(entry.name, excludePatterns)) {
            results.push(`Skipping excluded directory: ${entry.name}`);
            continue;
          }
          
          const subDir = path.join(configDir, entry.name);
          results.push(`Recursing into: ${entry.name}`);
          
          const subResult = await this.processPath(subDir, mode, rootDir);
          if (subResult.details) {
            results.push(...subResult.details);
          }
        }
      }
      
      return {
        success: true,
        message: 'Completed directory recursion',
        details: results
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Failed to recurse directories: ${error}`
      };
    }
  }
  
  /**
   * Handle Windows batch file generation and user interaction
   */
  private handleWindowsBatch(mode: SymlinkMode, rootDir: string): ProcessResult {
    const commands = this.creator.getBatchCommands();
    
    if (commands.length === 0) {
      return {
        success: true,
        message: 'No Windows batch commands generated'
      };
    }
    
    try {
      const batchFileName = this.creator.generateBatchFile(mode, rootDir);
      this.creator.clearBatchCommands();
      
      return {
        success: true,
        message: `Generated Windows batch file: ${batchFileName}\\nRun as Administrator to create symlinks`
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Failed to generate batch file: ${error}`
      };
    }
  }
}