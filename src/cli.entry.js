#!/usr/bin/env node
require = require('esm')(module, { // eslint-disable-line no-global-assign
    mode: 'auto'
});
module.exports = require('./cli');