import ac from 'argument-contracts';
import { coerce } from '@meltwater/coerce';
import { Contact } from '../contact';
import semver from 'semver';

function getEntryWithOverrides (entry, version) {
    const { overrides, ...options } = entry;
    const versionOverride = overrides.find(override => semver.satisfies(version, override.versions));

    return new ExternalPackageEntry({
        ...options,
        ...versionOverride
    });
}

export class ExternalPackageEntry {
    constructor(options) {
        const {
            es5 = [],
            esm = [],
            css = [],
            basePath,
            ownedBy,
            packageName,
            repo,
            contact,
            versionPath,
            overrides = []
        } = options;

        ac.assertArray(overrides);
        ac.assertArrayOf(es5, String, 'es5');
        ac.assertArrayOf(esm, String, 'esm');
        ac.assertArrayOf(css, String, 'css');
        ac.assertString(basePath, 'basePath');
        ac.assertString(ownedBy, 'ownedBy');
        ac.assertString(packageName, 'packageName');
        ac.assertString(repo, 'repo');
        ac.assertString(versionPath, 'versionPath');

        if(!versionPath.includes('{{version}}')) {
            throw new Error(`versionPath must include {{version}} for where the version number should be included. Provided value: ${versionPath}`);
        }

        if(esm.length === 0 && es5.length === 0) {
            throw new Error('Either es5 or esm must be provided, or both.');
        }

        if(overrides.some(override => semver.validRange(override.versions) === null)) {
            throw new RangeError('All overrides must have a `versions` property that is a valid semver range.');
        }

        for (const { versions, ...override } of overrides) {
            try {
                ac.assertType({
                    ...options,
                    ...override,
                    overrides: []
                }, ExternalPackageEntry, 'overrides');
            }
            catch ({ message }) {
                throw new Error(`Error processing override for versions '${versions}': ${message}`);
            }
        }

        this.es5 = es5;
        this.esm = esm;
        this.css = css;
        this.basePath = basePath;
        this.ownedBy = ownedBy;
        this.packageName = packageName;
        this.repo = repo;
        this.contact =  coerce(contact, Contact, `contact should be coercable to a contact. Provided value: ${contact}`);
        this.versionPath = versionPath;
        this.overrides = overrides;

        Object.freeze(this);
    }

    getEs5Urls(version) {
        ac.assertString(version, 'version');

        const entry = getEntryWithOverrides(this, version);
        const interpolatedVersion = entry.versionPath.replace(/{{version}}/, version);

        return entry.es5.map(file => [entry.basePath, interpolatedVersion, file].join(''));
    }

    getEsmUrls(version) {
        ac.assertString(version, 'version');

        const entry = getEntryWithOverrides(this, version);
        const interpolatedVersion = entry.versionPath.replace(/{{version}}/, version);

        return entry.esm.map(file => [entry.basePath, interpolatedVersion, file].join(''));
    }

    getCssUrls(version) {
        ac.assertString(version, 'version');

        const entry = getEntryWithOverrides(this, version);
        const interpolatedVersion = entry.versionPath.replace(/{{version}}/, version);

        return entry.css.map(file => [entry.basePath, interpolatedVersion, file].join(''));
    }
}
