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
const models_1 = require("../models");
const app_1 = require("../app");
exports.upsertorg = (contractName) => ({
    versionName: "v1",
    actionType: `${contractName}::upsertorg`,
    apply: function (payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield app_1.rpc.history_get_transaction(payload.blockMeta.transactionId);
                yield models_1.OrgModel.findOneAndUpdate({ owner: payload.data.owner }, Object.assign({}, payload.data, { blockTime: result.block_time }), { upsert: true });
                yield models_1.ProfileModel.findOneAndUpdate({ prof: payload.data.owner }, {
                    prof: payload.data.owner,
                    isOrg: true
                });
                console.log(`Commited: ${payload.data.friendlyname}`);
            }
            catch (e) {
                console.warn('Upsert org error,', e);
            }
        });
    }
});
