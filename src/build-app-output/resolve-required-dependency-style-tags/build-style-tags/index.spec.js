import ac from 'argument-contracts';
import { ExternalPackageEntry } from '../../../external-package-entry';
import { buildStyleTags } from '.';

describe('build style tags', () => {
    beforeEach(() => {
        spyOn(ac, 'assertString');
        spyOn(ac, 'assertType');
    });

    describe('param validation', () => {
        let externalPackageEntry;
        beforeEach(() => {
            externalPackageEntry = {
                getCssUrls: () => [{}]
            };
        });

        it('should assert externalPackageEntry is an externalPackageEntry', () => {
            buildStyleTags({ externalPackageEntry, version: '0.0.0' });

            expect(ac.assertType).toHaveBeenCalledWith(externalPackageEntry, ExternalPackageEntry, 'externalPackageEntry');
        });

        it('should assert version is a string', () => {
            const version = 'all the yes';

            buildStyleTags({ externalPackageEntry, version });

            expect(ac.assertString).toHaveBeenCalledWith(version, 'version');
        });
    });

    describe('build style tags', () => {
        let externalPackageEntry;
        beforeEach(() => {
            externalPackageEntry = {
                getCssUrls: () => [{}]
            };
        });

        it('should return a css link tag', () => {
            const cssUrl = 'yupyupyupyupyupyup';
            const version = 'ohhhhhh yesh';
            spyOn(externalPackageEntry, 'getCssUrls').and.returnValue([cssUrl]);

            const result = buildStyleTags({ externalPackageEntry, version });

            expect(externalPackageEntry.getCssUrls).toHaveBeenCalledWith(version);
            expect(result).toEqual(jasmine.arrayContaining([
                `<link href="${cssUrl}" rel="stylesheet"/>`
            ]));
        });

        it('should not return style tags if only css styles exist', () => {
            const cssUrl = 'yesyesyesyesyesyes';
            const version = 'ohhhhhh yesh';
            spyOn(externalPackageEntry, 'getCssUrls').and.returnValue([cssUrl]);

            const result = buildStyleTags({ externalPackageEntry, version });

            expect(externalPackageEntry.getCssUrls).toHaveBeenCalledWith(version);
            expect(result).toEqual(jasmine.arrayContaining([ ]));
        });
    });
});