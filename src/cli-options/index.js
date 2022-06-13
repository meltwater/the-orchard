import ac from 'argument-contracts';
import { LOGGING_LEVEL } from '../logger';

export const DO_NOT_INJECT = '**%%DO_NOT_INJECT%%**';

export class CliOptions {
    constructor({
        dependencyDirectory,
        injectFile = DO_NOT_INJECT,
        logging,
        openFileLimit,
        orchardInjectString,
        outputFile,
        pathToPackageJson = 'package.json',
        retryOpenFileSleepDuration
    }) {
        ac.assertString(injectFile, 'injectFile');
        ac.assertString(dependencyDirectory, 'dependencyDirectory');
        ac.assertNumber(openFileLimit, 'openFileLimit');
        ac.assertString(orchardInjectString, 'orchardInjectString');
        ac.assertString(outputFile, 'outputFile');
        ac.assertString(pathToPackageJson, 'pathToPackageJson');
        ac.assertNumber(retryOpenFileSleepDuration, 'retryOpenFileSleepDuration');

        let safeLogging = LOGGING_LEVEL.STANDARD;
        if(LOGGING_LEVEL.isValid(logging)) {
            safeLogging = logging;
        }

        this.dependencyDirectory = dependencyDirectory;
        this.injectFile = injectFile;
        this.logging = safeLogging;
        this.openFileLimit = openFileLimit;
        this.orchardInjectString = orchardInjectString;
        this.outputFile = outputFile;
        this.pathToPackageJson = pathToPackageJson;
        this.retryOpenFileSleepDuration = retryOpenFileSleepDuration;

        Object.freeze(this);
    }
}
