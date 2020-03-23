"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path = require("path");
const fs = require("fs");
const vscode_1 = require("vscode");
exports.baseDir = __dirname;
let ext = vscode_1.extensions.getExtension('dyu.fbsgen-vscode');
exports.targetDir = ext && (ext.extensionPath + '/target') || exports.baseDir;
function newConfig(templates_dir) {
    return {
        templates_dir: '',
        user_dir: '',
        jar_file: ''
    };
}
exports.newConfig = newConfig;
function getUserDir() {
    let dir;
    switch (process.platform) {
        case 'linux':
            dir = path.join(os.homedir(), '.config');
            break;
        case 'darwin':
            dir = path.join(os.homedir(), 'Library', 'Application Support');
            break;
        case 'win32':
            dir = process.env.APPDATA;
            break;
        default:
            throw Error("Unrecognized OS");
    }
    return path.join(dir, 'Code', 'User');
}
exports.getUserDir = getUserDir;
function mkdirIfNotExist(dir, dirToCreate) {
    let newDir = path.join(dir, dirToCreate);
    if (!fs.statSync(newDir).isDirectory())
        fs.mkdirSync(newDir);
    return newDir;
}
exports.mkdirIfNotExist = mkdirIfNotExist;
function getParentDirIfFile(dir) {
    return fs.statSync(dir).isDirectory() ? dir : path.join(dir, '..');
}
exports.getParentDirIfFile = getParentDirIfFile;
function isDir(f) {
    return fs.statSync(f).isDirectory();
}
exports.isDir = isDir;
function isFile(f) {
    return !fs.statSync(f).isDirectory();
}
exports.isFile = isFile;
function listDirs(dir) {
    return list(dir, isDir);
}
exports.listDirs = listDirs;
function listFiles(dir) {
    return list(dir, isFile);
}
exports.listFiles = listFiles;
function list(dir, fn) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            let dirs = [];
            for (let f of files) {
                if (fn(path.join(dir, f))) {
                    dirs.push(f);
                }
            }
            if (!dirs.length)
                vscode_1.window.showErrorMessage('No dirs found in ' + dir);
            resolve(dirs);
        });
    });
}
exports.list = list;
//# sourceMappingURL=config.js.map