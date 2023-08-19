#!/usr/bin/env node

/* eslint-env node */

import { injectEnv } from './env.mjs';
import { executeCommand } from './utils.mjs';

const {
    command = 'env',
    envName,
    envTarget,
} = parseArgs();

if (envName) {
    process.env.NODE_ENV = envName;
}

injectEnv(envName, envTarget);
await executeCommand(command);

function parseArgs() {
    const index = process.argv.indexOf('--');

    const options = process.argv.slice(0, index);
    const command = index > -1 ? process.argv.slice(index + 1).join(' ') : undefined;

    const targetArgPrefix = '--target=';

    const targetArg = options.find(arg => arg.startsWith(targetArgPrefix));
    const envTarget = targetArg ? targetArg.substring(targetArgPrefix.length)  : 'web';

    const envNamePrefix = '--env=';

    const envArg = options.find(arg => arg.startsWith(envNamePrefix));
    let envName = envArg ? envArg.substring(envNamePrefix.length)  : undefined;

    if (!envName) {
        if (options.includes('--dev') > -1) {
            envName = 'development';
        } else if (options.includes('--prod') > -1) {
            envName = 'production';
        } else if (options.includes('--test') > -1) {
            envName = 'test';
        } else {
            envName = process.env.NODE_ENV;
        }
    }

    return {
        envName,
        envTarget,
        command,
    };
}
