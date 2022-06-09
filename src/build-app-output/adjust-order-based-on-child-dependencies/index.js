import { Logger } from '../../logger';
import { NpmDependencyWithChildDependencies } from '../npm-dependency-with-child-dependencies';

const MAX_ITERATION_COUNT_SAFETY = 50;

export function adjustOrderBasedOnChildDependencies({ npmDependenciesWithChildDependencies, previousHash = '', iterationCount = 0 }) {
    const currentHash = JSON.stringify(npmDependenciesWithChildDependencies);
    if (currentHash === previousHash) {
        return npmDependenciesWithChildDependencies;
    }

    if (iterationCount >= MAX_ITERATION_COUNT_SAFETY) {
        Logger.warn('MAXIMUM ITERATION COUNT EXCEEDED WHILE TRYING TO REFINE DEPENDENCY ORDER!');
        return npmDependenciesWithChildDependencies;
    }

    const updatedArray = [];

    npmDependenciesWithChildDependencies.forEach(item => {
        if (!item.skipped) {
            item.childDependencies.forEach(childDependency => {
                if (!updatedArray.some((existingItem) => dependenciesAreAMatch(existingItem, childDependency))) {
                    const dependencyIndex = npmDependenciesWithChildDependencies.findIndex((depToCompare) => dependenciesAreAMatch(depToCompare, childDependency));
                    updatedArray.push(new NpmDependencyWithChildDependencies(npmDependenciesWithChildDependencies[dependencyIndex]));
                    npmDependenciesWithChildDependencies[dependencyIndex] = {
                        ...npmDependenciesWithChildDependencies[dependencyIndex],
                        skipped: true
                    };
                }
            });
            updatedArray.push(item);
        }
    });

    return adjustOrderBasedOnChildDependencies({
        npmDependenciesWithChildDependencies: updatedArray,
        previousValue: JSON.stringify(updatedArray),
        iterationCount: iterationCount + 1
    });
}

function dependenciesAreAMatch(oneDep, twoDep) {
    return oneDep.packageName === twoDep.packageName && majorVersionsAreTheSame(oneDep.version, twoDep.version);
}

function majorVersionsAreTheSame(oneVersion, twoVersion) {
    const oneVersionParts = oneVersion.split('.');
    const twoVersionParts = twoVersion.split('.');

    return oneVersionParts[0] === twoVersionParts[0];
}