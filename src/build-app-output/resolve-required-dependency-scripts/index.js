import ac from 'argument-contracts';
import { ExternalPackageEntry } from '../../external-package-entry';
import { Logger } from '../../logger';

function getScripts({ externalPackageEntry, version }) {
    ac.assertType(externalPackageEntry, ExternalPackageEntry, 'externalPackageEntry');
    ac.assertString(version, 'version');

    Logger.info(`Creating scripts for ${externalPackageEntry.packageName}`);

    return externalPackageEntry.getEsmUrls(version);
}

export function resolveRequiredDependencyScripts({ dependencies, dependencyMap }) {
    ac.assertType(dependencies, Object, 'dependencies');
    ac.assertType(dependencyMap, Object, 'dependencyMap');

    const scriptsArray = dependencies.reduce((scriptsArray, dependency) => {
        if(dependencyMap[dependency.packageName]) {
            const scripts = getScripts({
                externalPackageEntry: dependencyMap[dependency.packageName],
                version: dependency.version
            });

            return scriptsArray.concat(scripts);
        }
        return scriptsArray;
    }, []);

    return scriptsArray.map(script => `"${script}"`);
}