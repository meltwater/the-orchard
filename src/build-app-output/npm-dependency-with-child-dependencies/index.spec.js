import ac from 'argument-contracts';
import { Edge as ArboristEdge } from '@npmcli/arborist';
import * as FilterToProductionEdgesModule from '../filter-to-production-edges';
import { NpmDependencyWithChildDependencies } from './index';
import { ChildDependency } from './child-dependency';

describe('NpmDependencyWithChildDependencies', () => {
    let options;

    beforeEach(() => {
        options = {
            depth: 3333333,
            childDependencies: [
                'yay',
                'boo'
            ],
            packageName: '@thePlace/with-the-thing',
            version: '0.0.1'
        };

        spyOn(ac, 'assertArrayOf');
        spyOn(ac, 'assertNumber');
        spyOn(ac, 'assertString');
        spyOn(ac, 'assertType');
    });

    it('should assert packageName is a string', () => {
        new NpmDependencyWithChildDependencies(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.packageName, 'packageName');
    });

    it('should assert childDependencies are all of type ChildDependency', () => {
        new NpmDependencyWithChildDependencies(options);

        expect(ac.assertArrayOf).toHaveBeenCalledWith(options.childDependencies, ChildDependency, 'childDependencies');
    });

    it('should assert version is a string', () => {
        new NpmDependencyWithChildDependencies(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.version, 'version');
    });

    it('should throw if version is not valid', () => {
        options.version = 'Not at all valid';
        expect(() => new NpmDependencyWithChildDependencies(options)).toThrowError(/semver/);
    });

    it('should assert depth is a number', () => {
        new NpmDependencyWithChildDependencies(options);

        expect(ac.assertNumber).toHaveBeenCalledWith(options.depth, 'depth');
    });

    it('should map options', () => {
        const result = new NpmDependencyWithChildDependencies(options);

        expect(result.depth).toEqual(options.depth);
        expect(result.packageName).toEqual(options.packageName);
        expect(result.version).toEqual(options.version);
    });

    it('should be immutable', () => {
        const result = new NpmDependencyWithChildDependencies(options);

        expect(() => { result.depth = 'YAY!'; }).toThrow();
        expect(() => { result.packageName = 'YAY!'; }).toThrow();
        expect(() => { result.version = 'YAY!'; }).toThrow();
    });

    it('should return true if Dependency is newer version than otherVersion', () => {
        options.version = '1.0.0';
        const dependency = new NpmDependencyWithChildDependencies(options);

        expect(dependency.isOtherPackageNewer('0.0.0')).toBe(false);
    });

    it('should return true if Dependency is newer version than otherVersion', () => {
        options.version = '0.0.0';
        const dependency = new NpmDependencyWithChildDependencies(options);

        expect(dependency.isOtherPackageNewer('0.0.0')).toBe(false);
    });

    it('should return true if Dependency is newer version than otherVersion', () => {
        options.version = '0.0.0';
        const dependency = new NpmDependencyWithChildDependencies(options);

        expect(dependency.isOtherPackageNewer('1.0.0')).toBe(true);
    });

    describe('fromArboristEdge', () => {
        let fromArboristEdgeOptions;

        beforeEach(() => {
            fromArboristEdgeOptions = {
                depth: 0,
                arboristEdge: {
                    name: 'yay',
                    spec: '1.2.3',
                    to: {
                        edgesOut: new Map()
                    }
                }
            };

            spyOn(FilterToProductionEdgesModule, 'filterToProductionEdges').and.returnValue([]);
        });

        it('should validate that provided depth is a number', () => {
            NpmDependencyWithChildDependencies.fromArboristEdge(fromArboristEdgeOptions);

            expect(ac.assertNumber).toHaveBeenCalledWith(fromArboristEdgeOptions.depth, 'depth')
        });

        it('should validate that provided arboristEdge is an Edge', () => {
            NpmDependencyWithChildDependencies.fromArboristEdge(fromArboristEdgeOptions);

            expect(ac.assertType).toHaveBeenCalledWith(fromArboristEdgeOptions.arboristEdge, ArboristEdge, 'arboristEdge');
        });

        it('should map the arborist edge and depth to NpmDependencyWithChildDependencies options', () => {
            const result = NpmDependencyWithChildDependencies.fromArboristEdge(fromArboristEdgeOptions);

            expect(result.depth).toBe(fromArboristEdgeOptions.depth);
            expect(result.packageName).toBe(fromArboristEdgeOptions.arboristEdge.name);
            expect(result.version).toBe(fromArboristEdgeOptions.arboristEdge.spec);
        });

        it('should map all arboristEdge child dependencies into NpmDependencyWithChildDependencies', () => {
            const childDependencyOne = {
                name: 'child dependency number one',
                spec: '1.2.3'
            };
            const childDependencyTwo = {
                name: 'second child dependency',
                spec: '3.4.5'
            };

            FilterToProductionEdgesModule.filterToProductionEdges.and.returnValue([
                childDependencyOne,
                childDependencyTwo
            ]);

            const result = NpmDependencyWithChildDependencies.fromArboristEdge(fromArboristEdgeOptions);

            expect(result.childDependencies).toEqual([
                jasmine.objectContaining({
                    packageName: childDependencyOne.name,
                    version: childDependencyOne.spec
                }),
                jasmine.objectContaining({
                    packageName: childDependencyTwo.name,
                    version: childDependencyTwo.spec
                })
            ])
        });
    });
});