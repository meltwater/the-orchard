import { throwIfZerothLevelDepNotHighestMajorVersion } from './index';

describe('throwIfZerothLevelDepNotHighestMajorVersion', () => {
    it('should throw if a 0 level dependency is not the hightest major version', () => {
        const dependencies = [
            {
                packageName: 'the-greatest',
                depth: 0,
                version: '0.0.1'
            },
            {
                packageName: 'the-greatest',
                depth: 1,
                version: '1.0.0'
            }
        ];

        expect(() => throwIfZerothLevelDepNotHighestMajorVersion(dependencies)).toThrowError(/highest/);
    });

    it('should NOT throw if a 0 level dependency is hightest major version', () => {
        const dependencies = [
            {
                packageName: 'the-greatest',
                depth: 0,
                version: '1.0.0'
            },
            {
                packageName: 'the-greatest',
                depth: 1,
                version: '0.0.1'
            }
        ];

        expect(() => throwIfZerothLevelDepNotHighestMajorVersion(dependencies)).not.toThrow();
    });
});
