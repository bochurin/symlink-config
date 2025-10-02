import * as vscode from 'vscode';
import { SymlinkManager } from './symlink/manager';
import { SymlinkMode } from './symlink/types';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('Symlink Config extension is now active!');

	const symlinkManager = new SymlinkManager();

	// Register commands
	const createAllCommand = vscode.commands.registerCommand('symlink-config.createAll', async () => {
		await executeSymlinkCommand('full', symlinkManager);
	});

	const cleanAllCommand = vscode.commands.registerCommand('symlink-config.cleanAll', async () => {
		await executeSymlinkCommand('clean', symlinkManager);
	});

	const dryRunCommand = vscode.commands.registerCommand('symlink-config.dryRun', async () => {
		await executeSymlinkCommand('dry', symlinkManager);
	});

	// Status bar item
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	statusBarItem.text = '$(link) Symlinks';
	statusBarItem.tooltip = 'Symlink Config: Manage project symlinks';
	statusBarItem.command = 'symlink-config.createAll';
	statusBarItem.show();

	context.subscriptions.push(createAllCommand, cleanAllCommand, dryRunCommand, statusBarItem);
}

// Execute symlink management using TypeScript
async function executeSymlinkCommand(mode: SymlinkMode, manager: SymlinkManager) {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('No workspace folder found');
		return;
	}

	const workspacePath = workspaceFolder.uri.fsPath;

	try {
		vscode.window.showInformationMessage(`Running symlink ${mode} operation...`);
		
		const result = await manager.processPath(workspacePath, mode);
		
		if (result.success) {
			vscode.window.showInformationMessage(result.message);
			
			// Show details in output channel for debugging
			if (result.details && result.details.length > 0) {
				const outputChannel = vscode.window.createOutputChannel('Symlink Config');
				outputChannel.appendLine(`=== Symlink ${mode.toUpperCase()} Operation ===`);
				result.details.forEach(detail => outputChannel.appendLine(detail));
				outputChannel.show(true);
			}
		} else {
			vscode.window.showErrorMessage(result.message);
		}
		
	} catch (error) {
		console.error('Symlink operation failed:', error);
		vscode.window.showErrorMessage(`Symlink ${mode} operation failed: ${error}`);
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}