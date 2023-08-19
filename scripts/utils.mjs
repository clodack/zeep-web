import { spawn } from 'node:child_process';
import path from 'path';

import { CURRENT_DIR, ROOT_DIR } from './constants.js';

/**
 * 
 * @param {string} relativePath
 * @return {string} 
 */
export function resolveByCurentDir(relativePath) {
    return path.resolve(CURRENT_DIR, relativePath);
}

/**
 * 
 * @param {string} relativePath
 * @return {string} 
 */
export function resolveByRootDir(relativePath) {
    return path.resolve(ROOT_DIR, relativePath);
}

/**
 * 
 * @param {string} command 
 * @param {{cwd?: string, noExit?: boolean}} options 
 * @return {Promise<number>}
 */
export function executeCommand(command, options = {}) {
    const { cwd, noExit } = options;

    let result = new Promise((resolve, reject) => {
        const process = spawn(command, { shell: true, stdin: 'inherit', cwd });

        process.stdout.on('data', (data) => {
            console.log(data.toString());
        });
        
        process.on('error', reject);
        process.on('close', resolve);
    });

    if (!noExit) {
        result = result.then((code) => {
            if (!Number.isNaN(code) && code !== 0) {
                console.error('Error execute command!');
                process.exit(code);
            }

            return code;
        });
    }

    return result;
}
