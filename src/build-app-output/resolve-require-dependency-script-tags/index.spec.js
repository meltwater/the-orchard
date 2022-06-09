import ac from 'argument-contracts';
import * as BuildScriptTagsModule from './build-script-tags';
import { resolveRequiredDependencyScriptTags } from './index';

describe('resolve required dependency script tags', () => {
    beforeEach(() => {
        spyOn(ac, 'assertType');
        spyOn(BuildScriptTagsModule, 'buildScriptTags');
    });

    it('should assert dependencies is an object', () => {
        const dependencies = [];

        resolveRequiredDependencyScriptTags({ dependencies, dependencyMap: {} });

        expect(ac.assertType).toHaveBeenCalledWith(dependencies, Object, 'dependencies');
    });

    it('should assert dependencyMap is an object', () => {
        const dependencyMap = { yes: 'but no' };

        resolveRequiredDependencyScriptTags({ dependencies: [], dependencyMap });

        expect(ac.assertType).toHaveBeenCalledWith(dependencyMap, Object, 'dependencyMap');
    });

    it('should build script tags for dependencies that exist in dependencyMap', () => {
        const dependencyNameOne = '@meltwater/the-big-bad-dependency-dude';
        const dependencyNameTwo = '@meltwater/way-to-dependency-man';
        const notInDepsDependencyName = '@meltwater/no-deps-on-me';

        const dependencies = [
            {
                packageName: dependencyNameOne,
                version: '2.3.2',
            },
            {
                packageName: dependencyNameTwo,
                version: '0.0.1'
            }
        ];
        const dependencyMap = {
            [dependencyNameOne]: { one: 'yup' },
            [dependencyNameTwo]: { two: 'hahah' },
            [notInDepsDependencyName]: { notDep: 'nope' }
        };

        resolveRequiredDependencyScriptTags({ dependencies, dependencyMap });

        expect(BuildScriptTagsModule.buildScriptTags).toHaveBeenCalledWith(jasmine.objectContaining({
            externalPackageEntry: dependencyMap[dependencyNameOne],
            version: dependencies[0].version
        }));
        expect(BuildScriptTagsModule.buildScriptTags).toHaveBeenCalledWith(jasmine.objectContaining({
            externalPackageEntry: dependencyMap[dependencyNameTwo],
            version: dependencies[1].version
        }));

        expect(BuildScriptTagsModule.buildScriptTags).not.toHaveBeenCalledWith(jasmine.objectContaining({
            externalPackageEntry: dependencyMap[notInDepsDependencyName]
        }));
    });

    it('should return an array of script tags', () => {
        const dependencyNameOne = '@meltwater/the-big-bad-dependency-dude';
        const dependencyNameTwo = '@meltwater/way-to-dependency-man';
        const notInDepsDependencyName = '@meltwater/no-deps-on-me';

        const dependencies = [
            {
                packageName: dependencyNameOne,
                version: '2.3.2',
            },
            {
                packageName: dependencyNameTwo,
                version: '0.0.1'
            }
        ];
        const dependencyMap = {
            [dependencyNameOne]: { one: 'yup' },
            [dependencyNameTwo]: { two: 'yup' },
            [notInDepsDependencyName]: { notDep: 'nope' }
        };
        BuildScriptTagsModule.buildScriptTags.and.callFake(x => [
            x.externalPackageEntry
        ]);

        const result = resolveRequiredDependencyScriptTags({ dependencies, dependencyMap });

        expect(result).toEqual(jasmine.arrayContaining([
            dependencyMap[dependencyNameOne],
            dependencyMap[dependencyNameTwo],
        ]))
    });
});
