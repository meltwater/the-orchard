import { buildDependencyArray } from '.';
import * as ArboristModule from '@npmcli/arborist';
import * as NpmDependencyWithChildDependenciesModule from '../npm-dependency-with-child-dependencies';
import { Logger } from '../../logger';

describe('using arborist to build dependency array', () => {
    let fakeArborist;
    let noDependencyNode;
    let options;

    beforeEach(() => {
        fakeArborist = {
            loadVirtual: jasmine.createSpy('loadVirtual')
        }

        noDependencyNode = {
            edgesOut: new Map()
        };

        options = {
            currentWorkingDirectory: process.cwd(),
            pathToPackageJson: 'package.json'
        };

        fakeArborist.loadVirtual.and.resolveTo(noDependencyNode);

        spyOn(ArboristModule, 'Arborist').and.returnValue(fakeArborist);
        spyOn(NpmDependencyWithChildDependenciesModule.NpmDependencyWithChildDependencies, 'fromArboristEdge').and.callFake(({ depth, arboristEdge }) => ({
            depth,
            packageName: arboristEdge.name,
            version: arboristEdge.spec
        }));
        spyOn(Logger, 'debug');
    });

    it('should use the current working directory plus path to package json to initialize Arborist', async () => {
        await buildDependencyArray({
            currentWorkingDirectory: process.cwd(),
            pathToPackageJson: 'hello/package.json'
        });

        expect(ArboristModule.Arborist).toHaveBeenCalledWith({
            path: `${process.cwd()}/hello`
        });
    });

    it('should return an empty array if there are no dependencies', async () => {
        const result = await buildDependencyArray(options);

        expect(result).toEqual([]);
    });

    it('should not look any deeper that 10 deps deep to avoid infinite looping', async () => {
        const nodeWithOneEdgeOut = {
            edgesOut: new Map()
        };
        nodeWithOneEdgeOut.edgesOut.set('oh-yea', {
            name: 'oh-yea',
            spec: '1.2.3',
            to: nodeWithOneEdgeOut,
            type: 'prod'
        });
        fakeArborist.loadVirtual.and.resolveTo(nodeWithOneEdgeOut);

        const result = await buildDependencyArray(options);

        expect(result[10].depth).toBe(10);
    });

    it('should map edge to npm dependency', async () => {
        const nodeWithOneEdgeOut = {
            edgesOut: new Map()
        };
        const oneEdge = {
            name: 'oh-yea',
            spec: '1.2.3',
            to: {
                edgesOut: new Map()
            },
            type: 'prod'
        };
        nodeWithOneEdgeOut.edgesOut.set('oh-yea', oneEdge);
        fakeArborist.loadVirtual.and.resolveTo(nodeWithOneEdgeOut);

        const result = await buildDependencyArray(options);

        expect(result[0].packageName).toEqual(oneEdge.name);
        expect(result[0].version).toEqual(oneEdge.spec);
    });

    it('should exclude dev edges edge to npm dependency', async () => {
        const nodeWithOneEdgeOut = {
            edgesOut: new Map()
        };
        const oneEdge = {
            name: 'oh-yea',
            spec: '1.2.3',
            to: {
                edgesOut: new Map()
            },
            type: 'prod'
        };
        nodeWithOneEdgeOut.edgesOut.set('oh-yea', oneEdge);
        fakeArborist.loadVirtual.and.resolveTo(nodeWithOneEdgeOut);

        const result = await buildDependencyArray(options);

        expect(result[0].packageName).toBe(oneEdge.name);
        expect(result[0].version).toBe(oneEdge.spec);
        expect(result[0].depth).toBe(0);
    });
});