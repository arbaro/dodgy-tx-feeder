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
const ProfileModel = new interfaces_1.Profile().getModelForClass(interfaces_1.Profile);
exports.acceptrole = (contractName) => ({
    versionName: "v1",
    actionType: `${contractName}::upsertrole`,
    apply: function (payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // Worker making a decision
            if (payload.authorization[0].actor == payload.data.worker) {
                if (!payload.data.active) {
                    yield ProfileModel.findOneAndUpdate({ prof: payload.data.worker }, { $pull: { orgs: payload.data.org } }, { upsert: true });
                }
                else {
                    yield ProfileModel.findOneAndUpdate({ prof: payload.data.worker }, { $push: { orgs: payload.data.org } }, { upsert: true });
                }
            }
        });
    }
});
