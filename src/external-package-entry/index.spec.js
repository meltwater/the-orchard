import ac from 'argument-contracts';
import * as CoerceModule from '@meltwater/coerce';
import { ExternalPackageEntry } from './index';
import { Contact } from '../contact';
import semver from 'semver';

describe('ExternalPackageEntry', () => {
    let options;

    beforeEach(() => {
        spyOn(ac, 'assertArray');
        spyOn(ac, 'assertArrayOf');
        spyOn(ac, 'assertBoolean');
        spyOn(ac, 'assertString');
        spyOn(ac, 'assertType');

        spyOn(CoerceModule, 'coerce').and.callFake(x => x);
        spyOn(semver, 'validRange').and.callFake(x => x);

        options = {
            packageName: '@thegreatest/package-you-ever-did-see',
            basePath: 'https://what.the.mother',
            versionPath: 'v{{version}}',
            css: [ 'such.style.for' ],
            es5: [ 'so.es5.much.js' ],
            esm: [ 'the.best.standard.evar.js' ],
            overrides: [{
                versions: '0.0.0'
            }]
        };
    });

    it('should assert packageName is a string', () => {
        options.packageName = '@yup/i-got-it';

        new ExternalPackageEntry(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.packageName, 'packageName');
    });

    it('should assert basePath is a string', () => {
        options.basePath = 'https://all.about.that.base';

        new ExternalPackageEntry(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.basePath, 'basePath');
    });

    it('should assert versionPath is a string', () => {
        options.versionPath = 'versionVersion{{version}}';

        new ExternalPackageEntry(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.versionPath, 'versionPath');
    });

    it('should throw if versionPath does not contain {{version}} for mustaching', () => {
        options.versionPath = 'versionVersion';

        expect(() => new ExternalPackageEntry(options)).toThrowError(/versionPath/);
    });

    it('should assert es5 is an array of strings', () => {
        options.es5 = [ 'crap.format.js' ];

        new ExternalPackageEntry(options);

        expect(ac.assertArrayOf).toHaveBeenCalledWith(options.es5, String, 'es5');
    });

    it('should default es5 to an empty array if not provided', () => {
        delete options.es5;

        new ExternalPackageEntry(options);

        expect(ac.assertArrayOf).toHaveBeenCalledWith([], String, 'es5');
    });

    it('should assert css is an array of strings', () => {
        options.css = [ 'crap.format.js' ];

        new ExternalPackageEntry(options);

        expect(ac.assertArrayOf).toHaveBeenCalledWith(options.css, String, 'css');
    });

    it('should default css to an empty array if not provided', () => {
        delete options.css;

        new ExternalPackageEntry(options);

        expect(ac.assertArrayOf).toHaveBeenCalledWith([], String, 'css');
    });

    it('should coerce contact to a Contact', () => {
        options.contact = 'amazingly.great.js';

        new ExternalPackageEntry(options);

        expect(CoerceModule.coerce).toHaveBeenCalledWith(options.contact, Contact, jasmine.stringMatching(/contact/));
    });

    it('should assert ownedBy is a string', () => {
        options.ownedBy = 'amazingly.great.js';

        new ExternalPackageEntry(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.ownedBy, 'ownedBy');
    });

    it('should assert repo is a string', () => {
        options.repo = 'amazingly.great.js';

        new ExternalPackageEntry(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.repo, 'repo');
    });

    it('should assert esm is an array of strings', () => {
        options.esm = [ 'amazingly.great.js' ];

        new ExternalPackageEntry(options);

        expect(ac.assertArrayOf).toHaveBeenCalledWith(options.esm, String, 'esm');
    });

    it('should default esm to an empty array', () => {
        delete options.esm;

        new ExternalPackageEntry(options);

        expect(ac.assertArrayOf).toHaveBeenCalledWith([], String, 'esm');
    });

    it('should throw if both es5 and esm are empty arrays', () => {
        options.es5 = [];
        options.esm = [];

        expect(() => new ExternalPackageEntry(options)).toThrowError(/es5.*esm/);
    });


    it('should default overrides to an array', () => {
        delete options.overrides;

        const entry = new ExternalPackageEntry(options);

        expect(entry.overrides).toBeDefined();
        expect(entry.overrides).toEqual(jasmine.arrayContaining([]));
    });

    it('should assert overrides option is an array', () => {
        options.overrides = 'not an array';

        try {
            new ExternalPackageEntry(options);
        }
        catch (wtf) {
        }
        finally {
            expect(ac.assertArray).toHaveBeenCalledWith(options.overrides);
        }
    });

    it('should validate that overrides all have a "versions" property that is a valid semver range', () => {
        const versions = 'lastest only';

        new ExternalPackageEntry({
            ...options,
            overrides: [{ versions }]
        });

        expect(semver.validRange).toHaveBeenCalledWith(versions);
    });

    it('should throw if versions is not valid semver range', () => {
        semver.validRange.and.returnValue(null);

        expect(() => new ExternalPackageEntry(options)).toThrowError(/versions/);
    });

    it('should assert that override values are each a based on the core options', () => {
        const { overrides, ...baseOptions } = options;

        new ExternalPackageEntry(options);

        expect(ac.assertType).toHaveBeenCalledWith(
            jasmine.objectContaining({
                ...baseOptions,
                overrides: []
            }),
            ExternalPackageEntry,
            'overrides'
        );
    });

    it('should validate that override values are merged into the array of ExternalPackageEntry', () => {
        const override = {
            basePath: 'hat tips: // baseball.cap /forward',
        };

        new ExternalPackageEntry({
            ...options,
            overrides: [ override ]
        });

        expect(ac.assertType).toHaveBeenCalledWith(
            jasmine.objectContaining(override),
            ExternalPackageEntry,
            'overrides'
        );
    });

    it('should include version number in error for invalid override', () => {
        const versions = 'modren man';
        options.overrides[0].versions = versions;

        ac.assertType.and.throwError('whoopsie!');

        expect(() => new ExternalPackageEntry(options)).toThrowError(new RegExp(versions));
    });

    it('should map options', () => {
        const result = new ExternalPackageEntry(options);

        expect(result.contact).toEqual(options.contact);
        expect(result.es5).toEqual(options.es5);
        expect(result.esm).toEqual(options.esm);
        expect(result.css).toEqual(options.css);
        expect(result.basePath).toEqual(options.basePath);
        expect(result.ownedBy).toEqual(options.ownedBy);
        expect(result.packageName).toEqual(options.packageName);
        expect(result.repo).toEqual(options.repo);
        expect(result.versionPath).toEqual(options.versionPath);
        expect(result.conflictsWithOtherMajorVersions).toEqual(options.conflictsWithOtherMajorVersions);
        expect(result.requiresInitialization).toEqual(options.requiresInitialization);
        expect(result.overrides).toEqual(options.overrides);
    });

    it('should be immutable', () => {
        const result = new ExternalPackageEntry(options);

        expect(() => { result.es5 = ''; }).toThrow();
        expect(() => { result.esm = ''; }).toThrow();
        expect(() => { result.basePath = ''; }).toThrow();
        expect(() => { result.packageName = ''; }).toThrow();
        expect(() => { result.ownedBy = ''; }).toThrow();
        expect(() => { result.packageName = ''; }).toThrow();
        expect(() => { result.repo = ''; }).toThrow();
        expect(() => { result.contact = ''; }).toThrow();
        expect(() => { result.versionPath = ''; }).toThrow();
        expect(() => { result.overrides = []; }).toThrow();
    });

    describe('getEs5Urls', () => {
        let dependencyEntry;
        beforeEach(() => {
            spyOn(semver, 'satisfies').and.returnValue(false);

            dependencyEntry = new ExternalPackageEntry(options);
        });

        it('should be a method', () => {
            expect(dependencyEntry.getEs5Urls).toEqual(jasmine.any(Function));
        });

        it('should assert version is a string', () => {
            const version = 'yes.this.version';

            dependencyEntry.getEs5Urls(version);

            expect(ac.assertString).toHaveBeenCalledWith(version, 'version');
        });

        it('should return the built urls for es5 files', () => {
            const version = 'yes.this.version';
            const interpolatedVersion = options.versionPath.replace(/{{version}}/, version);
            const expectedUrl = [options.basePath, interpolatedVersion, options.es5].join('');

            const results = dependencyEntry.getEs5Urls(version);

            expect(results).toEqual([ expectedUrl ]);
        });

        it('should return the built urls for es5 files for versions with overrides', () => {
            const override = {
                basePath: 'https://example.com/',
                es5: ['wtf'],
                versions: '*'
            };
            const version = 'yes.this.version';

            semver.satisfies.and.returnValue(true);

            dependencyEntry = new ExternalPackageEntry({
                ...options,
                overrides: [override]
            });
            const results = dependencyEntry.getEs5Urls(version);

            expect(semver.satisfies).toHaveBeenCalledWith(version, override.versions);

            const interpolatedVersion = options.versionPath.replace(/{{version}}/, version);
            const expectedUrl = [override.basePath, interpolatedVersion, override.es5].join('');
            expect(results).toEqual([ expectedUrl ]);
        });

        it('should return the built urls for es5 files for versions partial basePath override', () => {
            const override = {
                basePath: 'https://example.com/',
                versions: '*'
            };
            const version = 'yes.this.version';

            semver.satisfies.and.returnValue(true);

            dependencyEntry = new ExternalPackageEntry({
                ...options,
                overrides: [override]
            });
            const results = dependencyEntry.getEs5Urls(version);

            expect(semver.satisfies).toHaveBeenCalledWith(version, override.versions);

            const interpolatedVersion = options.versionPath.replace(/{{version}}/, version);
            const expectedUrl = [override.basePath, interpolatedVersion, options.es5].join('');
            expect(results).toEqual([ expectedUrl ]);
        });

        it('should return the built urls for es5 files for versions partial es5 override', () => {
            const es5File = 'muh file';
            const override = {
                es5: [es5File],
                versions: '*'
            };
            const version = 'yes.this.version';

            semver.satisfies.and.returnValue(true);

            dependencyEntry = new ExternalPackageEntry({
                ...options,
                overrides: [override]
            });
            const results = dependencyEntry.getEs5Urls(version);

            expect(semver.satisfies).toHaveBeenCalledWith(version, override.versions);

            const interpolatedVersion = options.versionPath.replace(/{{version}}/, version);
            const expectedUrl = [options.basePath, interpolatedVersion, override.es5[0]].join('');
            expect(results).toEqual([ expectedUrl ]);
        });
    });

    describe('getEsmUrls', () => {
        let dependencyEntry;
        beforeEach(() => {
            spyOn(semver, 'satisfies').and.returnValue(false);

            dependencyEntry = new ExternalPackageEntry(options);
        });

        it('should be a method', () => {
            expect(dependencyEntry.getEsmUrls).toEqual(jasmine.any(Function));
        });

        it('should assert version is a string', () => {
            const version = 'yes.this.version';

            dependencyEntry.getEsmUrls(version);

            expect(ac.assertString).toHaveBeenCalledWith(version, 'version');
        });

        it('should return the built url for esm', () => {
            const version = 'yes.this.version';
            const interpolatedVersion = options.versionPath.replace(/{{version}}/, version);
            const expectedUrl = [options.basePath, interpolatedVersion, options.esm].join('');

            const result = dependencyEntry.getEsmUrls(version);

            expect(result).toEqual([ expectedUrl ]);
        });

        it('should return the built urls for esm files for versions with overrides', () => {
            const override = {
                basePath: 'https://example.com/',
                esm: ['wtf'],
                versions: '*'
            };
            const version = 'yes.this.version';

            semver.satisfies.and.returnValue(true);

            dependencyEntry = new ExternalPackageEntry({
                ...options,
                overrides: [override]
            });
            const results = dependencyEntry.getEsmUrls(version);

            expect(semver.satisfies).toHaveBeenCalledWith(version, override.versions);

            const interpolatedVersion = options.versionPath.replace(/{{version}}/, version);
            const expectedUrl = [override.basePath, interpolatedVersion, override.esm].join('');
            expect(results).toEqual([ expectedUrl ]);
        });

        it('should return the built urls for esm files for versions partial basePath override', () => {
            const override = {
                basePath: 'https://example.com/',
                versions: '*'
            };
            const version = 'yes.this.version';

            semver.satisfies.and.returnValue(true);

            dependencyEntry = new ExternalPackageEntry({
                ...options,
                overrides: [override]
            });
            const results = dependencyEntry.getEsmUrls(version);

            expect(semver.satisfies).toHaveBeenCalledWith(version, override.versions);

            const interpolatedVersion = options.versionPath.replace(/{{version}}/, version);
            const expectedUrl = [override.basePath, interpolatedVersion, options.esm].join('');
            expect(results).toEqual([ expectedUrl ]);
        });

        it('should return the built urls for esm files for versions partial esm override', () => {
            const esmFile = 'muh file';
            const override = {
                esm: [esmFile],
                versions: '*'
            };
            const version = 'yes.this.version';

            semver.satisfies.and.returnValue(true);

            dependencyEntry = new ExternalPackageEntry({
                ...options,
                overrides: [override]
            });
            const results = dependencyEntry.getEsmUrls(version);

            expect(semver.satisfies).toHaveBeenCalledWith(version, override.versions);

            const interpolatedVersion = options.versionPath.replace(/{{version}}/, version);
            const expectedUrl = [options.basePath, interpolatedVersion, override.esm[0]].join('');
            expect(results).toEqual([ expectedUrl ]);
        });
    });

    describe('getCssUrls', () => {
        let dependencyEntry;
        beforeEach(() => {
            spyOn(semver, 'satisfies').and.returnValue(false);

            dependencyEntry = new ExternalPackageEntry(options);
        });

        it('should be a method', () => {
            expect(dependencyEntry.getCssUrls).toEqual(jasmine.any(Function));
        });

        it('should assert version is a string', () => {
            const version = 'yes.this.version';

            dependencyEntry.getCssUrls(version);

            expect(ac.assertString).toHaveBeenCalledWith(version, 'version');
        });

        it('should return the built url for css', () => {
            const version = 'yes.this.version';
            const interpolatedVersion = options.versionPath.replace(/{{version}}/, version);
            const expectedUrl = [options.basePath, interpolatedVersion, options.css].join('');

            const result = dependencyEntry.getCssUrls(version);

            expect(result).toEqual([ expectedUrl ]);
        });

        it('should return the built urls for css files for versions with overrides', () => {
            const override = {
                basePath: 'https://example.com/',
                css: ['check this out'],
                esm: ['wtf'],
                versions: '*'
            };
            const version = 'yes.this.version';

            semver.satisfies.and.returnValue(true);

            dependencyEntry = new ExternalPackageEntry({
                ...options,
                overrides: [override]
            });
            const results = dependencyEntry.getCssUrls(version);

            expect(semver.satisfies).toHaveBeenCalledWith(version, override.versions);

            const interpolatedVersion = options.versionPath.replace(/{{version}}/, version);
            const expectedUrl = [override.basePath, interpolatedVersion, override.css].join('');
            expect(results).toEqual([ expectedUrl ]);
        });

        it('should return the built urls for css files for versions partial basePath override', () => {
            const override = {
                basePath: 'https://example.com/',
                versions: '*'
            };
            const version = 'yes.this.version';

            semver.satisfies.and.returnValue(true);

            dependencyEntry = new ExternalPackageEntry({
                ...options,
                overrides: [override]
            });
            const results = dependencyEntry.getCssUrls(version);

            expect(semver.satisfies).toHaveBeenCalledWith(version, override.versions);

            const interpolatedVersion = options.versionPath.replace(/{{version}}/, version);
            const expectedUrl = [override.basePath, interpolatedVersion, options.css].join('');
            expect(results).toEqual([ expectedUrl ]);
        });

        it('should return the built urls for css files for versions partial css override', () => {
            const esmFile = 'muh file';
            const override = {
                css: [esmFile],
                versions: '*'
            };
            const version = 'yes.this.version';

            semver.satisfies.and.returnValue(true);

            dependencyEntry = new ExternalPackageEntry({
                ...options,
                overrides: [override]
            });
            const results = dependencyEntry.getCssUrls(version);

            expect(semver.satisfies).toHaveBeenCalledWith(version, override.versions);

            const interpolatedVersion = options.versionPath.replace(/{{version}}/, version);
            const expectedUrl = [options.basePath, interpolatedVersion, override.css[0]].join('');
            expect(results).toEqual([ expectedUrl ]);
        });
    });
});
