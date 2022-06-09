import ac from 'argument-contracts';
import { Logger } from '../../logger';
import { NpmDependency } from '../../npm-dependency';
import semver from 'semver';

const DELIMITER = '%%%';
export function rollupLatestMajorVersions(dependencies) {
    ac.assertArrayOf(dependencies, NpmDependency, 'dependencies');

    Logger.debug('rollupLatestMajorVersions: dependencies: ', dependencies);

    const packageAndMajorVersionMap = {};
    dependencies.forEach(dependency => {
        const majorVersion = dependency.version.replace(/\.\d+\.\d+/, '');
        const packageAndMajorVersionKey = `${dependency.packageName}${DELIMITER}${majorVersion}`;
        if (!packageAndMajorVersionMap[packageAndMajorVersionKey]) {
            packageAndMajorVersionMap[packageAndMajorVersionKey] = dependency;
        } else {
            const currentEntry = packageAndMajorVersionMap[packageAndMajorVersionKey];
            const updatedVersion = { ...currentEntry };
            if (semver.gt(dependency.version, currentEntry.version)) {
                updatedVersion.version = dependency.version;
                updatedVersion.childDependencies = dependency.childDependencies;
            }
            if (dependency.depth > currentEntry.depth) {
                updatedVersion.depth = dependency.depth;
            }
            packageAndMajorVersionMap[packageAndMajorVersionKey] = updatedVersion;
        }
    });

    const remainingDependencies = Object.keys(packageAndMajorVersionMap).map(key => packageAndMajorVersionMap[key]);

    Logger.debug('rollupLatestMajorVersions-end: remainingDependencies: ', JSON.stringify(dependencies, null, 2));

    return remainingDependencies;
}
