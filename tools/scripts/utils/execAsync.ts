import { exec } from "child_process";

export const execAsync = (command: string) => {
	return new Promise<{ stdOut: string; stdErr: string }>((resolve, reject) =>
		exec(command, (err, stdOut, stdErr) => {
			if (err) {
				reject(err);
			}
			resolve({ stdOut, stdErr });
		}),
	);
};
