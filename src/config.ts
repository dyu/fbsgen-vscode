import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'

export interface Config {
    templates_dir: string
    user_dir: string
    jar_file: string
}

export function newConfig(templates_dir: string): Config {
    return {
        templates_dir: '',
        user_dir: '',
        jar_file: ''
    }
}

export function getUserDir(): string {
    let dir: string

    switch (process.platform) {
        case 'linux':
            dir = path.join(os.homedir(), '.config')
            break
        case 'darwin':
            dir = path.join(os.homedir(), 'Library', 'Application Support')
            break
        case 'win32':
            dir = process.env.APPDATA
            break
        default:
            throw Error("Unrecognized OS")
    }

    return path.join(dir, 'Code', 'User')
}

export function mkdirIfNotExist(dir: string, dirToCreate: string): string {
    let newDir = path.join(dir, dirToCreate)
    if (!fs.statSync(newDir).isDirectory())
        fs.mkdirSync(newDir)

    return newDir
}

export function getParentDirIfFile(dir: string): string {
    return fs.statSync(dir).isDirectory() ? dir : path.join(dir, '..')
}