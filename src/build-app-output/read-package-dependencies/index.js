import ac from 'argument-contracts';
import fs from 'fs';

export function readPackageDependencies(packageFilePath) {
    ac.assertString(packageFilePath);

    if(!fs.existsSync(packageFilePath)) {
        throw new Error(`The package file path passed does not exist. Provided value: ${packageFilePath}`);
    }

    const packageContents = fs.readFileSync(packageFilePath, 'utf8');
    const packageJson = JSON.parse(packageContents);

    if(!packageJson.dependencies) {
        throw new Error(`The package file passed does not contain any dependencies! Passed value: ${packageFilePath}`);
    }

    return packageJson.dependencies;
}