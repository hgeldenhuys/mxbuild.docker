import {OptionsInterface} from "../interfaces/options.interface";
import * as fs from "fs";
import {Argv} from "yargs";
import * as http from "http";
const unzip = require("unzip");

const versions = require("../artefacts/versions.json");

export default async (options: OptionsInterface, yargs: Argv) => {
    const version = versions.versions.find(
        (version: { version: string }) => version.version === yargs.argv.downloadVersion
    );
    if (version === undefined) throw new Error(`Version ${yargs.argv.mendixVersion} is invalid`);
    const cachePath = `${options.tmp}/${version.modelerUrl.replace("http://files.herman.codes/mx-files/", "")}`;
    return new Promise<any>((fulfill, reject) => {
        if (!fs.existsSync(options.tmp)) {
            console.log(`Creating temp folder...`);
            fs.mkdirSync(options.tmp, { recursive: true });
        }
        if (!fs.existsSync(cachePath)) {
            if (!options.json) {
                console.log(`Downloading ${version.modelerUrl}`);
            }
            const file = fs.createWriteStream(cachePath);
            http.get(version.modelerUrl, async function (response) {
                response.pipe(file)
                    .on('finish', function() {
                        console.log("Unzipping...");
                        fs.createReadStream(cachePath)
                            .pipe(unzip.Extract({ path: options.tmp }))
                            .on('finish', function() {
                                fulfill("Done");
                            });
                });
            })
        } else {
            fulfill("Already cached");
        }
    });
}