import semver from 'semver';

export function coerceVersion(version) {
    return semver.valid(semver.coerce(version));
}