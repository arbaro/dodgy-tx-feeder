"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces_1 = require("./interfaces");
exports.ProfileModel = new interfaces_1.Profile().getModelForClass(interfaces_1.Profile);
exports.OrgModel = new interfaces_1.Org().getModelForClass(interfaces_1.Org);
exports.ClaimTimeModel = new interfaces_1.ClaimTime().getModelForClass(interfaces_1.ClaimTime);
