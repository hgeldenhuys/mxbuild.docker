"use strict";
// Uncomment these imports to begin using these cool features!
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import {inject} from '@loopback/context';
const rest_1 = require("@loopback/rest");
const context_1 = require("@loopback/context");
const models_1 = require("../models");
const shell = require("shelljs");
const fs = require("fs");
let MxBuildController = class MxBuildController {
    constructor(response) {
        this.response = response;
    }
    async register(build) {
        const promise = new Promise((resolve, reject) => {
            if (build.projectFilePath == undefined)
                throw new Error("No buildpath");
            const basePath = build.projectFilePath.substr(0, build.projectFilePath.lastIndexOf('/'));
            shell.exec(`/tmp/opt/mono-3.10.0/bin/mono --config /tmp/opt/mono-3.10.0/etc/mono/config /mendix/modeler/mxbuild.exe --java-home=/mendix/app/.local/usr/lib/jvm/jdk-8u202-oracle-x64 --java-exe-path=/mendix/app/.local/usr/lib/jvm/jdk-8u202-oracle-x64/bin/java --write-errors=builderrors.log --target=${build.target} ${build.projectFilePath}`, (code, output, error) => {
                console.log(code, output, error);
                resolve(new models_1.BuildOutput({
                    output,
                    error,
                    code,
                    buildCoreCleanLog: fs.readFileSync(`${basePath}/deployment/log/build_core_clean_log.txt`, 'utf8').toString(),
                    buildCoreCompileLog: fs.readFileSync(`${basePath}/deployment/log/build_core_compile_log.txt`, 'utf8').toString(),
                    buildCoreDeployLog: fs.readFileSync(`${basePath}/deployment/log/build_core_deploy_log.txt`, 'utf8').toString()
                }));
            });
        });
        return promise;
    }
};
__decorate([
    rest_1.post('/build', {
        responses: {
            '200': {
                description: 'MxBuild',
                content: { 'application/json': { schema: rest_1.getModelSchemaRef(models_1.Build) } },
            },
        },
    }),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.Build]),
    __metadata("design:returntype", Promise)
], MxBuildController.prototype, "register", null);
MxBuildController = __decorate([
    __param(0, context_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    __metadata("design:paramtypes", [Object])
], MxBuildController);
exports.MxBuildController = MxBuildController;
//# sourceMappingURL=mx-build.controller.js.map