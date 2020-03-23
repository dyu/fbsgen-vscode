"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
const config_1 = require("../config");
function showError(msg) {
    vscode.window.showErrorMessage(msg);
}
/**
 * Main command to create a file from a template.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * @export
 * @param {TemplatesManager} templatesManager
 * @param {*} args
 * @returns
 */
function run(args) {
    let config = this, rootPath = vscode.workspace.rootPath, vsconfig = vscode.workspace.getConfiguration('fbsgen'), user_dir = config.user_dir, override_dir = vsconfig.get('templates_dir', ''), templates_dir;
    if (!user_dir)
        config.user_dir = user_dir = config_1.getUserDir();
    let jar_file = path.join(config_1.targetDir, 'fbsgen.jar');
    if (!fs.existsSync(jar_file)) {
        showError('The file does not exist: ' + jar_file);
        return;
    }
    if (override_dir) {
        if (!fs.statSync(templates_dir = path.join(rootPath, override_dir)).isDirectory()) {
            showError('The dir does not exist: ' + templates_dir);
            return;
        }
        config.templates_dir = templates_dir;
    }
    else if (fs.statSync(templates_dir = path.join(rootPath, 'templates')).isDirectory()) {
        config.templates_dir = templates_dir;
    }
    else if (config.templates_dir) {
        templates_dir = config.templates_dir;
    }
    else {
        config.templates_dir = templates_dir = config_1.mkdirIfNotExist(user_dir, 'fbsgen-templates');
    }
    let destDir;
    if (!args) {
        destDir = rootPath;
    }
    else {
        destDir = config_1.getParentDirIfFile(args.fsPath);
    }
    // show the list of available templates.
    vscode.window.showQuickPick(config_1.listDirs(templates_dir)).then(selection => {
        // nothing selected. cancel
        if (!selection) {
            return;
        }
        // ask for name
        let inputOptions = {
            prompt: 'Enter name',
            value: ''
        };
        vscode.window.showInputBox(inputOptions).then(name => {
            if (!name)
                return;
            let srcDir = path.join(templates_dir, selection);
            config_1.listFiles(srcDir).then((files) => {
                files.length && child_process_1.exec(buildCliArgs(jar_file, srcDir, destDir, name, files), cbExec);
            });
        });
    });
}
exports.run = run;
function buildCliArgs(jar_file, srcDir, destDir, name, files) {
    return `java -Dcli.p_block=true -jar ${jar_file} : ${srcDir} ${destDir} name:${name} dir_name:${path.basename(destDir)} dir:${destDir} dot:. : ${files.join(' ')}`;
}
function cbExec(error, stdout, stderr) {
    if (error)
        showError(String(stderr));
}
//# sourceMappingURL=file_from_template.js.map