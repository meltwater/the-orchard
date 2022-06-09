import ac from 'argument-contracts';
import { Logger } from '../logger';
import semver from 'semver';

export class NpmDependency {
    constructor({ depth, packageName, version }) {
        ac.assertNumber(depth, 'depth');
        ac.assertString(packageName, 'packageName');
        ac.assertString(version, 'version');

        const safeVersion = semver.valid(semver.coerce(version));
        if(safeVersion === null) {
            throw new Error(`The version provided is not valid semver. Package name: ${packageName} Provided version: ${version}`);
        }

        Logger.debug(`NpmDependency: ${packageName} - Depth: ${depth} - Version: ${version} - ${safeVersion}`);

        this.depth = depth;
        this.packageName = packageName;
        this.version = safeVersion;

        Object.freeze(this);
    }

    isOtherPackageNewer(otherVersion) {
        return semver.lt(this.version, otherVersion);
    }
}