import ac from 'argument-contracts';
import { DependencyEntry } from '../../dependency-entry';
import fs from 'fs';
import jsYaml from 'js-yaml';
import { Logger } from '../../logger';
import path from 'path';

export function getDependencyPackages(yamlDirectory) {
    ac.assertString(yamlDirectory, 'yamlDirectory');
    const files = fs.readdirSync(yamlDirectory);

    const dependencyEntries = files.map(file => {
        const fileContent = fs.readFileSync(path.join(yamlDirectory, file), 'utf8');
        const jsonContent = jsYaml.load(fileContent);
        let packageName;
        try {
            const keys = Object.keys(jsonContent);
            if (keys.length > 1) {
                throw new Error(`The parsed dependency has more than one key at the top level. Json Content: ${JSON.stringify(jsonContent, null, 2)}`);
            }
            packageName = keys[0];
        } catch (error) {
            Logger.error(`An error occurred attempting to parse a file. File: ${file}`);
            Logger.error('Inner error', error);
            throw error;
        }

        return new DependencyEntry({
            packageName,
            ...jsonContent[packageName]
        });
    }).reduce((dependenciesMap, dependencyEntry) => {
        dependenciesMap[dependencyEntry.packageName] = dependencyEntry;
        return dependenciesMap;
    }, {});

    return dependencyEntries;
}
