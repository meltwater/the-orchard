import ac from 'argument-contracts';
import { ChildDependency } from './index';
import * as CoerceVersionModule from '../coerce-version';
import { Logger } from '../../../logger';


describe('child dependency', () => {
    let options;

    beforeEach(() => {
        options = {
            packageName: 'yaaaas',
            version: '1.2.3'
        };

        spyOn(ac, 'assertString');
        spyOn(CoerceVersionModule, 'coerceVersion').and.callFake(x => x);
        spyOn(Logger, 'debug');
    });

    it('should assert packageName is a string', () => {
        new ChildDependency(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.packageName, 'packageName');
    });

    it('should assert version is a string', () => {
        new ChildDependency(options);

        expect(ac.assertString).toHaveBeenCalledWith(options.version, 'version');
    });

    it('should coerce version', () => {
        new ChildDependency(options);

        expect(CoerceVersionModule.coerceVersion).toHaveBeenCalledOnceWith(options.version);
    });

    it('should throw if the version is invalid', () => {
        CoerceVersionModule.coerceVersion.and.returnValue(null);

        expect(() => new ChildDependency({
            ...options,
            version: 'not at all valid'
        })).toThrowError(/version/);
    });

    it('should map properties', () => {
        const result = new ChildDependency(options);

        expect(result.packageName).toEqual(options.packageName);
        expect(result.version).toEqual(options.version);
    });

    it('should be able to be created from itself', () => {
        const result = new ChildDependency(options);
        const resultTwo = new ChildDependency(result);

        expect(result.packageName).toEqual(resultTwo.packageName);
        expect(result.version).toEqual(resultTwo.version);
    });

    it('should be immutable', () => {
        const result = new ChildDependency(options);

        expect(() => { result.packageName = 'yolo'; }).toThrow();
        expect(() => { result.version = 'yolo'; }).toThrow();
    });
});