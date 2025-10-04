import * as vscode from 'vscode';

export interface WatcherConfig {
    pattern: string;
    onCreate?: (() => void) | (() => void)[];
    onChange?: (() => void) | (() => void)[];
    onDelete?: (() => void) | (() => void)[];
}

export function useFileWatcher(config: WatcherConfig): vscode.FileSystemWatcher {
    const watcher = vscode.workspace.createFileSystemWatcher(
        config.pattern,
        !config.onCreate,  // ignore create if no onCreate handler
        !config.onChange,  // ignore change if no onChange handler
        !config.onDelete   // ignore delete if no onDelete handler
    );

    if (config.onCreate) {
        const handlers = Array.isArray(config.onCreate) ? config.onCreate : [config.onCreate];
        watcher.onDidCreate(() => handlers.forEach(handler => handler()));
    }

    if (config.onChange) {
        const handlers = Array.isArray(config.onChange) ? config.onChange : [config.onChange];
        watcher.onDidChange(() => handlers.forEach(handler => handler()));
    }

    if (config.onDelete) {
        const handlers = Array.isArray(config.onDelete) ? config.onDelete : [config.onDelete];
        watcher.onDidDelete(() => handlers.forEach(handler => handler()));
    }

    return watcher;
}