import { Model } from '@loopback/repository';
export declare class BuildOutput extends Model {
    code?: number;
    output?: string;
    error?: string;
    buildCoreCleanLog?: string;
    buildCoreCompileLog?: string;
    buildCoreDeployLog?: string;
    constructor(data?: Partial<BuildOutput>);
}
export interface BuildOutputRelations {
}
export declare type BuildOutputWithRelations = BuildOutput & BuildOutputRelations;
