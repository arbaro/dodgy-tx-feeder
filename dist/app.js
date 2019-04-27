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
const dotenv = require("dotenv");
const typegoose_1 = require("typegoose");
const goDemux_1 = require("./goDemux");
const goDfuse_1 = require("./goDfuse");
const mongoose = require("mongoose");
const express = require("express");
const fetch = require("node-fetch");
const eosjs_1 = require("eosjs");
const upsertprof_1 = require("./actions/upsertprof");
dotenv.config();
const { NODE_ENV, PRODUCTION_CONTRACT, DEVELOPMENT_CONTRACT, EOS_RPC, MONGO_URI } = process.env;
const isDevelopment = NODE_ENV === "development";
const contractName = isDevelopment ? DEVELOPMENT_CONTRACT : PRODUCTION_CONTRACT;
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
class Org extends typegoose_1.Typegoose {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Org.prototype, "owner", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Org.prototype, "tokensym", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Org.prototype, "tokencon", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Org.prototype, "friendlyname", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Org.prototype, "blockTime", void 0);
class TokenTransfer extends typegoose_1.Typegoose {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], TokenTransfer.prototype, "from", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], TokenTransfer.prototype, "to", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], TokenTransfer.prototype, "quantity", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], TokenTransfer.prototype, "memo", void 0);
const main = () => __awaiter(this, void 0, void 0, function* () {
    mongoose.connect(MONGO_URI, { useNewUrlParser: true }, error => console.log(error || "Successfully connected to MongoDB."));
    if (isDevelopment) {
        yield mongoose.connection.dropDatabase();
        console.log("Mongoose database dropped");
    }
    const app = express();
    app.listen(process.env.PORT, () => console.log("Listening on port", process.env.PORT));
    console.log(isDevelopment ? "I am in development" : "I am in production mode");
    const rpc = new eosjs_1.JsonRpc(EOS_RPC, { fetch });
    const ClaimTimeModel = new ClaimTime().getModelForClass(ClaimTime);
    const OrgModel = new Org().getModelForClass(Org);
    const handlers = [
        {
            versionName: "v1",
            actionType: `${contractName}::claimtime`,
            apply: (payload) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield rpc.history_get_transaction(payload.transactionId);
                    console.log(payload, 'was the result');
                    const [amount, symbol] = result.traces[0].inline_traces[0].act.data.quantity.split(" ");
                    const blockTime = result.block_time;
                    const reward = { amount, symbol };
                    yield ClaimTimeModel.create(Object.assign({}, payload.data, { transactionId: payload.transactionId, worker: payload.authorization[0].actor, reward,
                        blockTime }));
                    console.log("Commited:", payload.data.notes);
                }
                catch (e) {
                    console.warn(`Failed commiting action ${payload.data.worker} of ${payload.data.dechours} hours to database ${e}`);
                }
            })
        },
        {
            versionName: "v1",
            actionType: `${contractName}::createorg`,
            apply: (payload) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield rpc.history_get_transaction(payload.transactionId);
                    yield OrgModel.create(Object.assign({}, payload.data, { blockTime: result.block_time }));
                    console.log(`Commited: ${payload.data.friendlyname}`);
                }
                catch (e) {
                    console.warn(e);
                }
            })
        },
        upsertprof_1.upsertprof(contractName)
    ];
    isDevelopment ? goDemux_1.goDemux(handlers) : goDfuse_1.goDfuse(handlers);
});
main();
