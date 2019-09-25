import {OptionsInterface} from "../interfaces/options.interface";
import * as fs from "fs";
import {Argv} from "yargs";
import * as http from "http";
const unzip = require("unzip");

import shell from "shelljs";

const versions = require("../artefacts/versions.json");

export default async (options: OptionsInterface, yargs: Argv) => {
    const version = versions.versions.find(
        (version: { version: string }) => version.version === yargs.argv.downloadVersion
    );
    if (version === undefined) throw new Error(`Version ${yargs.argv.mendixVersion} is invalid`);
    const cachePath = `${options.tmp}/${version.modelerUrl.replace("http://files.herman.codes/mx-files/", "")}`;
    const build = () => {
        try {
            let source = fs.readFileSync(`${__dirname}/../templates/Dockerfile`, 'utf8').toString();
            source = source
                .replace(/dockerImage/g, version.dockerImage)
                .replace(/#RUN apt-get -y install openjdk-11-jre-headless/g, version.javaVersion === 11 ? "RUN apt-get -y install openjdk-11-jre-headless" : "");
            if (fs.existsSync(`${__dirname}/../../tmp/${version.version}/Dockerfile`)) {
                fs.unlinkSync(`${__dirname}/../../tmp/${version.version}/Dockerfile`);
            }
            console.log(`Creating ${`${__dirname}/../../tmp/${version.version}/Dockerfile`}`);
            fs.writeFileSync(`${__dirname}/../../tmp/${version.version}/Dockerfile`, source);
            shell.exec(`cd tmp/${version.version} && docker build -t mxbuild:${version.version} .`);
        } catch (e) {
            console.error(e);
        }
    };
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
                                build();
                            });
                });
            })
        } else {
            fulfill("Already cached");
            build();
        }
    });
}