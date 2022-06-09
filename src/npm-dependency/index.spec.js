import ac from 'argument-contracts';
import { NpmDependency } from './index';

describe('NpmDependency', () => {
    let options;

    beforeEach(() => {
        options = {
            depth: 3333333,
            packageName: '@thePlace/with-the-thing',
            version: '0.0.1'
        };

        spyOn(ac, 'assertString');
        spyOn(ac, 'assertNumber');
    });

    it('should assert packageName is a string', () => {
        new NpmDependency(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.packageName, 'packageName');
    });

    it('should assert version is a string', () => {
        new NpmDependency(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.version, 'version');
    });

    it('should throw if version is not valid', () => {
        options.version = 'Not at all valid';
        expect(() => new NpmDependency(options)).toThrowError(/semver/);
    });

    it('should assert depth is a number', () => {
        new NpmDependency(options);

        expect(ac.assertNumber).toHaveBeenCalledWith(options.depth, 'depth');
    });

    it('should map options', () => {
        const result = new NpmDependency(options);

        expect(result.depth).toEqual(options.depth);
        expect(result.packageName).toEqual(options.packageName);
        expect(result.version).toEqual(options.version);
    });

    it('should be immutable', () => {
        const result = new NpmDependency(options);

        expect(() => { result.depth = 'YAY!'; }).toThrow();
        expect(() => { result.packageName = 'YAY!'; }).toThrow();
        expect(() => { result.version = 'YAY!'; }).toThrow();
    });

    it('should return true if Dependency is newer version than otherVersion', () => {
        options.version = '1.0.0';
        const dependency = new NpmDependency(options);

        expect(dependency.isOtherPackageNewer('0.0.0')).toBe(false);
    });

    it('should return true if Dependency is newer version than otherVersion', () => {
        options.version = '0.0.0';
        const dependency = new NpmDependency(options);

        expect(dependency.isOtherPackageNewer('0.0.0')).toBe(false);
    });

    it('should return true if Dependency is newer version than otherVersion', () => {
        options.version = '0.0.0';
        const dependency = new NpmDependency(options);

        expect(dependency.isOtherPackageNewer('1.0.0')).toBe(true);
    });
});