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
exports.upsertprof = (contractName) => ({
    versionName: "v1",
    actionType: `${contractName}::upsertprof`,
    apply: function (payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const org = yield models_1.OrgModel.findOne({ owner: payload.data.prof });
                yield models_1.ProfileModel.findOneAndUpdate({ prof: payload.data.prof }, Object.assign({}, payload.data, { isOrg: !!org }), { upsert: true });
            }
            catch (e) {
                console.log('Failure in upsert prof', e);
            }
        });
    }
});
