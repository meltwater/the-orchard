import { adjustOrderBasedOnChildDependencies } from './index';
import * as NpmDependencyWithChildDependenciesModule from '../npm-dependency-with-child-dependencies';
import { Logger } from '../../logger';

describe('adjusting ordering based on child dependencies', () => {
    let options;

    beforeEach(() => {
        options = {
            npmDependenciesWithChildDependencies: []
        }
    });

    it('should return same input if previousHash and new hash are the same', () => {
        const npmDependenciesWithChildDependencies = 'Yay hooray!';
        const previousHash = JSON.stringify(npmDependenciesWithChildDependencies);

        expect(adjustOrderBasedOnChildDependencies({
            npmDependenciesWithChildDependencies,
            previousHash
        })).toEqual(npmDependenciesWithChildDependencies);
    });

    it('should throw a warning and return current array if max of 50 iterations is reached', () => {
        spyOn(Logger, 'warn');
        spyOn(NpmDependencyWithChildDependenciesModule, 'NpmDependencyWithChildDependencies').and.callFake(function (x) {
            return {
                ...x,
                somethingDifferent: new Date()
            };
        });

        expect(adjustOrderBasedOnChildDependencies({
            npmDependenciesWithChildDependencies: [
                {
                    depth: 0,
                    packageName: 'should end up last',
                    childDependencies: [
                        {
                            packageName: 'should end up first',
                            version: '1.2.3'
                        }
                    ]
                },
                {
                    depth: 0,
                    packageName: 'should end up first',
                    version: '1.2.3',
                    childDependencies: []
                }
            ]
        })).toEqual(jasmine.any(Array));

        expect(Logger.warn).toHaveBeenCalledTimes(1);
    });

    it('should put a child dependency ahead of a the child dependencies parent in the final array', () => {
        expect(adjustOrderBasedOnChildDependencies({
            npmDependenciesWithChildDependencies: [
                {
                    depth: 0,
                    packageName: 'should end up last',
                    childDependencies: [
                        {
                            packageName: 'should end up first',
                            version: '1.2.3'
                        }
                    ]
                },
                {
                    depth: 0,
                    packageName: 'should end up first',
                    version: '1.2.3',
                    childDependencies: []
                }
            ]
        })).toEqual([
            jasmine.objectContaining({
                packageName: 'should end up first',
            }),
            jasmine.objectContaining({
                packageName: 'should end up last',
            })
        ]);
    });

    it('should put a child dependency ahead of a the child dependencies parent in the final array even if minor and patch versions do not match', () => {
        expect(adjustOrderBasedOnChildDependencies({
            npmDependenciesWithChildDependencies: [
                {
                    depth: 0,
                    packageName: 'should end up last',
                    childDependencies: [
                        {
                            packageName: 'should end up first',
                            version: '1.99.20000'
                        }
                    ]
                },
                {
                    depth: 0,
                    packageName: 'should end up first',
                    version: '1.2.3',
                    childDependencies: []
                }
            ]
        })).toEqual([
            jasmine.objectContaining({
                packageName: 'should end up first',
            }),
            jasmine.objectContaining({
                packageName: 'should end up last',
            })
        ]);
    });
});