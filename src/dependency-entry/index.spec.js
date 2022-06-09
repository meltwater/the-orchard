import ac from 'argument-contracts';
import { DependencyEntry } from './index';
import * as ExternalPackageEntryModule from '../external-package-entry';
import { Logger } from '../logger';

describe('DependencyEntry', () => {
    let options;

    beforeEach(() => {
        spyOn(ac, 'assertArrayOf');
        spyOn(ac, 'assertBoolean');
        spyOn(ac, 'assertString');

        options = {
            packageName: '@thegreatest/package-you-ever-did-see',
            basePath: 'https://what.the.mother',
            versionPath: 'v{{version}}',
            es5: [ 'so.es5.much.js' ],
            esm: [ 'the.best.standard.evar.js' ],
            css: [ 'why.is.this.a.thing' ],
            orchardDependencies: [ '@meltwater/another-fun-package' ],
            conflictsWithOtherMajorVersions: true,
            requiresInitialization: false,
            contact: {
                email: 'yaaaaas',
                slack: '#yaaaaa-aaaaa-aaaaaas',
                url: 'https://yaaaaaaaas.so.much.yaaaaaaaaaas',
            }
        };
    });

    it('should assert packageName is a string', () => {
        options.packageName = '@yup/i-got-it';

        new DependencyEntry(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.packageName, 'packageName');
    });

    it('should assert basePath is a string', () => {
        options.basePath = 'https://all.about.that.base';

        new DependencyEntry(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.basePath, 'basePath');
    });

    it('should assert versionPath is a string', () => {
        options.versionPath = 'versionVersion{{version}}';

        new DependencyEntry(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.versionPath, 'versionPath');
    });

    it('should throw if versionPath does not contain {{version}} for mustaching', () => {
        options.versionPath = 'versionVersion';

        expect(() => new DependencyEntry(options)).toThrowError(/versionPath/);
    });

    it('should assert es5 is an array of strings', () => {
        options.es5 = [ 'crap.format.js' ];

        new DependencyEntry(options);

        expect(ac.assertArrayOf).toHaveBeenCalledWith(options.es5, String, 'es5');
    });

    it('should default es5 to an empty array if not provided', () => {
        delete options.es5;

        new DependencyEntry(options);

        expect(ac.assertArrayOf).toHaveBeenCalledWith([], String, 'es5');
    });

    it('should not throw if ochardDependencies is not defined', () => {
        delete options.orchardDependencies;

        expect(() => new DependencyEntry(options)).not.toThrow();
    });

    it('should assert orchardDependencies is an array of strings', () => {
        options.orchardDependencies = [ 'crap.format.js' ];

        new DependencyEntry(options);

        expect(ac.assertArrayOf).toHaveBeenCalledWith(options.orchardDependencies, String, 'orchardDependencies');
    });

    it('should assert ownedBy is a string', () => {
        options.ownedBy = 'amazingly.great.js';

        new DependencyEntry(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.ownedBy, 'ownedBy');
    });

    it('should assert repo is a string', () => {
        options.repo = 'amazingly.great.js';

        new DependencyEntry(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.repo, 'repo');
    });

    it('should assert esm is an array of strings', () => {
        options.esm = [ 'amazingly.great.js' ];

        new DependencyEntry(options);

        expect(ac.assertArrayOf).toHaveBeenCalledWith(options.esm, String, 'esm');
    });

    it('should default esm to an empty array', () => {
        delete options.esm;

        new DependencyEntry(options);

        expect(ac.assertArrayOf).toHaveBeenCalledWith([], String, 'esm');
    });

    it('should assert conflictsWithOtherMajorVersions is a boolean', () => {
        options.conflictsWithOtherMajorVersions= 'yup';

        new DependencyEntry(options);

        expect(ac.assertBoolean).toHaveBeenCalledWith(options.conflictsWithOtherMajorVersions, 'conflictsWithOtherMajorVersions');
    });

    it('should assert requiresInitialization is a boolean', () => {
        options.requiresInitialization = true;

        new DependencyEntry(options);
        expect(ac.assertBoolean).toHaveBeenCalledWith(options.requiresInitialization, 'requiresInitialization');
    });

    it('should throw if both es5 and esm are empty arrays', () => {
        options.es5 = [];
        options.esm = [];

        expect(() => new DependencyEntry(options)).toThrowError(/es5.*esm/);
    });

    it('should map options', () => {
        const result = new DependencyEntry(options);

        expect(result.contact).toEqual(jasmine.objectContaining(options.contact));
        expect(result.es5).toEqual(options.es5);
        expect(result.esm).toEqual(options.esm);
        expect(result.orchardDependencies).toEqual(options.orchardDependencies);
        expect(result.basePath).toEqual(options.basePath);
        expect(result.ownedBy).toEqual(options.ownedBy);
        expect(result.packageName).toEqual(options.packageName);
        expect(result.repo).toEqual(options.repo);
        expect(result.versionPath).toEqual(options.versionPath);
        expect(result.conflictsWithOtherMajorVersions).toEqual(options.conflictsWithOtherMajorVersions);
        expect(result.requiresInitialization).toEqual(options.requiresInitialization);
    });

    it('should be immutable', () => {
        const result = new DependencyEntry(options);

        expect(() => { result.es5 = ''; }).toThrow();
        expect(() => { result.esm = ''; }).toThrow();
        expect(() => { result.orchardDependencies = ''; }).toThrow();
        expect(() => { result.basePath = ''; }).toThrow();
        expect(() => { result.packageName = ''; }).toThrow();
        expect(() => { result.ownedBy = ''; }).toThrow();
        expect(() => { result.packageName = ''; }).toThrow();
        expect(() => { result.repo = ''; }).toThrow();
        expect(() => { result.contact = ''; }).toThrow();
        expect(() => { result.versionPath = ''; }).toThrow();
    });

    describe('getEs5Urls', () => {
        let dependencyEntry;
        beforeEach(() => {
            dependencyEntry = new DependencyEntry(options);
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
    });

    describe('getEsmUrls', () => {
        let dependencyEntry;
        beforeEach(() => {
            dependencyEntry = new DependencyEntry(options);
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
    });

    describe('getCssUrls', () => {
        it('should call through to ExternalPackageEntry getCssUrls', () => {
            spyOn(ExternalPackageEntryModule, 'ExternalPackageEntry').and.callFake(function (x) { return x; });
            const externalPackageEntry = {
                getCssUrls: jasmine.createSpy('getCssUrls'),
            };
            ExternalPackageEntryModule.ExternalPackageEntry.and.returnValue(externalPackageEntry);
            const dependencyEntry = new DependencyEntry(options);
            const version = 'something';

            dependencyEntry.getCssUrls(version);

            expect(externalPackageEntry.getCssUrls).toHaveBeenCalledWith(version);
        });
    });

    describe('hasConflictWithMajorVersion', () => {
        beforeEach(() => {
            spyOn(Logger, 'warn');
        });

        it('should throw if major version is not an integer', () => {
            spyOn(ac, 'assertNumber');

            const otherVersion = 'A potentially differently configured major version of the same dependency';
            const dependencyEntry = new DependencyEntry(options);

            try {
                dependencyEntry.hasConflictWithMajorVersion(otherVersion);
                fail('Expect exception to be thrown');
            }
            catch (error) {
                expect(ac.assertNumber).toHaveBeenCalledWith(otherVersion, 'majorVersion');
                expect(error.message).toMatch(/integer/);
            }
        });

        it('should return false if conflictsWithOtherMajorVersions is false', () => {
            const dependencyEntry = new DependencyEntry({
                ...options,
                conflictsWithOtherMajorVersions: false
            });

            expect(dependencyEntry.hasConflictWithMajorVersion(0)).toEqual(false);
        });

        it('should return true if conflictsWithOtherMajorVersions is true', () => {
            const dependencyEntry = new DependencyEntry({
                ...options,
                conflictsWithOtherMajorVersions: true
            });

            expect(dependencyEntry.hasConflictWithMajorVersion(0)).toEqual(true);
        });
    });
});
