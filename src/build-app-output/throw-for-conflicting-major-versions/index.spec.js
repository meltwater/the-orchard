import ac from 'argument-contracts';
import { throwForConflictingMajorVersions } from './index';

describe('Throw for conflicting major versions', () => {
    beforeEach(() => {
        spyOn(ac, 'assertArray');
    });

    it('should assert dependencies is an array', () => {
        const dependencies = [
            {
                packageName: 'yupyup',
                version: '0.0.0'
            }
        ];

        throwForConflictingMajorVersions({ dependencies, dependencyMap: {} });

        expect(ac.assertArray).toHaveBeenCalledWith(dependencies, 'dependencies');
    });

    it('should throw if there are two major versions of a package that conflicts', () => {
        const conflictingPackage = 'ruh-ruh-no-worky';
        const dependencies = [
            {
                packageName: conflictingPackage,
                version: '0.0.0'
            },
            {
                packageName: conflictingPackage,
                version: '1.0.0'
            },
        ];
        const dependencyMap = {
            [conflictingPackage]: {
                hasConflictWithMajorVersion: () => true
            }
        };

        expect(() => throwForConflictingMajorVersions({ dependencies, dependencyMap })).toThrowError(/conflict/);
    });

    it('should NOT throw if there are no conflicts', () => {
        const dependencies = [
            {
                packageName: 'completely-safe',
                version: '0.0.0'
            },
            {
                packageName: 'much-safe-will-pass',
                version: '1.0.0'
            },
        ];

        const dependencyMap = {
            [dependencies[0].packageName]: {
                hasConflictWithMajorVersion: () => true
            }
        }

        expect(() => throwForConflictingMajorVersions({ dependencies, dependencyMap })).not.toThrowError();
    });
});
