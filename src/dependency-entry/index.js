import ac from 'argument-contracts';
import { ExternalPackageEntry } from '../external-package-entry';
import { Logger } from '../logger';

/**
 * The details of an supporting library for dependency resolution and contact information.
 *
 * @param {object} options - See below
 * @param {string} options.basePath - The base url for all asset paths
 * @param {boolean} options.conflictsWithOtherMajorVersions - This dependency does not implement version namespacing and could break if another instance, even of another major version, is present in the browser context
 * @param {Contact} options.contact - The contact information for the owner
 * @param {Array<string>} [options.es5] - The file paths needed for ES5 rendering. Either `es5`, `esm`, or both must be provided.
 * @param {Array<string>} [options.esm] - The file paths needed for ESM rendering. Either `es5`, `esm`, or both must be provided.
 * @param {Array<string>} [options.orchardDependencies] - Package names of other dependencies in the orchard that this directly depends upon
 * @param {string} options.ownedBy - The name of the team or group who owns this package
 * @param {string} options.packageName - The name of the package published to NPM including the namespace. Eg. @meltwater/volume-by-input-column
 * @param {boolean} options.requiresInitialization - This dependency requires needs to be initialized on the page before it can be used
 * @param {string} options.repo - The github repo for the package
 * @param {string} options.versionPath - The version portion of all asset paths
 */
export class DependencyEntry {
    constructor(options) {
        const {
            orchardDependencies = [],
            conflictsWithOtherMajorVersions,
            requiresInitialization
        } = options;

        ac.assertArrayOf(orchardDependencies, String, 'orchardDependencies');
        ac.assertBoolean(conflictsWithOtherMajorVersions, 'conflictsWithOtherMajorVersions');
        ac.assertBoolean(requiresInitialization, 'requiresInitialization');

        this.externalPackageEntry = new ExternalPackageEntry(options);

        this.es5 = this.externalPackageEntry.es5;
        this.esm = this.externalPackageEntry.esm;
        this.basePath = this.externalPackageEntry.basePath;
        this.ownedBy = this.externalPackageEntry.ownedBy;
        this.packageName = this.externalPackageEntry.packageName;
        this.repo = this.externalPackageEntry.repo;
        this.contact = this.externalPackageEntry.contact;
        this.versionPath = this.externalPackageEntry.versionPath;

        this.orchardDependencies = orchardDependencies;
        this.conflictsWithOtherMajorVersions = conflictsWithOtherMajorVersions;
        this.requiresInitialization = requiresInitialization;

        Object.freeze(this);
    }

    /**
     * Evaluate whether this dependency has a conflict with the given major version
     *
     * @param {number} majorVersion - The major version number (e.g. 13, not 13.0.0) to check
     * @returns {boolean} True if this dependency has a conflict with the given major version; otherwise false
     */
    hasConflictWithMajorVersion(majorVersion) {
        ac.assertNumber(majorVersion, 'majorVersion');

        if (majorVersion !== parseInt(majorVersion)) {
            throw new TypeError(`majorVersion must be an integer. Provided value: ${majorVersion}`);
        }

        if (this.conflictsWithOtherMajorVersions) {
            Logger.warn('Your dependency tree may be incorrectly failing for major version conflicts. Please open an issue if you think you should not be receiving this message!');
        }

        return this.conflictsWithOtherMajorVersions;
    }

    /**
     * Generate ES5 urls used in script tags
     * @param {string} version - The full version to be used for ES5 urls
     * @returns {Array<string>} - The urls for all ES5 assets for this dependency
     */
    getEs5Urls(version) {
        return this.externalPackageEntry.getEs5Urls(version);
    }

    /**
     * Generate ESM urls used in script tags
     * @param {string} version - The full version to be used for ESM urls
     * @returns {Array<string>} - The urls for all ESM assets for this dependency
     */
    getEsmUrls(version) {
        return this.externalPackageEntry.getEsmUrls(version);
    }

    /**
     * Generate CSS urls used in style tags
     * @param {string} version - The full version to be used for CSS urls
     * @returns {Array<string>} - The urls for all CSS assets for this dependency
     */
    getCssUrls(version) {
        return this.externalPackageEntry.getCssUrls(version);
    }
}
