import ac from 'argument-contracts';
import { checkForRequiredInitialization } from './check-for-required-initialization';
import { CliOptions, DO_NOT_INJECT } from '../cli-options';
import fs from 'fs';
import { getDependencyPackages } from './get-dependency-packages';
import { Logger } from '../logger';
import path from 'path';
import { readPackageDependencies } from './read-package-dependencies';
import { rollupLatestMajorVersions } from './rollup-latest-major-versions';
import { throwForConflictingMajorVersions } from './throw-for-conflicting-major-versions';
import { throwIfZerothLevelDepNotHighestMajorVersion } from './throw-if-zeroth-level-dep-not-highest-major-version';
import { buildDependencyArray } from './build-dependency-array';
import { pareDownToKnownPackages } from './pare-down-to-known-packages';
import { adjustOrderBasedOnChildDependencies } from './adjust-order-based-on-child-dependencies';
import { resolveRequiredDependencyScripts } from './resolve-required-dependency-scripts';

const currentWorkingDirectory = process.cwd();

export async function buildDepcacheOutput(cliOptions) {
    ac.assertType(cliOptions, CliOptions, 'cliOptions');

    Logger.setLoggingLevel(cliOptions.logging);
    Logger.debug(`buildAppOutput: cliOptions: ${JSON.stringify(cliOptions)}`);

    const dependencies = readPackageDependencies(path.join(currentWorkingDirectory, cliOptions.pathToPackageJson));
    Logger.debug('dependencies', JSON.stringify(dependencies, null, 2));

    const dependencyMap = await getDependencyPackages(cliOptions.dependencyDirectory);
    Logger.debug('dependencyMap', JSON.stringify(dependencyMap, null, 2));

    const npmDependenciesWithChildDependencies = await buildDependencyArray({
        currentWorkingDirectory,
        pathToPackageJson: cliOptions.pathToPackageJson
    });

    const paredDownToKnownPackages = pareDownToKnownPackages({
        dependencyMap,
        npmDependenciesWithChildDependencies
    });

    Logger.debug('paredDownToKnownPackages', paredDownToKnownPackages);

    const dependenciesReadyForRollup = paredDownToKnownPackages;

    const rolledUpDeps = rollupLatestMajorVersions(dependenciesReadyForRollup);
    throwForConflictingMajorVersions({ dependencies: rolledUpDeps, dependencyMap });
    throwIfZerothLevelDepNotHighestMajorVersion(rolledUpDeps);
    checkForRequiredInitialization({ dependencies: rolledUpDeps, dependencyMap });

    const orderedDependencies = adjustOrderBasedOnChildDependencies({
        npmDependenciesWithChildDependencies: rolledUpDeps
    });

    const dependencyScripts = resolveRequiredDependencyScripts({
        dependencies: orderedDependencies,
        dependencyMap: {
            ...dependencyMap
        }
    });

    const output = [
        ...dependencyScripts
    ].join(',\n');

    if (cliOptions.injectFile && cliOptions.injectFile !== DO_NOT_INJECT) {
        const fileContentToInjectInto = fs.readFileSync(cliOptions.injectFile, { encoding: 'utf8' });
        const updatedFileContent = fileContentToInjectInto.replace(cliOptions.orchardInjectString, output);
        fs.writeFileSync(cliOptions.outputFile, updatedFileContent);
    } else {
        fs.writeFileSync(cliOptions.outputFile, output);
    }
}
