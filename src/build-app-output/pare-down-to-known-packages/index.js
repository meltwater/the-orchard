import { NpmDependencyWithChildDependencies } from '../npm-dependency-with-child-dependencies';

export function pareDownToKnownPackages({
    dependencyMap,
    npmDependenciesWithChildDependencies
}) {
    const paredDown = pareDown({
        dependencyMap,
        npmDependenciesWithChildDependencies
    });
    return paredDown.map(dependency => new NpmDependencyWithChildDependencies({
        ...dependency,
        childDependencies: pareDown({
            dependencyMap,
            npmDependenciesWithChildDependencies: dependency.childDependencies
        })
    }));
}

function pareDown({
    dependencyMap,
    npmDependenciesWithChildDependencies
}) {
    return npmDependenciesWithChildDependencies.filter(npmDependencyWithChildDependencies => {
        if (dependencyMap[npmDependencyWithChildDependencies.packageName]) {
            return true;
        }

        return false;
    });
}