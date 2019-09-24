import yargs, {Argv} from 'yargs';
import logo from "./artefacts/logo"
import {OptionsInterface} from "./interfaces/options.interface";
import listVersions from "./commands/list-versions.command";

export interface ArgInterface {
    verbose: boolean;
}

yargs
    .option("list-versions", {
        alias: "lv",
        description: "list of supported Mendix versions"
    })
    .option("json", {
        alias: "j",
        description: "command output as JSON"
    });

const options: OptionsInterface = {
    json: !!yargs.argv.json
};

const commands: {[key: string]: (options: OptionsInterface) => string | object} = {
    listVersions
};

const command = commands.listVersions;

console.log(logo);

if (command === undefined) {
    yargs.help()
} else {
    console.log(command(options));
}

// console.log(yargs.argv);

