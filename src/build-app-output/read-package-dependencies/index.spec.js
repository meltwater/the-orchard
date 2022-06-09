import ac from 'argument-contracts';
import fs from 'fs';
import { readPackageDependencies } from './index';

describe('read package dependencies', () => {
    beforeEach(() => {
        spyOn(fs, 'existsSync').and.returnValue(true);
        spyOn(fs, 'readFileSync').and.returnValue(JSON.stringify({ dependencies: {} }));
    });

    it('should assert packageFilePath is a string', () => {
        spyOn(ac, 'assertString');
        const packageFilePath = 'all the way home';

        readPackageDependencies(packageFilePath);

        expect(ac.assertString).toHaveBeenCalledWith(packageFilePath);
    });

    it('should throw if package does not have a dependencies property', () => {
        fs.readFileSync.and.returnValue(JSON.stringify({}));

        expect(() => readPackageDependencies('w00t')).toThrowError(/dependencies/);
    });

    it('should return package dependencies', () => {
        const dependencies = {
            all: 'the things!'
        };
        fs.readFileSync.and.returnValue(JSON.stringify({ dependencies }));

        const result = readPackageDependencies('yes yes yes');

        expect(result).toEqual(dependencies);
    });
});