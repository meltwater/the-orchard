import ac from 'argument-contracts';
import { NpmDependency } from '../../npm-dependency';
import { orderDependenciesDescending } from './index';

describe('order dependencies descending', () => {
    beforeEach(() => {
        spyOn(ac, 'assertArrayOf');
    });

    it('should assert dependencies is an array of NpmDependency', () => {
        const dependencies = [ 1,2,3 ];

        orderDependenciesDescending(dependencies);

        expect(ac.assertArrayOf).toHaveBeenCalledWith(dependencies, NpmDependency, 'dependencies');
    });

    it('should return dependency array in correct order', () => {
        const dependencies = [
            {
                depth: 0
            },
            {
                depth: 10
            },
            {
                depth: 5
            }
        ];

        const result = orderDependenciesDescending(dependencies);

        expect(result).toEqual([
            dependencies[1],
            dependencies[2],
            dependencies[0]
        ]);
    });
});
