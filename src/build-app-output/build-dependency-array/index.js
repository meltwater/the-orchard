import { Arborist } from '@npmcli/arborist';
import { Logger } from '../../logger';
import { filterToProductionEdges } from '../filter-to-production-edges';
import { NpmDependencyWithChildDependencies } from '../npm-dependency-with-child-dependencies';
import path from 'path';

const MAX_DEPENDENCY_DEPTH = 10;

export async function buildDependencyArray({ currentWorkingDirectory, pathToPackageJson }) {
    const packageLockPath = path.dirname(path.join(currentWorkingDirectory, pathToPackageJson));

    const arborist = new Arborist({
        path: packageLockPath
    });

    const topLevelArboristNode = await arborist.loadVirtual();

    return processDependencyTree({
        arborist,
        currentArboristNode: topLevelArboristNode
    });
}

function processDependencyTree({ currentArboristNode, depth = 0 }) {
    if (depth > MAX_DEPENDENCY_DEPTH) {
        return [];
    }

    const productionEdgesOut = filterToProductionEdges(currentArboristNode.edgesOut);

    let results = [];
    productionEdgesOut.forEach(edge => {
        const nodeCorrespondingToEdge = edge.to;

        let dependency;
        try {
            dependency = NpmDependencyWithChildDependencies.fromArboristEdge({ depth, arboristEdge: edge });
        } catch (error) {
            Logger.debug(`buildDependencyArray->processDependencyTree: Failed to setup dependency for ${edge.name} due to error:`, error, 'edge:', edge);
            return;
        }

        results.push(dependency);

        results = [
            ...results,
            ...processDependencyTree({
                currentArboristNode: nodeCorrespondingToEdge,
                depth: depth + 1
            })
        ];
    });

    return results;
}