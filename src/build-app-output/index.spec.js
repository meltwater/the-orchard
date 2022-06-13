import ac from 'argument-contracts';
import { ORCHARD_INJECT_STRING } from '../constants';
import * as AdjustOrderBasedOnChildDependenciesModule from './adjust-order-based-on-child-dependencies';
import * as CheckForRequiredInitializationModule from './check-for-required-initialization';
import { CliOptions } from '../cli-options';
import fs from 'fs';
import * as BuildDependencyArrayModule from './build-dependency-array';
import * as GetDependencyPackagesModule from './get-dependency-packages';
import { Logger } from '../logger';
import * as PareDownToKnownPackagesModule from './pare-down-to-known-packages';
import path from 'path';
import * as ReadPackageDependenciesModule from './read-package-dependencies';
import * as ResolveRequiredDependencyScriptTagsModule from './resolve-require-dependency-script-tags';
import * as ResolveRequiredDependencyStyleTagsModule from './resolve-required-dependency-style-tags';
import * as RollupLatestMajorVersionsModule from './rollup-latest-major-versions';
import * as ThrowForConflictingMajorVersionsModule from './throw-for-conflicting-major-versions';
import * as ThrowIfZerothLevelDepNotHighestMajorVersionModule from './throw-if-zeroth-level-dep-not-highest-major-version';

import { buildAppOutput } from './index';

describe('build app output', () => {
    let cliOptions;

    beforeEach(() => {

        spyOn(ac, 'assertType');
        spyOn(AdjustOrderBasedOnChildDependenciesModule, 'adjustOrderBasedOnChildDependencies').and.returnValue([]);
        spyOn(CheckForRequiredInitializationModule, 'checkForRequiredInitialization');
        spyOn(fs, 'writeFileSync');
        spyOn(BuildDependencyArrayModule, 'buildDependencyArray').and.resolveTo([]);
        spyOn(GetDependencyPackagesModule, 'getDependencyPackages').and.resolveTo([]);
        spyOn(Logger, 'setLoggingLevel');
        spyOn(PareDownToKnownPackagesModule, 'pareDownToKnownPackages').and.returnValue([]);
        spyOn(ReadPackageDependenciesModule, 'readPackageDependencies');
        spyOn(ResolveRequiredDependencyScriptTagsModule, 'resolveRequiredDependencyScriptTags').and.returnValue([]);
        spyOn(ResolveRequiredDependencyStyleTagsModule, 'resolveRequiredDependencyStyleTags').and.returnValue([]);
        spyOn(RollupLatestMajorVersionsModule, 'rollupLatestMajorVersions').and.returnValue([]);
        spyOn(ThrowForConflictingMajorVersionsModule, 'throwForConflictingMajorVersions');
        spyOn(ThrowIfZerothLevelDepNotHighestMajorVersionModule, 'throwIfZerothLevelDepNotHighestMajorVersion');
        spyOn(Logger, 'debug');

        cliOptions = new CliOptions({
            excludeDirectDependencies: false,
            dependencyDirectory: 'her/there/everywhere',
            openFileLimit: 4,
            orchardInjectString: '<!-- wat -->',
            outputFile: 'plumbus.html',
            retryOpenFileSleepDuration: 10
        });
    });

    it('should assert cliOptions is CliOptions', async () => {
        await buildAppOutput(cliOptions);

        expect(ac.assertType).toHaveBeenCalledWith(cliOptions, CliOptions, 'cliOptions');
    });

    it('should set logging level from cliOptions', async () => {
        const logging = 'complete deforestation';
        await buildAppOutput({
            ...cliOptions,
            logging
        });

        expect(Logger.setLoggingLevel).toHaveBeenCalledWith(logging);
    });

    it('should read package.json dependencies from cliOptions', async () => {
        const pathToPackageJson = 'go/here/for/package.json';
        await buildAppOutput({
            ...cliOptions,
            pathToPackageJson
        });

        expect(ReadPackageDependenciesModule.readPackageDependencies).toHaveBeenCalledWith(path.join(process.cwd(), pathToPackageJson));
    });

    it('should get array of dependencies', async () => {
        const openFileLimit = 'twenty';
        const retryOpenFileSleepDuration = '1 siesta';

        await buildAppOutput({
            ...cliOptions,
            openFileLimit,
            retryOpenFileSleepDuration
        });

        expect(BuildDependencyArrayModule.buildDependencyArray).toHaveBeenCalledWith(jasmine.objectContaining({
            currentWorkingDirectory: jasmine.any(String),
            pathToPackageJson: cliOptions.pathToPackageJson
        }));
    });

    it('should rollup major versions', async () => {
        const packageDependencies = [1, 2, 3];
        PareDownToKnownPackagesModule.pareDownToKnownPackages.and.returnValue(packageDependencies);

        await buildAppOutput(cliOptions);

        expect(RollupLatestMajorVersionsModule.rollupLatestMajorVersions).toHaveBeenCalledWith(packageDependencies);
    });

    it('should check for package major version conflicts', async () => {
        const dependencyMap = { yes: 'maybe..... no' };
        const packageDependencies = [1, 2, 3];
        GetDependencyPackagesModule.getDependencyPackages.and.resolveTo(dependencyMap);
        RollupLatestMajorVersionsModule.rollupLatestMajorVersions.and.returnValue(packageDependencies);

        await buildAppOutput(cliOptions);

        expect(ThrowForConflictingMajorVersionsModule.throwForConflictingMajorVersions).toHaveBeenCalledWith({
            dependencies: packageDependencies,
            dependencyMap
        });
    });

    it('should check for required initializations', async () => {
        const dependencyMap = { yes: 'maybe..... no' };
        const packageDependencies = [3, 2, 1];
        GetDependencyPackagesModule.getDependencyPackages.and.resolveTo(dependencyMap);
        RollupLatestMajorVersionsModule.rollupLatestMajorVersions.and.returnValue(packageDependencies);

        await buildAppOutput(cliOptions);

        expect(CheckForRequiredInitializationModule.checkForRequiredInitialization).toHaveBeenCalledWith({ dependencies: packageDependencies, dependencyMap });
    });

    it('should checkout for package 0 level dependency not major version issues', async () => {
        const dependencyMap = { yes: 'maybe..... no' };
        const packageDependencies = [1, 2, 3];
        GetDependencyPackagesModule.getDependencyPackages.and.resolveTo(dependencyMap);
        RollupLatestMajorVersionsModule.rollupLatestMajorVersions.and.returnValue(packageDependencies);

        await buildAppOutput(cliOptions);

        expect(ThrowIfZerothLevelDepNotHighestMajorVersionModule.throwIfZerothLevelDepNotHighestMajorVersion).toHaveBeenCalledWith(packageDependencies);
    });

    it('should resolve dependency script tags', async () => {
        const dependencyMap = { all: 'The things!' };
        GetDependencyPackagesModule.getDependencyPackages.and.resolveTo(dependencyMap);

        await buildAppOutput(cliOptions);

        expect(ResolveRequiredDependencyScriptTagsModule.resolveRequiredDependencyScriptTags).toHaveBeenCalledWith(jasmine.objectContaining({
            dependencyMap: jasmine.objectContaining(dependencyMap)
        }));
    });

    it('should resolve dependency style tags', async () => {
        const packageDependencies = [1, 2, 3];
        const dependencyMap = { all: 'The things!' };
        AdjustOrderBasedOnChildDependenciesModule.adjustOrderBasedOnChildDependencies.and.returnValue(packageDependencies);
        GetDependencyPackagesModule.getDependencyPackages.and.resolveTo(dependencyMap);

        await buildAppOutput(cliOptions);

        expect(ResolveRequiredDependencyStyleTagsModule.resolveRequiredDependencyStyleTags).toHaveBeenCalledWith({
            dependencies: packageDependencies,
            dependencyMap
        });
    });

    it('should resolve dependency tree', async () => {
        const packageDependencies = [1, 2, 3];
        AdjustOrderBasedOnChildDependenciesModule.adjustOrderBasedOnChildDependencies.and.returnValue(packageDependencies);

        await buildAppOutput(cliOptions);

        expect(ResolveRequiredDependencyScriptTagsModule.resolveRequiredDependencyScriptTags).toHaveBeenCalledWith(jasmine.objectContaining({
            dependencies: packageDependencies
        }));
    });

    describe('injection handling', () => {
        beforeEach(() => {
            spyOn(fs, 'readFileSync');
        });

        it('should read file to inject to', async () => {
            const injectFile = 'inject/file/location.txt';
            fs.readFileSync.and.returnValue('');

            await buildAppOutput({
                ...cliOptions,
                injectFile
            });

            expect(fs.readFileSync).toHaveBeenCalledWith(injectFile, { encoding: 'utf8' });
        });

        it('should inject output into the file', async () => {
            const orchardInjectString = 'watwatwatwatwat';
            const outputFile = 'The best output';
            const beforeInjectionLocation = 'This file has been injected into!';
            const afterInjectionLocation = 'YEAH BOIIIIIIIIIII!';
            const fileContent = `${beforeInjectionLocation}${orchardInjectString}${afterInjectionLocation}`;
            const output = 'The greatest output Evar';
            fs.readFileSync.and.returnValue(fileContent);
            ResolveRequiredDependencyScriptTagsModule.resolveRequiredDependencyScriptTags.and.returnValue([output])

            await buildAppOutput({
                ...cliOptions,
                injectFile: 'yarp.txt',
                orchardInjectString,
                outputFile
            });


            expect(fs.writeFileSync).toHaveBeenCalledWith(outputFile, jasmine.stringMatching(beforeInjectionLocation));
            expect(fs.writeFileSync).toHaveBeenCalledWith(outputFile, jasmine.stringMatching(output));
            expect(fs.writeFileSync).toHaveBeenCalledWith(outputFile, jasmine.stringMatching(afterInjectionLocation));
        });
    });

    it('should output tags array', async () => {
        const outputFile = 'The best output';

        const dependencyOutput = 'AW YEAH!';
        ResolveRequiredDependencyScriptTagsModule.resolveRequiredDependencyScriptTags.and.returnValue([dependencyOutput])

        await buildAppOutput({
            ...cliOptions,
            outputFile
        });

        expect(fs.writeFileSync).toHaveBeenCalledWith(outputFile, jasmine.stringMatching(dependencyOutput));
    });

    it('should wrap output in comments', async () => {
        const outputFile = 'The best output';

        const output = 'YAYAYAYAYAYAY';
        ResolveRequiredDependencyScriptTagsModule.resolveRequiredDependencyScriptTags.and.returnValue([output])

        await buildAppOutput({
            ...cliOptions,
            outputFile
        });

        expect(fs.writeFileSync).toHaveBeenCalledWith(outputFile, jasmine.stringMatching(/^\n?<!--/));
        expect(fs.writeFileSync).toHaveBeenCalledWith(outputFile, jasmine.stringMatching(/-->$/));
    });
});
