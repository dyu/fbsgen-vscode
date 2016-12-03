// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

import { Config, newConfig } from './config'

import * as fft from './commands/file_from_template'

/**
 * Main extension entry point.
 * This method is called when the extension is activated (used by the first time)
 * @export
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
    // Initializes the template manager.
    
    // register extension commands
    context.subscriptions.push(vscode.commands.registerCommand('extension.fileFromTemplate',
        fft.run.bind(newConfig(''))))
}

// this method is called when your extension is deactivated
export function deactivate() {
}
