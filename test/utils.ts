import { exec } from "child_process";
import * as _ from "lodash";

export interface ExecuteOptions {
    printOutput: boolean;
}

export async function execute(
    command: string,
    options: ExecuteOptions = { printOutput: false }
): Promise<void> {
    const output = await new Promise((resolve, reject) =>
        exec(command, { encoding: "utf8" }, (err, stdout) => {
            if (err) reject(err);
            else resolve(stdout.trim());
        })
    );
    if (options.printOutput) {
        console.log(output);
    }
}

export const generateIndex = (() => {
    let index = _.random(1, 100);
    return () => index++;
})();
