import ac from 'argument-contracts';
import * as DependencyEntryModule from '../../dependency-entry';
import fs from 'fs';
import jsYaml from 'js-yaml';
import { getDependencyPackages } from './index';
import path from 'path';

const READ_FILE_SUFFIX = 'Yurp-I reads it';
const PARSED_FILE_SUFFIX = 'Yarp-parsed it be';
describe('Parsing Dependency Yaml Files', () => {
    beforeEach(() => {
        spyOn(DependencyEntryModule, 'DependencyEntry').and.returnValue({});
        spyOn(fs, 'readdirSync').and.returnValue([]);
        spyOn(fs, 'readFileSync').and.callFake(x => x + READ_FILE_SUFFIX);
        spyOn(jsYaml, 'load').and.callFake(x => ({
            [x + PARSED_FILE_SUFFIX]: {
                more: 'other options'
            }
        }));
    });

    it('should assert yamlDirectory is a string', () => {
        spyOn(ac, 'assertString');
        const yamlDirectory = 'Hollllllllah!';

        getDependencyPackages(yamlDirectory);

        expect(ac.assertString).toHaveBeenCalledWith(yamlDirectory, jasmine.stringMatching(/yamlDirectory/));
    });

    it('should read files from yamlDirectory', () => {
        const yamlDirectory = 'Hollllllllah!';

        getDependencyPackages(yamlDirectory);

        expect(fs.readdirSync).toHaveBeenCalledWith(yamlDirectory);
    });

    it('should parse files into a DependencyEntry', () => {
        const expectedFilename = 'the one less traveled';
        fs.readdirSync.and.returnValue([expectedFilename]);

        const yamlDirectory = 'All the things';
        const expectedFilePath = path.join(yamlDirectory, expectedFilename);
        const fileContent = 'How many yumps does a yaml have?';
        fs.readFileSync.and.returnValue(fileContent);

        const packageNameAsKey = 'key';
        const dependencyConfig = { isJason: 'NO! That is not how it is spelled!!!' };
        jsYaml.load.and.returnValue({
            [packageNameAsKey]: dependencyConfig
        });

        getDependencyPackages(yamlDirectory);

        expect(fs.readFileSync).toHaveBeenCalledWith(expectedFilePath, 'utf8');
        expect(jsYaml.load).toHaveBeenCalledWith(fileContent);
        expect(DependencyEntryModule.DependencyEntry).toHaveBeenCalledWith({
            ...dependencyConfig,
            packageName: packageNameAsKey
        });
    });

    it('should parse each file into a single DependencyEntry', () => {
        spyOn(console, 'error');

        fs.readdirSync.and.returnValue(['yesssss']);
        jsYaml.load.and.callFake(x => ({
            one: 'Yay',
            two: 'uh oh!'
        }));

        expect(() => getDependencyPackages('whatever')).toThrowError(/top level/);
    });

    it('should return a map of dependencies', () => {
        const packageName = '@ups/on-the-truck';
        const dependencyEntry = {
            packageName
        };

        DependencyEntryModule.DependencyEntry.and.returnValue(dependencyEntry);

        fs.readdirSync.and.returnValue(['need something']);
        const result = getDependencyPackages('Woooooooo hooooooooo!');

        expect(result).toEqual(jasmine.objectContaining({
            [packageName]: dependencyEntry
        }));
    });
});
