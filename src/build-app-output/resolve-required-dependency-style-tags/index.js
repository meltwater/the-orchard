import ac from 'argument-contracts';
import { buildStyleTags } from './build-style-tags';

export function resolveRequiredDependencyStyleTags({ dependencies, dependencyMap }) {
    ac.assertType(dependencies, Object, 'dependencies');
    ac.assertType(dependencyMap, Object, 'dependencyMap');

    return dependencies.reduce((tagsArray, dependency) => {
        if(dependencyMap[dependency.packageName]) {
            const dependencyStyleTags = buildStyleTags({
                externalPackageEntry: dependencyMap[dependency.packageName],
                version: dependency.version
            });

            return tagsArray.concat(dependencyStyleTags);
        }
        return tagsArray;
    }, []);
}