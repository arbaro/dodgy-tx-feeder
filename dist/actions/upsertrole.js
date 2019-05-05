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
exports.upsertrole = (contractName) => ({
    versionName: "v1",
    actionType: `${contractName}::upsertrole`,
    apply: function (payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // Worker making a decision
            try {
                // Fetch Org being referenced
                const org = yield models_1.OrgModel.findOne({ owner: payload.data.org });
                if (payload.authorization[0].actor == payload.data.worker) {
                    if (!payload.data.active) {
                        yield models_1.ProfileModel.findOneAndUpdate({ prof: payload.data.worker }, { $pull: { orgs: org._id } }, { upsert: true });
                    }
                    else {
                        yield models_1.ProfileModel.findOneAndUpdate({ prof: payload.data.worker }, { $push: { orgs: org._id } }, { upsert: true });
                    }
                }
            }
            catch (e) {
                console.log('upsert role error', e);
            }
        });
    }
});
