import {OptionsInterface} from "../interfaces/options.interface";
import * as fs from "fs";

const versions = require("../artefacts/versions.json");

export default function (options: OptionsInterface) {
    versions.versions.forEach((version: {version: string, modelerUrl: string, cacheAvailable: boolean}) => {
        const cachePath = `/tmp/cache/${version.modelerUrl.replace("http://files.herman.codes/mx-files/", "")}`;
        version.cacheAvailable = fs.existsSync(cachePath);
    });
    if (options.json) {
        return versions;
    } else {
        return `Supported Mendix distribution versions: \n - ${
            versions.versions.map((version: {version: string, modelerUrl: string, cacheAvailable: boolean}) => {
                
                return version.version + " " + (version.cacheAvailable ? "cached 📦" : "internet 🌎");
            }).join("\n - ")
        }`;
    }
}