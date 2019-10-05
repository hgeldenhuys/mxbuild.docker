import {Argv} from 'yargs';
import logo from "./artefacts/logo"
import {OptionsInterface} from "./interfaces/options.interface";
import listVersions from "./commands/list-versions.command";
import downloadVersion from "./commands/download-version.command";
import chalk from "chalk";
import setupCmdArgs from "./args/args";

const yargs = setupCmdArgs();

const options: OptionsInterface = {
    json: !!yargs.argv.json,
    tmp: `${process.env.PWD}/tmp`
};

const commands: { [key: string]: (options: OptionsInterface, yargs: Argv) => Promise<any> | string } = {
    listVersions,
    downloadVersion
};

let command = yargs.argv.listVersions ? commands.listVersions :
    (yargs.argv.downloadVersion ? commands.downloadVersion : undefined);

logo(options.json);

const logOutput = async (result: Promise<any> | string) => {
    console.log(await result);
};

if (command === undefined) {
    console.error(chalk.red(`Invalid usage!`));
} else {
    logOutput(command(options, yargs));
}

