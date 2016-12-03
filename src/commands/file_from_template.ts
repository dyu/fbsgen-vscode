import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'

import { Config, getUserDir, mkdirIfNotExist, getParentDirIfFile } from '../config'

function showError(msg: string) {
    vscode.window.showErrorMessage(msg)
}

/**
 * Main command to create a file from a template.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 * @export
 * @param {TemplatesManager} templatesManager
 * @param {*} args
 * @returns
 */
export function run(this: Config, args: any) {

    let config = this,
        user_dir = config.user_dir,
        templates_dir = config.templates_dir
    
    if (!user_dir)
        config.user_dir = user_dir = getUserDir()
    
    let jar_file = path.join(user_dir, 'fbsgen.jar')
    if (!fs.existsSync(jar_file)) {
        showError('The file does not exist: ' + jar_file)
        return
    }

    if (!templates_dir) {
        config.templates_dir = templates_dir = mkdirIfNotExist(user_dir, 'fbsgen-templates')
    } else if (!fs.statSync(templates_dir).isDirectory()) {
        showError('The dir does not exist: ' + templates_dir)
        return
    }

    let destDir: string
    if (!args) {
        destDir = vscode.workspace.rootPath
    } else {
        destDir = getParentDirIfFile(args.fsPath)
    }

    // show the list of available templates.
    vscode.window.showQuickPick(listDirs(templates_dir)).then(selection => {

        // nothing selected. cancel
        if (!selection) {
            return
        }

        // ask for filename
        let inputOptions = <vscode.InputBoxOptions>{
            prompt: 'Enter name ' + JSON.stringify(selection),
            value: destDir
        }

        vscode.window.showInputBox(inputOptions).then(filename => {
            if (!filename)
                return
            
            exec(`cd ${destDir} && echo TODO`, function(error, stdout, stderr) {
                if (error)
                    showError(String(stderr))
            });
        })
    })
}

function listDirs(dir: string): Promise<string[]> {
	return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            let dirs: string[] = []
            for (let f of files) {
                if (fs.statSync(path.join(dir, f)).isDirectory()) {
                    dirs.push(f)
                }
            }
            if (!dirs.length)
                showError('No dirs found in ' + dir)

            resolve(dirs)
        })
	})
}
