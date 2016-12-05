import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'

import { Config, getUserDir, mkdirIfNotExist, getParentDirIfFile, listDirs, listFiles } from '../config'

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
        rootPath = vscode.workspace.rootPath,
        vsconfig = vscode.workspace.getConfiguration('fbsgen'),
        user_dir = config.user_dir,
        override_dir = vsconfig.get('templates_dir', ''),
        templates_dir: string
    
    if (!user_dir)
        config.user_dir = user_dir = getUserDir()
    
    let jar_file = path.join(user_dir, 'fbsgen.jar')
    if (!fs.existsSync(jar_file)) {
        showError('The file does not exist: ' + jar_file)
        return
    }

    if (override_dir) {
        if (!fs.statSync(templates_dir = path.join(rootPath, override_dir)).isDirectory()) {
            showError('The dir does not exist: ' + templates_dir)
            return
        }
        config.templates_dir = templates_dir
    } else if (fs.statSync(templates_dir = path.join(rootPath, 'templates')).isDirectory()) {
        config.templates_dir = templates_dir
    } else if (config.templates_dir) {
        templates_dir = config.templates_dir
    } else {
        config.templates_dir = templates_dir = mkdirIfNotExist(user_dir, 'fbsgen-templates')
    }

    let destDir: string
    if (!args) {
        destDir = rootPath
    } else {
        destDir = getParentDirIfFile(args.fsPath)
    }

    // show the list of available templates.
    vscode.window.showQuickPick(listDirs(templates_dir)).then(selection => {

        // nothing selected. cancel
        if (!selection) {
            return
        }

        // ask for name
        let inputOptions = <vscode.InputBoxOptions>{
            prompt: 'Enter name',
            value: ''
        }

        vscode.window.showInputBox(inputOptions).then(name => {
            if (!name)
                return

            let srcDir = path.join(templates_dir, selection)
            listFiles(srcDir).then((files: string[]) => {
                files.length && exec(buildCliArgs(jar_file, srcDir, destDir, name, files), cbExec);
            })
        })
    })
}

function buildCliArgs(jar_file: string, srcDir: string, destDir: string, name: string, files: string[]) {
    return `java -Dcli.p_block=true -jar ${jar_file} : ${srcDir} ${destDir} name:${name} dot:. : ${files.join(' ')}`
}

function cbExec(error, stdout, stderr) {
    if (error)
        showError(String(stderr))
}


