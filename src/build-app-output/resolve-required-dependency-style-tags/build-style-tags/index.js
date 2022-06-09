import ac from 'argument-contracts';
import { ExternalPackageEntry } from '../../../external-package-entry';
import { Logger } from '../../../logger';

function buildLinkTags(urls) {
    return urls.map(url => `<link href="${url}" rel="stylesheet"/>`);
}

export function buildStyleTags({ externalPackageEntry, version }) {
    ac.assertType(externalPackageEntry, ExternalPackageEntry, 'externalPackageEntry');
    ac.assertString(version, 'version');

    Logger.info(`Creating script tags for: ${externalPackageEntry.packageName}`);

    const cssUrls = externalPackageEntry.getCssUrls(version);

    if(cssUrls.length) {
        return buildLinkTags(cssUrls);
    } else {
        return [];
    }
}