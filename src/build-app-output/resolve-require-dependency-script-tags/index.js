import ac from 'argument-contracts';
import { buildScriptTags } from './build-script-tags';

export function resolveRequiredDependencyScriptTags({ dependencies, dependencyMap }) {
    ac.assertType(dependencies, Object, 'dependencies');
    ac.assertType(dependencyMap, Object, 'dependencyMap');

    return dependencies.reduce((tagsArray, dependency) => {
        if(dependencyMap[dependency.packageName]) {
            const scriptTags = buildScriptTags({
                externalPackageEntry: dependencyMap[dependency.packageName],
                version: dependency.version
            });

            return tagsArray.concat(scriptTags);
        }
        return tagsArray;
    }, []);
}
