import ac from 'argument-contracts';
import * as BuildStyleTagsModule from './build-style-tags';
import { resolveRequiredDependencyStyleTags } from './index';

describe('resolve required dependency style tags', () => {
    beforeEach(() => {
        spyOn(ac, 'assertType');
        spyOn(BuildStyleTagsModule, 'buildStyleTags');
    });

    it('should assert dependencies is an object', () => {
        const dependencies = [];

        resolveRequiredDependencyStyleTags({ dependencies, dependencyMap: {} });

        expect(ac.assertType).toHaveBeenCalledWith(dependencies, Object, 'dependencies');
    });

    it('should assert dependencyMap is an object', () => {
        const dependencyMap = { yes: 'but no' };

        resolveRequiredDependencyStyleTags({ dependencies: [], dependencyMap });

        expect(ac.assertType).toHaveBeenCalledWith(dependencyMap, Object, 'dependencyMap');
    });

    it('should build style tags for dependencies that exist in dependencyMap', () => {
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

        resolveRequiredDependencyStyleTags({ dependencies, dependencyMap });

        expect(BuildStyleTagsModule.buildStyleTags).toHaveBeenCalledWith(jasmine.objectContaining({
            externalPackageEntry: dependencyMap[dependencyNameOne],
            version: dependencies[0].version
        }));
        expect(BuildStyleTagsModule.buildStyleTags).toHaveBeenCalledWith(jasmine.objectContaining({
            externalPackageEntry: dependencyMap[dependencyNameTwo],
            version: dependencies[1].version
        }));

        expect(BuildStyleTagsModule.buildStyleTags).not.toHaveBeenCalledWith(jasmine.objectContaining({
            externalPackageEntry: dependencyMap[notInDepsDependencyName]
        }));
    });

    it('should return an array of style tags', () => {
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

        const expectedStyleTag = 'i.totally.exist';
        BuildStyleTagsModule.buildStyleTags.and.callFake(x => [
            expectedStyleTag
        ]);

        const result = resolveRequiredDependencyStyleTags({ dependencies, dependencyMap });

        expect(result).toEqual(jasmine.arrayContaining([
            expectedStyleTag
        ]))
    });
});