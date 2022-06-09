export const LOGGING_LEVEL = {
    SILENT: 0,
    STANDARD: 10,
    VERBOSE: 15,
    DEBUG: 20
};

LOGGING_LEVEL.isValid = (value) => Object.values(LOGGING_LEVEL).some(loggingLevelValue => loggingLevelValue === value);

let loggingLevel = LOGGING_LEVEL.STANDARD;
export class Logger {
    static setLoggingLevel(requestedLoggingLevel) {
        if(!LOGGING_LEVEL.isValid(requestedLoggingLevel)) {
            throw new Error(`The request logging level is invalid. Passed Value: ${requestedLoggingLevel}`);
        }

        loggingLevel = requestedLoggingLevel;
    }

    static log() {
        if(loggingLevel > LOGGING_LEVEL.SILENT) {
            console.log('LOG:', ...arguments);
        }
    }

    static info() {
        if(loggingLevel >= LOGGING_LEVEL.VERBOSE) {
            console.info('INFO:', ...arguments);
        }
    }

    static warn() {
        if(loggingLevel > LOGGING_LEVEL.SILENT) {
            console.warn('WARN:', ...arguments);
        }
    }

    static error() {
        console.error('ERROR:', ...arguments);
    }

    static debug() {
        if(loggingLevel >= LOGGING_LEVEL.DEBUG) {
            console.debug('DEBUG:', ...arguments);
        }
    }
}