import sywac from 'sywac';
import { ORCHARD_INJECT_STRING } from '../constants';
import { CliOptions } from '../cli-options';
import { buildAppOutput } from '../build-app-output';
import { Logger, LOGGING_LEVEL } from '../logger';

Logger.setLoggingLevel(LOGGING_LEVEL.DEBUG);

const loggingChoices = ['standard', 'silent', 'verbose', 'debug'];
const loggingMap = {
    [loggingChoices[0]]: LOGGING_LEVEL.STANDARD,
    [loggingChoices[1]]: LOGGING_LEVEL.SILENT,
    [loggingChoices[2]]: LOGGING_LEVEL.VERBOSE,
    [loggingChoices[3]]: LOGGING_LEVEL.DEBUG // eslint-disable-line no-magic-numbers
};

sywac
    .enumeration('--logging', {
        desc: 'Level of logging messages you would like to see',
        defaultValue: 'standard',
        choices: loggingChoices
    })
    .string('-d, --dependencyDirectory', {
        desc: 'Path to directory for all dependency yaml files',
        defaultValue: 'orchard'
    })
    .string('-o, --outputFile', {
        desc: 'The file for output'
    })
    .string('-i, --injectFile', {
        desc: `The file to inject script tags into. Replaces well known string "${ORCHARD_INJECT_STRING}"`
    })
    .string('-s, --orchardInjestString', {
        desc: 'The string in your index file to be replaced with script tags.',
        defaultValue: ORCHARD_INJECT_STRING
    })
    .number('--openFileLimit', {
        desc: 'The maximum number of files to have open when doing many simultaneous operations (e.g. reading package.json files)',
        defaultValue: 4000
    })
    .string('-p, --pathToPackageJson', {
        desc: 'The path to the package.json file to build the orchard output for',
        defaultValue: 'package.json'
    })
    .number('--retryOpenFileSleepDuration', {
        desc: 'How long to wait (in milliseconds) before retrying when openFileLimit has been reached',
        defaultValue: 2000
    })
    .help('-h, --help')
    .parseAndExit()
    .then(options => ({ ...options, logging: loggingMap[options.logging] }))
    .then(options => new CliOptions(options))
    .then(cliOptions => buildAppOutput(cliOptions))
    .catch(error => {
        Logger.error(error);
        process.exitCode = 1;
    });
