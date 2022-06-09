import ac from 'argument-contracts';
import { CliOptions, DO_NOT_INJECT } from './index';
import { LOGGING_LEVEL } from '../logger';

describe('cli options', () => {
    let options;
    beforeEach(() => {
        options = {
            dependencyDirectory: 'here/they/are',
            injectFile: 'starting/point/of/file.txt',
            logging: LOGGING_LEVEL.SILENT,
            openFileLimit: 0,
            outputFile: 'places/and/things.txt',
            pathToPackageJson: 'here/be/package.json',
            retryOpenFileSleepDuration: 1,
            usePackagedRegistry: true
        };
    });

    it('should assert dependencyDirectory is a string', () => {
        options.dependencyDirectory = 'YESSSSSSS';
        spyOn(ac, 'assertString');

        new CliOptions(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.dependencyDirectory, 'dependencyDirectory');
    });

    it('should not throw if injectFile is not provided', () => {
        delete options.injectFile;

        expect(() => new CliOptions(options)).not.toThrow();
    });

    it('should default injectFile to DO_NOT_INJECT constant', () => {
        delete options.injectFile;

        const result = new CliOptions(options);

        expect(result.injectFile).toEqual(DO_NOT_INJECT);
    });

    it('should assert injectFile is a string', () => {
        options.injectFile = 'YESSSSSSS';
        spyOn(ac, 'assertString');

        new CliOptions(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.injectFile, 'injectFile');
    });

    it('should validate logging', () => {
        spyOn(LOGGING_LEVEL, 'isValid');

        const logging = 'clearcut';
        new CliOptions({
            ...options,
            logging
        });

        expect(LOGGING_LEVEL.isValid).toHaveBeenCalledWith(logging);
    });

    it('should default logLevel to standard', () => {
        delete options.logging;
        const result = new CliOptions(options);

        expect(result.logging).toEqual(LOGGING_LEVEL.STANDARD);
    });

    it('should assert openFileLimit is a number', () => {
        options.openFileLimit = 'no no no no no no no no no no no no';
        spyOn(ac, 'assertNumber');

        new CliOptions(options);

        expect(ac.assertNumber).toHaveBeenCalledWith(options.openFileLimit, 'openFileLimit');
    });

    it('should assert outputFile is a string', () => {
        options.outputFile = 'YESSSSSSS';
        spyOn(ac, 'assertString');

        new CliOptions(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.outputFile, 'outputFile');
    });

    it('should default pathToPackageJson to "package.json"', () => {
        delete options.pathToPackageJson;
        spyOn(ac, 'assertString');

        const result = new CliOptions(options);

        expect(result.pathToPackageJson).toEqual('package.json');
    });

    it('should assert pathToPackageJson is a string', () => {
        options.pathToPackageJson = 'rightHere/package.json';
        spyOn(ac, 'assertString');

        new CliOptions(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.pathToPackageJson, 'pathToPackageJson');
    });

    it('should not throw if pathToPackageJson is not provided', () => {
        delete options.pathToPackageJson;

        expect(() => new CliOptions(options)).not.toThrow();
    });

    it('should assert retryOpenFileSleepDuration is a boolean', () => {
        options.retryOpenFileSleepDuration = 'do it again!';
        spyOn(ac, 'assertNumber');

        new CliOptions(options);

        expect(ac.assertNumber).toHaveBeenCalledWith(options.retryOpenFileSleepDuration, 'retryOpenFileSleepDuration');
    });

    it('should assert usePackagedRegistry is a boolean', () => {
        options.usePackagedRegistry = 'please do!';
        spyOn(ac, 'assertBoolean');

        new CliOptions(options);

        expect(ac.assertBoolean).toHaveBeenCalledWith(options.usePackagedRegistry, 'usePackagedRegistry');
    });

    it('should default usePackagedRegistry to false', () => {
        delete options.usePackagedRegistry;

        const result = new CliOptions(options);

        expect(result.usePackagedRegistry).toEqual(false);
    });

    it('should map options', () => {
        const result = new CliOptions(options);

        expect(result).toEqual(jasmine.objectContaining(options));
    });

    it('should be immutable', () => {
        const result = new CliOptions(options);

        expect(() => { result.logging = 'arbor day'; }).toThrow();
    });
});
