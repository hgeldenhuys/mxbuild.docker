import {OptionsInterface} from "../interfaces/options.interface";
import * as fs from "fs";
import {VersionInterface, VersionsInterface} from "../interfaces/versions.interface";

const versions = require("../artefacts/versions.json") as VersionsInterface;

export default function (options: OptionsInterface) {
    versions.versions.forEach((version) => {
        const cachePath = `${options.tmp}/${version.modelerUrl.substr(version.modelerUrl.lastIndexOf("/")+1)}`;
        version.cacheAvailable = fs.existsSync(cachePath);
    });
    if (options.json) {
        return JSON.stringify(versions);
    } else {
        return `Supported Mendix distribution versions: \n - ${
            versions.versions.map((version: {version: string, modelerUrl: string, cacheAvailable: boolean}) => {
                
                return (version.cacheAvailable ? "📦 " : "🌎 ") + version.version + " " + (version.cacheAvailable ? "cached" : "internet");
            }).join("\n - ")
        }`;
    }
}