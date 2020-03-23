export declare const baseDir: string;
export declare const targetDir: string;
export interface Config {
    templates_dir: string;
    user_dir: string;
    jar_file: string;
}
export declare function newConfig(templates_dir: string): Config;
export declare function getUserDir(): string;
export declare function mkdirIfNotExist(dir: string, dirToCreate: string): string;
export declare function getParentDirIfFile(dir: string): string;
export declare function isDir(f: string): boolean;
export declare function isFile(f: string): boolean;
export declare function listDirs(dir: string): Promise<string[]>;
export declare function listFiles(dir: string): Promise<string[]>;
export declare function list(dir: string, fn: (f: string) => boolean): Promise<string[]>;
