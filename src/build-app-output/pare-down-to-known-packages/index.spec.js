import { pareDownToKnownPackages } from './index';
import * as NpmDependencyWithChildDependencies from '../npm-dependency-with-child-dependencies';

describe('paring down array to only known dependencies', () => {
    let options;

    beforeEach(() => {
        options = {
            dependencyMap: {},
            npmDependenciesWithChildDependencies: []
        };

        spyOn(NpmDependencyWithChildDependencies, 'NpmDependencyWithChildDependencies').and.callFake(function (x) { return x; });
    });

    it('should return an array', () => {
        expect(pareDownToKnownPackages(options)).toEqual([]);
    });

    it('should include entries from the dependencyMap', () => {
        const dependencyPackageName = 'oh yeah!';
        expect(pareDownToKnownPackages({
            ...options,
            dependencyMap: {
                [dependencyPackageName]: {}
            },
            npmDependenciesWithChildDependencies: [
                {
                    packageName: dependencyPackageName,
                    childDependencies: []
                }
            ]
        })).toEqual([
            {
                packageName: dependencyPackageName,
                childDependencies: []
            }
        ]);
    });

    it('should remove entires that are not in either map', () => {
        expect(pareDownToKnownPackages({
            ...options,
            npmDependenciesWithChildDependencies: [
                {
                    packageName: 'I do not match anything',
                    childDependencies: []
                }
            ]
        })).toEqual([]);
    });

});

describe('child dependencies', () => {
    let options;

    beforeEach(() => {
        options = {
            dependencyMap: {},
            npmDependenciesWithChildDependencies: [],
            childDependencies: []
        };

        spyOn(NpmDependencyWithChildDependencies, 'NpmDependencyWithChildDependencies').and.callFake(function (x) { return x; });
    });

    it('should include entries from the dependencyMap', () => {
        const dependencyPackageName = 'oh yeah!';
        expect(pareDownToKnownPackages({
            ...options,
            dependencyMap: {
                [dependencyPackageName]: {}
            },
            npmDependenciesWithChildDependencies: [
                {
                    packageName: dependencyPackageName,
                    childDependencies: [
                        {
                            packageName: dependencyPackageName
                        }
                    ]
                }
            ]
        })).toEqual([
            {
                packageName: dependencyPackageName,
                childDependencies: [
                    {
                        packageName: dependencyPackageName
                    }
                ]
            }
        ]);
    });

    it('should remove entires that are not in either map', () => {
        const dependencyPackageName = 'oh yeah!';
        expect(pareDownToKnownPackages({
            ...options,
            dependencyMap: {
                [dependencyPackageName]: {}
            },
            npmDependenciesWithChildDependencies: [
                {
                    packageName: dependencyPackageName,
                    childDependencies: [
                        {
                            packageName: 'I do not match anything'
                        }
                    ]
                }
            ]
        })).toEqual([
            {
                packageName: dependencyPackageName,
                childDependencies: []
            }
        ]);
    });
});