import {OptionsInterface} from "../interfaces/options.interface";
import * as fs from "fs-extra";
import {Argv} from "yargs";
import shell from "shelljs";
const targz = require('targz');
const versions = require("../artefacts/versions.json") as VersionsInterface;
const request = require('request');
const progress = require('request-progress');
import ProgressBar from 'cli-progress';
import {VersionsInterface} from "../interfaces/versions.interface";

export default async (options: OptionsInterface, yargs: Argv) => {
    // Create a logger that will be silent if json === true
    const log = (!options.json && console.log) || (() => {});

    const version = versions.versions.find(version =>
            version.version === yargs.argv.downloadVersion
    );
    if (version === undefined) throw new Error(`💥 Version ${yargs.argv.mendixVersion} is invalid`);
    const cachePath = `${options.tmp}/${version.modelerUrl.substr(version.modelerUrl.lastIndexOf('/')+1)}`;
    const build = () => {
        try {
            // 🐚 🦑 🐧
            log(`🐙 cloning git repo`);
            shell.exec(`git clone https://github.com/hgeldenhuys/cf-mendix-buildpack ${__dirname}/../../tmp/${version.version}/buildpack`);
            log(`🐿 copy sample app`);
            fs.copySync(`${__dirname}/../sample-apps/${version.version}`, `${__dirname}/../../tmp/${version.version}/app`);
            log(`🌍 copy nginx config for mxbuild`);
            fs.copySync(`${__dirname}/../templates/mxbuild.nginx`, `${__dirname}/../../tmp/${version.version}/mxbuild.nginx`);
            let sourceDockerFile = fs.readFileSync(`${__dirname}/../templates/Dockerfile`, 'utf8').toString();
            // let sourceMonoConfig = fs.readFileSync(`${__dirname}/../templates/mono.config`, 'utf8').toString();
            sourceDockerFile = sourceDockerFile
                .replace(/patchCommands/g, version.patchCommands)
                .replace(/monoVersion/g, version.monoVersion)
                .replace(/javaVersion/g, version.javaVersion)
                .replace(/servePort/g, version.servePort)
                .replace(/dockerImage/g, version.dockerImage);
            if (fs.existsSync(`${__dirname}/../../tmp/${version.version}/Dockerfile`)) {
                fs.unlinkSync(`${__dirname}/../../tmp/${version.version}/Dockerfile`);
            }
            const targetDockerFile = `${__dirname}/../../tmp/${version.version}/Dockerfile`;
            // const targetMonoConfig = `${__dirname}/../../tmp/${version.version}/mono.config`;
            log(`🔧 Writing ${targetDockerFile}`);
            fs.writeFileSync(`${targetDockerFile}`, sourceDockerFile);
            // log(`🧐 creating ${targetMonoConfig}`);
            // fs.writeFileSync(`${targetMonoConfig}`, sourceMonoConfig);
            log(`🐳 Building docker image`);
            shell.exec(`cd tmp/${version.version} && docker build -t hgeldenhuys/mxbuild:${version.version} . && docker tag hgeldenhuys/mxbuild:${version.version} hgeldenhuys/mxbuild:${version.version}`);// && docker push hgeldenhuys/mxbuild:${version.version}`);
        } catch (e) {
            console.error(e);
        }
    };
    return new Promise<any>((fulfill, reject) => {
        if (!fs.existsSync(options.tmp)) {
            log(`🧶 creating temp folder...`);
            fs.mkdirSync(options.tmp, { recursive: true });
        }
        if (!fs.existsSync(cachePath)) {
            if (!options.json) {
                log(`🌍 downloading ${version.modelerUrl}`);
            }
            const progressBar = !options.json && new ProgressBar.Bar({
                format: "[{bar}] {percentage}% | ETA: {eta}s | 🚀 hang in there guys..."
            }, ProgressBar.Presets.shades_classic);
            progressBar && progressBar.start(100, 0);

            progress(request(version.modelerUrl), {
                // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
                // delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
                // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
            })
                .on('progress', function (state: {percent: number, speed: number, size: {total: number, transferred: number}, time: {elapsed: number, remaining: number}}) {
                    progressBar && progressBar.update(state.percent*100);
                })
                .on('error', function (err: Error) {
                    console.error(err);
                    fs.unlinkSync(cachePath);
                })
                .on('end', function () {
                    progressBar && progressBar.update(100);
                    progressBar && progressBar.stop();
                    log("📦 Unzipping...");
                    targz.decompress({
                        src: cachePath,
                        dest: `${options.tmp}/${version.version}`
                    }, (err: any) => {
                        if (err) {
                            throw err;
                        } else {
                            fulfill("Done");
                            build();
                        }
                    });
                })
                .pipe(fs.createWriteStream(cachePath));
        } else {
            fulfill("Already cached");
            build();
        }
    });
}
