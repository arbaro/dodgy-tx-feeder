"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const models_1 = require("../models");
const wait = require('waait');
exports.claimtime = (contractName) => ({
    versionName: "v1",
    actionType: `${contractName}::claimtime`,
    apply: (payload) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield wait(1000);
            const result = yield app_1.rpc.history_get_transaction(payload.blockMeta.transactionId);
            const [amount, symbol] = result.traces[0].inline_traces[0].act.data.quantity.split(" ");
            const blockTime = result.block_time;
            const reward = { amount, symbol };
            const profile = yield models_1.ProfileModel.findOne({ prof: payload.data.worker });
            const org = yield models_1.OrgModel.findOne({ owner: payload.data.org });
            const claim = yield models_1.ClaimTimeModel.create(Object.assign({}, payload.data, { prof: profile._id, org: org._id, transactionId: payload.blockMeta.transactionId, reward,
                blockTime }));
            console.log(profile._id, 'is the profile id');
            yield models_1.ProfileModel.findOneAndUpdate({ prof: payload.data.worker }, { $push: { entries: claim._id } }, { upsert: true });
        }
        catch (e) {
            console.warn(`Failed commiting action ${payload.data.worker} of ${payload.data.minutes} minutes to database ${e}`);
        }
    })
});
