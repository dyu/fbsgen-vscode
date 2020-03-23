"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const config_1 = require("./config");
const fft = require("./commands/file_from_template");
/**
 * Main extension entry point.
 * This method is called when the extension is activated (used by the first time)
 * @export
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Initializes the template manager.
    // register extension commands
    context.subscriptions.push(vscode.commands.registerCommand('extension.fileFromTemplate', fft.run.bind(config_1.newConfig(''))));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map