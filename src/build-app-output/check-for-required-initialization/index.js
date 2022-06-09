import ac from 'argument-contracts';
import colors from 'colors/safe';
import { Logger } from '../../logger';
import { NpmDependency } from '../../npm-dependency';

export function checkForRequiredInitialization({dependencies, dependencyMap}) {
    ac.assertArrayOf(dependencies, NpmDependency, 'dependencies');

    const dependenciesRequiringInitialization = dependencies.filter(dependency =>
        (dependencyMap[dependency.packageName] && dependencyMap[dependency.packageName].requiresInitialization == true)
    );

    if (dependenciesRequiringInitialization.length > 0) {
        Logger.warn(colors.rainbow('*****************************************************************'));
        Logger.warn(colors.green('*  Be sure these dependencies are initialized in your application:'));
        dependenciesRequiringInitialization
            .forEach(dependency => Logger.warn(colors.red(`*   - ${dependency.packageName} version ${dependency.version}`)));
        Logger.warn(colors.rainbow('*****************************************************************'));
    }
}
