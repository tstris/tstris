import packages from '../../../package-manifest.json';
import { execAsync } from './execAsync';
packages as string[];

interface RunExecutorsForAllOptions<Args extends Record<string, string>> {
	args?: Args;
	packageOverride?: string[];
	printStdOut?: boolean;
	printStdErr?: boolean;
	onSuccess?: (packageName: string) => void;
}

export const runExecutorsForAll = <Args extends Record<string, string> = Record<string, string>>(
	executor: string,
	{ args, packageOverride, printStdErr, printStdOut, onSuccess = () => {} }: RunExecutorsForAllOptions<Args> = {},
) => {
	return (packageOverride || packages).map((packageName) =>
		execAsync(
			`npx nx run ${packageName}:${executor}${
				args
					? Object.entries(args)
							.map(([key, value]) => ` --${key}=${value}`)
							.join('')
					: ''
			}`,
		).then((value) => {
			if (printStdOut) console.log(value.stdOut);
			if (printStdErr) console.error(value.stdErr);
			return value;
		}).then((value) => {
			onSuccess(packageName);
			return value;
		}),
	);
};
