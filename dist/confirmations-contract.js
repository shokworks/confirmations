"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_contract_api_1 = require("fabric-contract-api");
const confirmations_1 = require("./confirmations");
let ConfirmationsContract = class ConfirmationsContract extends fabric_contract_api_1.Contract {
    async confirmationsExists(ctx, confirmationsId) {
        const buffer = await ctx.stub.getState(confirmationsId);
        return (!!buffer && buffer.length > 0);
    }
    async Createconfirmations(ctx, confirmationsId, value) {
        const existsconfirmation = await this.confirmationsExists(ctx, confirmationsId);
        if (existsconfirmation) {
            const Confirmationsrecord = await ctx.stub.getState(confirmationsId);
            const acc = JSON.parse(Confirmationsrecord.toString());
            acc.Value = value;
            await ctx.stub.putState(confirmationsId, Buffer.from(JSON.stringify(acc)));
            return;
        }
        else {
            const confirmations = new confirmations_1.Confirmations();
            confirmations.Value = value;
            const buffer = Buffer.from(JSON.stringify(confirmations));
            await ctx.stub.putState(confirmationsId, buffer);
            return;
        }
    }
    async readConfirmations(ctx, confirmationsId) {
        const exists = await this.confirmationsExists(ctx, confirmationsId);
        if (!exists) {
            throw new Error(`200`);
        }
        const buffer = await ctx.stub.getState(confirmationsId);
        const confirmations = JSON.parse(buffer.toString());
        return confirmations;
    }
};
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], ConfirmationsContract.prototype, "confirmationsExists", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, Number]),
    __metadata("design:returntype", Promise)
], ConfirmationsContract.prototype, "Createconfirmations", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('Confirmations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], ConfirmationsContract.prototype, "readConfirmations", null);
ConfirmationsContract = __decorate([
    fabric_contract_api_1.Info({ title: 'ConfirmationsContract', description: 'My Smart Contract' })
], ConfirmationsContract);
exports.ConfirmationsContract = ConfirmationsContract;
//# sourceMappingURL=confirmations-contract.js.map