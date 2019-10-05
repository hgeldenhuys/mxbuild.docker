export interface VersionsInterface {
    versions: VersionInterface[];
}

export interface VersionInterface {
    version:          string;
    modelerUrl:       string;
    dockerImage:      string;
    // javaIncludedInVM: boolean;
    patchCommands:      string;
    cacheAvailable:   boolean;
}
