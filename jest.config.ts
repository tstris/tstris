import { getJestProjects } from '@nrwl/jest';
import type { InitialOptionsTsJest } from 'ts-jest/dist/types';

export default {
	projects: getJestProjects(),
	globals: {
		'ts-jest': {
			isolatedModules: true
		}
	}
} as InitialOptionsTsJest;
