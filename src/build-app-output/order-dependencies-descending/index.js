import ac from 'argument-contracts';
import { NpmDependency } from '../../npm-dependency';
import { Logger } from '../../logger';

export function orderDependenciesDescending(dependencies) {
    ac.assertArrayOf(dependencies, NpmDependency, 'dependencies');

    const copyOfDependencies = [ ...dependencies ];

    const orderedDeps = copyOfDependencies.sort((left, right) => right.depth - left.depth);

    Logger.debug(`orderDependenciesDescending: ordered: ${JSON.stringify(orderedDeps, null, 2)}`);

    return orderedDeps;
}
