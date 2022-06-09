import ac from 'argument-contracts';
import { NpmDependency } from '../../npm-dependency';
import { rollupLatestMajorVersions } from './index';
import { Logger } from '../../logger';

describe('rollup latest major versions', () => {
    beforeEach(() => {
        spyOn(ac, 'assertArrayOf');
        spyOn(Logger, 'debug');
    });

    it('should assert dependencies is an array of NpmDependency', () => {
        const dependencies = [{
            packageName: 'wooooooo',
            version: '0.0.0',
            depth: 0
        }];

        rollupLatestMajorVersions(dependencies);

        expect(ac.assertArrayOf).toHaveBeenCalledWith(dependencies, NpmDependency, 'dependencies');
    });

    it('should keep highest version of same major dependencies', () => {
        const dependencies = [
            {
                packageName: 'wooooooo',
                version: '0.0.0',
                depth: 0
            },
            {
                packageName: 'wooooooo',
                version: '0.0.1',
                depth: 0
            },
            {
                packageName: 'wooooooo',
                version: '0.1.0',
                depth: 0
            },
        ];

        const result = rollupLatestMajorVersions(dependencies);

        expect(result).toEqual([
            jasmine.objectContaining({
                version: dependencies[2].version
            })
        ]);
    });

    it('should keep child dependencies of the highest version of same major dependencies', () => {
        const dependencies = [
            {
                packageName: 'wooooooo',
                version: '0.0.0',
                depth: 0,
                childDependencies: ['yay']
            },
            {
                packageName: 'wooooooo',
                version: '0.0.1',
                depth: 0,
                childDependencies: ['boo']
            },
            {
                packageName: 'wooooooo',
                version: '0.1.0',
                depth: 0,
                childDependencies: ['take me!']
            },
        ];

        const result = rollupLatestMajorVersions(dependencies);

        expect(result).toEqual([
            jasmine.objectContaining({
                childDependencies: dependencies[2].childDependencies
            })
        ]);
    });

    it('should keep deepest value for dependencies', () => {
        const dependencies = [
            {
                packageName: 'wooooooo',
                version: '0.0.0',
                depth: 0
            },
            {
                packageName: 'wooooooo',
                version: '0.0.0',
                depth: 1
            },
            {
                packageName: 'wooooooo',
                version: '0.0.0',
                depth: 2
            },
        ];

        const result = rollupLatestMajorVersions(dependencies);

        expect(result).toEqual([
            jasmine.objectContaining({
                depth: dependencies[2].depth
            })
        ]);
    });

    it('should keep deepest value and highest version for dependencies', () => {
        const dependencies = [
            {
                packageName: 'wooooooo',
                version: '0.0.1',
                depth: 0
            },
            {
                packageName: 'wooooooo',
                version: '0.0.0',
                depth: 1
            },
            {
                packageName: 'wooooooo',
                version: '0.0.0',
                depth: 2
            },
        ];

        const result = rollupLatestMajorVersions(dependencies);

        expect(result).toEqual([
            jasmine.objectContaining({
                depth: dependencies[2].depth,
                version: dependencies[0].version
            })
        ]);
    });

    it('should keep deepest value and highest version for dependencies', () => {
        const dependencies = [
            {
                packageName: 'wooooooo',
                version: '0.0.1',
                depth: 0
            },
            {
                packageName: 'wooooooo',
                version: '0.0.0',
                depth: 1
            },
            {
                packageName: 'wooooooo',
                version: '0.0.0',
                depth: 2
            },
        ];

        const result = rollupLatestMajorVersions(dependencies);

        expect(result).toEqual([
            jasmine.objectContaining({
                depth: dependencies[2].depth,
                version: dependencies[0].version
            })
        ]);
    });

    it('should keep all major versions', () => {
        const dependencies = [
            {
                packageName: 'wooooooo',
                version: '0.0.1',
                depth: 0
            },
            {
                packageName: 'wooooooo',
                version: '1.0.0',
                depth: 1
            },
            {
                packageName: 'wooooooo',
                version: '0.0.0',
                depth: 2
            },
        ];

        const result = rollupLatestMajorVersions(dependencies);

        expect(result).toEqual([
            jasmine.objectContaining({
                depth: dependencies[2].depth,
                version: dependencies[0].version,
            }),
            jasmine.objectContaining({
                depth: dependencies[1].depth,
                version: dependencies[1].version
            })
        ]);
    });

    it('should keep deepest value and highest version for multiple dependencies', () => {
        const dependencies = [
            {
                packageName: 'wooooooo',
                version: '0.0.1',
                depth: 0
            },
            {
                packageName: 'wooooooo',
                version: '0.0.0',
                depth: 1
            },
            {
                packageName: 'wooooooo',
                version: '0.0.0',
                depth: 2
            },
            {
                packageName: 'ahhhhhhhh',
                version: '0.0.0',
                depth: 0
            },
            {
                packageName: 'ahhhhhhhh',
                version: '0.0.9',
                depth: 1
            },
            {
                packageName: 'ahhhhhhhh',
                version: '0.0.0',
                depth: 2
            },
        ];

        const result = rollupLatestMajorVersions(dependencies);

        expect(result).toEqual([
            jasmine.objectContaining({
                packageName: dependencies[0].packageName,
                depth: dependencies[2].depth,
                version: dependencies[0].version
            }),
            jasmine.objectContaining({
                packageName: dependencies[3].packageName,
                depth: dependencies[5].depth,
                version: dependencies[4].version
            })
        ]);
    });
});
