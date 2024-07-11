import ac from 'argument-contracts';
import { resolveRequiredDependencyScripts } from './index';

describe('resolve required dependency scripts', () => {
    beforeEach(() => {
        spyOn(ac, 'assertType');
    });

    it('should assert dependencies is an object', () => {
        const dependencies = [];

        resolveRequiredDependencyScripts({ dependencies, dependencyMap: {} });

        expect(ac.assertType).toHaveBeenCalledWith(dependencies, Object, 'dependencies');
    });

    it('should assert dependencyMap is an object', () => {
        const dependencyMap = { yes: 'but no' };

        resolveRequiredDependencyScripts({ dependencies: [], dependencyMap });

        expect(ac.assertType).toHaveBeenCalledWith(dependencyMap, Object, 'dependencyMap');
    });

    it('should return an array of scripts', () => {
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
            [dependencyNameOne]: { dep: 'yup', getEsmUrls: () => ['yup'] },
            [dependencyNameTwo]: { dep: 'yarp', getEsmUrls: () => ['yarp'] },
            [notInDepsDependencyName]: { notDep: 'nope', getEsmUrls: () => ['nope'] }
        };

        const result = resolveRequiredDependencyScripts({ dependencies, dependencyMap });

        expect(result).toEqual(jasmine.arrayContaining([
            dependencyMap[dependencyNameOne].dep,
            dependencyMap[dependencyNameTwo].dep,
        ]))
    });
});
