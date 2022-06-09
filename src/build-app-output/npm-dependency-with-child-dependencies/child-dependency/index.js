import ac from 'argument-contracts';
import { Logger } from '../../../logger';
import { coerceVersion } from '../coerce-version';

export class ChildDependency {
    constructor({ packageName, version }) {
        ac.assertString(packageName, 'packageName');
        ac.assertString(version, 'version');

        const safeVersion = coerceVersion(version);
        if (safeVersion === null) {
            throw new Error(`ChildDependency: The version provided is not valid semver. Package name: ${packageName} Provided version: ${version}`);
        }

        Logger.debug(`ChildDependency: ${packageName} - Version: ${version} - ${safeVersion}`);

        this.packageName = packageName;
        this.version = safeVersion;

        Object.freeze(this);
    }
}