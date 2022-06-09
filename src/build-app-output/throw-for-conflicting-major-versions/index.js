import ac from 'argument-contracts';

export function throwForConflictingMajorVersions({ dependencies, dependencyMap }) {
    ac.assertArray(dependencies, 'dependencies');

    const packageMajorVersionMap = {};
    dependencies.forEach(dependency => {
        const majorVersion = dependency.version.replace(/\.\d+\.\d+$/, '');
        if(packageMajorVersionMap[dependency.packageName] &&
            dependencyMap[dependency.packageName] &&
            dependencyMap[dependency.packageName].hasConflictWithMajorVersion(parseInt(majorVersion))) {

            throw new Error(`A package has two major versions in conflict! ${dependency.packageName}. Two versions: ${dependency.version} AND ${packageMajorVersionMap[dependency.packageName].version}`);
        }
        packageMajorVersionMap[dependency.packageName] = dependency;
    });
}