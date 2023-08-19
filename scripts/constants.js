const fs = require('fs');
const path = require('path');

const APP_ENV_PREFIX = /^ZEEP_APP_/i;

const ROOT_DIR = fs.realpathSync(path.resolve(__dirname, '..'));
const SCRIPTS_DIR = path.resolve(ROOT_DIR, 'scripts');
const CURRENT_DIR = fs.realpathSync(process.cwd());

module.exports = {
    APP_ENV_PREFIX,

    ROOT_DIR,
    SCRIPTS_DIR,
    CURRENT_DIR,
};
