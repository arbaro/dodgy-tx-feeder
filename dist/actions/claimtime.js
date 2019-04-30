"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = require("typegoose");
const app_1 = require("../app");
class ClaimTime extends typegoose_1.Typegoose {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], ClaimTime.prototype, "worker", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], ClaimTime.prototype, "minutes", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], ClaimTime.prototype, "notes", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], ClaimTime.prototype, "transactionId", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], ClaimTime.prototype, "org", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Object)
], ClaimTime.prototype, "reward", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], ClaimTime.prototype, "blockTime", void 0);
const ClaimTimeModel = new ClaimTime().getModelForClass(ClaimTime);
exports.claimtime = (contractName) => ({
    versionName: "v1",
    actionType: `${contractName}::claimtime`,
    apply: (payload) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield app_1.rpc.history_get_transaction(payload.transactionId);
            const [amount, symbol] = result.traces[0].inline_traces[0].act.data.quantity.split(" ");
            const blockTime = result.block_time;
            const reward = { amount, symbol };
            yield ClaimTimeModel.create(Object.assign({}, payload.data, { transactionId: payload.transactionId, worker: payload.authorization[0].actor, reward,
                blockTime }));
        }
        catch (e) {
            console.warn(`Failed commiting action ${payload.data.worker} of ${payload.data.dechours} hours to database ${e}`);
        }
    })
});
