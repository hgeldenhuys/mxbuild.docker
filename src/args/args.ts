import yargs, {Argv} from "yargs";
const versions = require("../artefacts/versions.json");

export default function setupCmdArgs() {
    yargs
        .option("download-version", {
            alias: "mxv",
            description: "download and cache a mendix distribution version",
            conflicts: [
                "list-versions"
            ],
            type: "string",
            choices: versions.versions.map((version: { version: string }) => version.version)
        })
        .option("list-versions", {
            alias: "lv",
            description: "list of supported Mendix versions"
        })
        .option("json", {
            alias: "j",
            description: "command output as JSON"
        })
        .command("build-docker", "Build a Docker Image from a Mendix App", (argv: Argv) => {
            argv
                .demandOption("deployment-source", "I need your compiled project or deployment folder");
            return argv;
        })
        .option("deployment-source", {
            description: "the folder containing your deployment structure (compiled)",
            type: "string"
        });
    return yargs;
}