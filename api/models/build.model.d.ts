import { Model } from '@loopback/repository';
export declare class Build extends Model {
    target?: string;
    projectFilePath?: string;
    forceFullDeployment?: boolean;
    constructor(data?: Partial<Build>);
}
export interface BuildRelations {
}
export declare type BuildWithRelations = Build & BuildRelations;
