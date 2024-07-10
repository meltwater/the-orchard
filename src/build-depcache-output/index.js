import ac from 'argument-contracts';
import { checkForRequiredInitialization } from '../build-app-output/check-for-required-initialization';
import { CliOptions, DO_NOT_INJECT } from '../cli-options';
import fs from 'fs';
import { getDependencyPackages } from '../build-app-output/get-dependency-packages';
import { Logger } from '../logger';
import path from 'path';
import { readPackageDependencies } from '../build-app-output/read-package-dependencies';
import { rollupLatestMajorVersions } from '../build-app-output/rollup-latest-major-versions';
import { throwForConflictingMajorVersions } from '../build-app-output/throw-for-conflicting-major-versions';
import { throwIfZerothLevelDepNotHighestMajorVersion } from '../build-app-output/throw-if-zeroth-level-dep-not-highest-major-version';
import { buildDependencyArray } from '../build-app-output/build-dependency-array';
import { pareDownToKnownPackages } from '../build-app-output/pare-down-to-known-packages';
import { adjustOrderBasedOnChildDependencies } from '../build-app-output/adjust-order-based-on-child-dependencies';
import { resolveRequiredDependencyScripts } from './resolve-required-dependency-scripts';

const currentWorkingDirectory = process.cwd();

export async function buildDepcacheOutput(cliOptions) {
    ac.assertType(cliOptions, CliOptions, 'cliOptions');

    Logger.setLoggingLevel(cliOptions.logging);
    Logger.debug(`buildDepcacheOutput: cliOptions: ${JSON.stringify(cliOptions)}`);

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
    ];

    if (cliOptions.injectFile && cliOptions.injectFile !== DO_NOT_INJECT) {
        const fileContentToInjectInto = fs.readFileSync(cliOptions.injectFile, { encoding: 'utf8' });
        const updatedFileContent = fileContentToInjectInto.replace(cliOptions.orchardInjectString, JSON.stringify(output, null, 2));
        fs.writeFileSync(cliOptions.outputFile, updatedFileContent);
    } else {
        fs.writeFileSync(cliOptions.outputFile, JSON.stringify(output, null, 2));
    }
}
