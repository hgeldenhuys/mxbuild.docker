import yargs, {Argv} from 'yargs';
import logo from "./artefacts/logo"
import {OptionsInterface} from "./interfaces/options.interface";
import listVersions from "./commands/list-versions.command";
import downloadVersion from "./commands/download-version.command";
import chalk from "chalk";
const versions = require("./artefacts/versions.json");

export interface ArgInterface {
    verbose: boolean;
}

yargs
    .option("download-version", {
        alias: "mxv",
        description: "download and cache a mendix distribution version",
        conflicts: [
            "list-versions"
        ],
        type: "string",
        choices: versions.versions.map((version: {version: string}) => version.version)
    })
    .option("list-versions", {
        alias: "lv",
        description: "list of supported Mendix versions"
    })
    .option("json", {
        alias: "j",
        description: "command output as JSON"
    });

const options: OptionsInterface = {
    json: !!yargs.argv.json,
    tmp: `${process.env.PWD}/tmp`
};

const commands: {[key: string]: (options: OptionsInterface, yargs: Argv) => Promise<any>} = {
    listVersions,
    downloadVersion
};

const command = yargs.argv.listVersions ? commands.listVersions :
                (yargs.argv.downloadVersion ? commands.downloadVersion : undefined);

console.log(logo);

const logOutput = async (result: Promise<any>) => {
    console.log(await result);
};

if (command === undefined) {
    console.error(chalk.red(`Invalid usage!`));
} else {
    logOutput(command(options, yargs));
}

// console.log(yargs.argv);

