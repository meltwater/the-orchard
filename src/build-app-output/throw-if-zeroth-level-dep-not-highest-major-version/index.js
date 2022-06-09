import { orderDependenciesDescending } from '../order-dependencies-descending';
import semver from 'semver';

export function throwIfZerothLevelDepNotHighestMajorVersion(dependencies) {
    const orderedDeps = orderDependenciesDescending(dependencies);

    const packageMap = {};
    orderedDeps.forEach(dependency => {
        if(!packageMap[dependency.packageName]) {
            packageMap[dependency.packageName] = dependency;
        }

        if(dependency.depth === 0 && semver.gt(packageMap[dependency.packageName].version, dependency.version)) {
            throw new RangeError(`${dependency.packageName} is a direct dependency but is NOT the highest major version! Other major version found: ${packageMap[dependency.packageName].version}`);
        } else if(semver.lt(packageMap[dependency.packageName].version, dependency.version)) {
            packageMap[dependency.packageName] = dependency;
        }
    });
}
