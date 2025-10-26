/**
 * Mock VSCode API for testing
 */

export const mockVscode = {
  Uri: {
    file: (path: string) => ({
      fsPath: path,
      scheme: 'file',
      authority: '',
      path: path.replace(/\\/g, '/'),
      query: '',
      fragment: '',
    }),
  },
  
  workspace: {
    fs: {
      stat: async (uri: any) => ({
        type: 1, // FileType.File
        ctime: Date.now(),
        mtime: Date.now(),
        size: 100,
      }),
    },
    workspaceFolders: [
      {
        uri: { fsPath: '/test/workspace' },
        name: 'test-workspace',
        index: 0,
      },
    ],
  },
  
  window: {
    showInformationMessage: (message: string, ...items: string[]) => 
      Promise.resolve(items[0]),
    showWarningMessage: (message: string, ...items: string[]) => 
      Promise.resolve(items[0]),
    showErrorMessage: (message: string, ...items: string[]) => 
      Promise.resolve(items[0]),
  },
  
  FileType: {
    File: 1,
    Directory: 2,
    SymbolicLink: 64,
  },
}

// Export as default for moduleNameMapper
export default mockVscode