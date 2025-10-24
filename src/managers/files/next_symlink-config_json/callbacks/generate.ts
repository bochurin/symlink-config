import { getWorkspaceRoot } from '@state'
import { readDir, readFile, normalizePath } from '@shared/file-ops'
import { Config, ConfigEntry } from '@managers'

export function generateCallback(): string {
  try {
    const configFiles = findConfigFiles()
    const masterConfig = createMasterConfig(configFiles)
    return JSON.stringify(masterConfig, null, 2)
  } catch {
    return ''
  }
}

function findConfigFiles(): string[] {
  const configFiles: string[] = []
  const workspaceRoot = getWorkspaceRoot()

  function scanDirectory(relativePath: string = '') {
    try {
      const entries = readDir(workspaceRoot, relativePath || '.')
      for (const entry of entries) {
        const entryPath = relativePath
          ? `${relativePath}/${entry.name}`
          : entry.name
        if (entry.isDirectory()) {
          scanDirectory(entryPath)
        } else if (entry.name === 'symlink-config.json') {
          configFiles.push(entryPath)
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  scanDirectory()
  return configFiles
}

function createMasterConfig(configFiles: string[]): Config {
  const masterConfig: Config = {
    directories: [],
    files: [],
  }

  for (const configFile of configFiles) {
    const config = loadConfig(configFile)
    if (!config) continue

    const configDir = configFile.includes('/')
      ? configFile.substring(0, configFile.lastIndexOf('/'))
      : ''

    if (config.directories) {
      for (const entry of config.directories) {
        masterConfig.directories!.push(convertToAtSyntax(entry, configDir))
      }
    }

    if (config.files) {
      for (const entry of config.files) {
        masterConfig.files!.push(convertToAtSyntax(entry, configDir))
      }
    }
  }

  return masterConfig
}

function convertToAtSyntax(entry: ConfigEntry, configDir: string): ConfigEntry {
  return {
    target: pathToAtSyntax(entry.target, configDir),
    source: pathToAtSyntax(entry.source, configDir),
    configPath: configDir ? `@${normalizePath(configDir)}` : '@',
  } as ConfigEntry
}

function pathToAtSyntax(originalPath: string, configDir: string): string {
  if (originalPath.startsWith('@')) {
    return originalPath
  }

  const fullPath = configDir ? `${configDir}/${originalPath}` : originalPath
  return `@${normalizePath(fullPath)}`
}

function loadConfig(configPath: string): Config | null {
  try {
    const workspaceRoot = getWorkspaceRoot()
    const content = readFile(workspaceRoot, configPath)
    return JSON.parse(content)
  } catch {
    return null
  }
}
