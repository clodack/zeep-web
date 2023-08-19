#!/usr/bin/env node

/* eslint-env node */

import fs from 'fs';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

import { ROOT_DIR, SCRIPTS_DIR } from './constants.js';
import { resolveByCurentDir, resolveByRootDir } from './utils.mjs';

/**
 * 
 * @param {string} envName 
 * @param {string|undefined} envTarget 
 */
export function injectEnv(
    envName = process.env.NODE_ENV,
    envTarget = process.env.ENV_TARGET ?? process.env.npm_package_config_dotenv_target,
) {
    if (envTarget) {
        injectEnvFiles(`.env-${envTarget}`, envName);
    }

    console.log('____aaaaaaaaaaaaaaa________')

    injectEnvFiles('.env', envName);
}

/**
 * 
 * @param {string} fileName 
 * @param {string} envName 
 */
function injectEnvFiles(fileName, envName) {
    const rootEnvPath = resolveByRootDir(fileName);
    const envPath = resolveByCurentDir(fileName);

    const envFiles = [
        envName && `${envPath}.${envName}.local`,
        envName && `${envPath}.${envName}`,
        `${envPath}.local`,
        `${envPath}`,
        envName && `${rootEnvPath}.${envName}.local`,
        envName && `${rootEnvPath}.${envName}`,
        `${rootEnvPath}.local`,
        `${rootEnvPath}`,
    ].filter(Boolean);

    envFiles.forEach((envFile) => {
        if (fs.existsSync(envFile)) {
            dotenvExpand.expand(dotenv.config({ path: envFile }));
        }
    });
}