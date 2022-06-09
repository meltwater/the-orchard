import ac from 'argument-contracts';
import { ExternalPackageEntry } from '../../../external-package-entry';
import { buildScriptTags } from './index';

describe('build script tags', () => {
    beforeEach(() => {
        spyOn(ac, 'assertString');
        spyOn(ac, 'assertType');
    });

    describe('param validation', () => {
        let externalPackageEntry;
        beforeEach(() => {
            externalPackageEntry = {
                getEs5Urls: () => [{}],
                getEsmUrls: () => [{}]
            };
        });

        it('should assert externalPackageEntry is an externalPackageEntry', () => {
            buildScriptTags({ externalPackageEntry, version: '0.0.0' });

            expect(ac.assertType).toHaveBeenCalledWith(externalPackageEntry, ExternalPackageEntry, 'externalPackageEntry');
        });

        it('should assert version is a string', () => {
            const version = 'all the yes';

            buildScriptTags({ externalPackageEntry, version });

            expect(ac.assertString).toHaveBeenCalledWith(version, 'version');
        });
    });

    describe('build script tags', () => {
        let externalPackageEntry;
        beforeEach(() => {
            externalPackageEntry = {
                getEs5Urls: () => [{}],
                getEsmUrls: () => [{}]
            };
        });

        it('should return an es5 script tag', () => {
            const es5Url = 'yupyupyupyupyupyup';
            const version = 'ohhhhhh yesh';
            spyOn(externalPackageEntry, 'getEs5Urls').and.returnValue([es5Url]);
            spyOn(externalPackageEntry, 'getEsmUrls').and.returnValue(['']);

            const result = buildScriptTags({ externalPackageEntry, version });

            expect(externalPackageEntry.getEs5Urls).toHaveBeenCalledWith(version);
            expect(result).toEqual(jasmine.arrayContaining([
                `<script src="${es5Url}" nomodule defer></script>`
            ]));
        });


        it('should return an esm script tag', () => {
            const esmUrl = 'yesyesyesyesyesyes';
            const version = 'ohhhhhh yesh';
            spyOn(externalPackageEntry, 'getEs5Urls').and.returnValue(['']);
            spyOn(externalPackageEntry, 'getEsmUrls').and.returnValue([ esmUrl ]);

            const result = buildScriptTags({ externalPackageEntry, version });

            expect(externalPackageEntry.getEsmUrls).toHaveBeenCalledWith(version);
            expect(result).toEqual(jasmine.arrayContaining([
                `<script src="${esmUrl}" type="module"></script>`
            ]));
        });

        it('should return deferred scripts if only es5 scripts exist', () => {
            const es5Url = 'yesyesyesyesyesyes';
            const version = 'ohhhhhh yesh';
            spyOn(externalPackageEntry, 'getEs5Urls').and.returnValue([es5Url]);
            spyOn(externalPackageEntry, 'getEsmUrls').and.returnValue([ ]);

            const result = buildScriptTags({ externalPackageEntry, version });

            expect(externalPackageEntry.getEs5Urls).toHaveBeenCalledWith(version);
            expect(result).toEqual(jasmine.arrayContaining([
                `<script src="${es5Url}" defer></script>`
            ]));
        });
    });
});
