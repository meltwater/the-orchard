import ac from 'argument-contracts';
import { ExternalPackageEntry } from '../../../external-package-entry';
import { Logger } from '../../../logger';

function buildEs5ScriptTags(urls) {
    return urls.map(url => `<script src="${url}" nomodule defer></script>`);
}

function buildEsmScriptTags(urls) {
    return urls.map(url => `<script src="${url}" type="module"></script>`);
}

function buildDeferredScriptTags(urls) {
    return urls.map(url => `<script src="${url}" defer></script>`);
}

export function buildScriptTags({ externalPackageEntry, version }) {
    ac.assertType(externalPackageEntry, ExternalPackageEntry, 'externalPackageEntry');
    ac.assertString(version, 'version');

    Logger.info(`Creating script tags for: ${externalPackageEntry.packageName}`);

    const es5Urls = externalPackageEntry.getEs5Urls(version);
    const esmUrls = externalPackageEntry.getEsmUrls(version);

    if(es5Urls.length && !esmUrls.length) {
        return buildDeferredScriptTags(es5Urls);
    } else {
        return [
            ...buildEs5ScriptTags(es5Urls),
            ...buildEsmScriptTags(esmUrls)
        ];
    }
}
