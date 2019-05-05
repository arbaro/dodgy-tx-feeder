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
const interfaces_1 = require("../interfaces");
const app_1 = require("../app");
const wait = require('waait');
const ProfileModel = new interfaces_1.Profile().getModelForClass(interfaces_1.Profile);
const OrgModel = new interfaces_1.Org().getModelForClass(interfaces_1.Org);
const ClaimTimeModel = new interfaces_1.ClaimTime().getModelForClass(interfaces_1.ClaimTime);
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
            const profile = yield ProfileModel.findOne({ prof: payload.data.worker });
            const org = yield OrgModel.findOne({ owner: payload.data.org });
            yield ClaimTimeModel.create(Object.assign({}, payload.data, { prof: profile._id, org: org._id, transactionId: payload.blockMeta.transactionId, reward,
                blockTime }));
        }
        catch (e) {
            console.warn(`Failed commiting action ${payload.data.worker} of ${payload.data.minutes} minutes to database ${e}`);
        }
    })
});
