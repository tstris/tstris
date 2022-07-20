import packages from '../../package-manifest.json';
packages as string[];
import yargs from 'yargs';
import chalk from 'chalk';
import { hideBin } from 'yargs/helpers';
import { copyFileSync, readFileSync, rmdirSync, writeFileSync } from 'fs';
import { runExecutorsForAll } from './utils/runExecutorsForAll';

const invariant = (condition: boolean, message: string) => {
	if (!condition) {
		console.error(chalk.bold.red(message));
		process.exit(1);
	}
};

const argv = yargs(hideBin(process.argv))
	.option('ver', {
		type: 'string',
		requiresArg: true,
		description: 'Semver version of release',
	})
	.option('stage', {
		type: 'string',
		choices: ['alpha', 'beta', 'rc'],
		description: "Prerelease stage: 'alpha', 'beta' or 'rc'",
	})
	.option('stage-ver', {
		type: 'number',
		description: 'Prerelease stage version',
	})
	.option('tag', {
		type: 'string',
		default: 'next',
		description: 'Tag',
	})
	.option('skip-build', {
		type: 'boolean',
		default: false,
		description: 'Skip running build before publishing',
	})
	.option('skip-tests', {
		type: 'boolean',
		default: false,
		description: 'Skip running tests before publishing',
	})
	.option('otp', { type: 'string', requiresArg: true }).argv;

(async () => {
	const args = await argv;

	if (!args.ver) throw new Error('Must specify "--ver" option');

	let version = args.ver;

	if (args.stage) {
		if (!args.stageVer)
			throw new Error(
				'If "--stage" is specified, "--stage-ver" must also be specified as an integer',
			);
		if (args.stageVer.toString() !== args.stageVer.toFixed(0))
			throw new Error('"--stage-ver" must be an integer.');

		version = `${args.ver}-${args.stage}.${args.stageVer.toFixed(0)}`;
	}

	// A simple SemVer validation to validate the version
	const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;
	invariant(
		validVersion.test(version),
		`Version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${version}.`,
	);

	// clear old build results
	try {
		rmdirSync('dist');
	} catch (e) {
		void 0; // noop
	}

	const builds = args.skipBuild
		? []
		: runExecutorsForAll('build', {
				printStdErr: true,
				printStdOut: true,
				onSuccess: (packageName) => {
					// copy assets to dist dir for publishing

					copyFileSync(
						`packages/${packageName}/package.json`,
						`dist/packages/${packageName}/package.json`,
					);
					copyFileSync(
						`packages/${packageName}/README.md`,
						`dist/packages/${packageName}/README.md`,
					);
				},
		  });
	const tests = args.skipTests
		? []
		: runExecutorsForAll('test', { printStdErr: true, printStdOut: true });

	await Promise.all([...builds, ...tests]);

	if (!args.otp) throw new Error('"--otp" must be provided to publish');

	const publishes = runExecutorsForAll('publish', {
		args: { ver: version, tag: args.tag, otp: args.otp },
	});

	await Promise.all(publishes);

	// update root package.json
	try {
		const json = JSON.parse(readFileSync(`package.json`).toString());
		json.version = version;
		if (json.peerDependencies) {
			if (json.peerDependencies['@tstris/core'])
				json.peerDependencies['@tstris/core'] = version;
		}
		writeFileSync(`package.json`, JSON.stringify(json, null, '\t'));
	} catch (e) {
		console.error(chalk.bold.red(`Error reading root package.json.`));
		console.error(e);
	}

	// update src package.json versions as well
	packages.forEach((packageName) => {
		try {
			const json = JSON.parse(
				readFileSync(`packages/${packageName}/package.json`).toString(),
			);
			json.version = version;
			if (json.peerDependencies) {
				if (json.peerDependencies['@tstris/core'])
					json.peerDependencies['@tstris/core'] = version;
			}
			writeFileSync(`packages/${packageName}/package.json`, JSON.stringify(json, null, '\t'));
		} catch (e) {
			console.error(chalk.bold.red(`Error reading ${packageName} package.json.`));
			console.error(e);
		}
	});
})();
