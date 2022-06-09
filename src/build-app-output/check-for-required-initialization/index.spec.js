import ac from 'argument-contracts';
import { checkForRequiredInitialization } from './index';
import { Logger } from '../../logger';
import { NpmDependency } from '../../npm-dependency';

const PACKAGE_ONE = 'Flavortown';
const PACKAGE_TWO = 'Hot Sauce City';

describe('Check for Required Initialization', () => {
    let orchardDependencies;
    beforeEach(() => {
        spyOn(ac, 'assertArrayOf');
        spyOn(Logger, 'debug');
        spyOn(Logger, 'warn');

        orchardDependencies = {
            [PACKAGE_ONE]: {
                requiresInitialization: true
            },
            [PACKAGE_TWO]: {
                requiresInitialization: false
            }
        }
    });

    it('should assert dependencies are of type NpmDependency', () => {
        const dependencies = [{
            packageName: 'Triple D',
            verion: '1.2.3',
            depth: 2
        }];

        checkForRequiredInitialization({dependencies, dependencyMap: orchardDependencies});

        expect(ac.assertArrayOf).toHaveBeenCalledWith(dependencies, NpmDependency, 'dependencies');
    });

    it('should warn if a package requires initialization', () => {
        const dependencies = [
            {
                packageName: PACKAGE_ONE
            },
            {
                packageName: PACKAGE_TWO
            }
        ];
        checkForRequiredInitialization({dependencies, dependencyMap: orchardDependencies});

        expect(Logger.warn).toHaveBeenCalledWith(jasmine.stringMatching(/initializ/));
    });

    it('should NOT warn if no packages require initialization', () => {
        const dependencies = [
            {
                packageName: PACKAGE_TWO
            },
            {
                packageName: 'Something entirely different'
            }
        ];
        checkForRequiredInitialization({dependencies, dependencyMap: orchardDependencies});

        expect(Logger.warn).not.toHaveBeenCalled();
    });
});
