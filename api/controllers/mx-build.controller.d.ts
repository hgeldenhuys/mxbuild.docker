/// <reference types="express" />
import { Response } from '@loopback/rest';
import { Build, BuildOutput } from '../models';
export declare class MxBuildController {
    private readonly response;
    constructor(response: Response);
    register(build: Build): Promise<BuildOutput>;
}
