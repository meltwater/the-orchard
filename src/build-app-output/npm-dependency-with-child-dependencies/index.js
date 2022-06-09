import ac from 'argument-contracts';
import { coerceVersion } from './coerce-version';
import { Edge as ArboristEdge } from '@npmcli/arborist';
import { filterToProductionEdges } from '../filter-to-production-edges';
import { Logger } from '../../logger';
import semver from 'semver';
import { ChildDependency } from './child-dependency';

export class NpmDependencyWithChildDependencies {
    constructor({ depth, childDependencies = [], packageName, version }) {
        ac.assertNumber(depth, 'depth');
        ac.assertArrayOf(childDependencies, ChildDependency, 'childDependencies');
        ac.assertString(packageName, 'packageName');
        ac.assertString(version, 'version');

        const safeVersion = coerceVersion(version);
        if (safeVersion === null) {
            throw new Error(`The version provided is not valid semver. Package name: ${packageName} Provided version: ${version}`);
        }

        Logger.debug(`NpmDependency: ${packageName} - Depth: ${depth} - Version: ${version} - ${safeVersion}`);

        this.depth = depth;
        this.childDependencies = childDependencies;
        this.packageName = packageName;
        this.version = safeVersion;

        Object.freeze(this);
    }

    static fromArboristEdge({ depth, arboristEdge }) {
        ac.assertNumber(depth, 'depth');
        ac.assertType(arboristEdge, ArboristEdge, 'arboristEdge');

        const childDependencies = filterToProductionEdges(arboristEdge.to.edgesOut)
            .map(edge => new ChildDependency({
                packageName: edge.name,
                version: edge.spec
            }));

        return new NpmDependencyWithChildDependencies({
            depth,
            packageName: arboristEdge.name,
            version: arboristEdge.spec,
            childDependencies
        });
    }

    isOtherPackageNewer(otherVersion) {
        return semver.lt(this.version, otherVersion);
    }
}