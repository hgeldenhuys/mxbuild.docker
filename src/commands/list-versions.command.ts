import {OptionsInterface} from "../interfaces/options.interface";

const versions = require("../artefacts/versions.json");

export default function (options: OptionsInterface) {
    if (options.json) {
        return versions;
    } else {
        return `Supported Mendix distribution versions: \n - ${
            versions.versions.map((version: {version: string, modelerUrl: string}) => 
                version.version + " " + version.modelerUrl).join("\n - ")
        }`;
    }
}