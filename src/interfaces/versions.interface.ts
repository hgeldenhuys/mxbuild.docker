export interface VersionsInterface {
    versions: VersionInterface[];
}

export interface VersionInterface {
    version:          string;
    modelerUrl:       string;
    dockerImage:      string;
    javaVersion:      string;
    monoVersion:      string;
    patchCommands:      string;
    // javaIncludedInVM: boolean;
    servePort:      string;
    cacheAvailable:   boolean;
}
