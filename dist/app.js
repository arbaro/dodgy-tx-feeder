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
const dotenv = require("dotenv");
const goDemux_1 = require("./goDemux");
const goDfuse_1 = require("./goDfuse");
const mongoose = require("mongoose");
const express = require("express");
const fetch = require("node-fetch");
const eosjs_1 = require("eosjs");
const upsertprof_1 = require("./actions/upsertprof");
const claimtime_1 = require("./actions/claimtime");
const upsertorg_1 = require("./actions/upsertorg");
const upsertrole_1 = require("./actions/upsertrole");
dotenv.config();
const { NODE_ENV, PRODUCTION_CONTRACT, DEVELOPMENT_CONTRACT, EOS_RPC, EOS_RPC_DEV, MONGO_URI } = process.env;
const isDevelopment = NODE_ENV === "development";
const contractName = isDevelopment ? DEVELOPMENT_CONTRACT : PRODUCTION_CONTRACT;
exports.rpc = new eosjs_1.JsonRpc(isDevelopment ? EOS_RPC_DEV : EOS_RPC, { fetch });
const main = () => __awaiter(this, void 0, void 0, function* () {
    mongoose.connect(MONGO_URI, { useNewUrlParser: true }, error => console.log(error || "Successfully connected to MongoDB."));
    if (isDevelopment) {
        yield mongoose.connection.dropDatabase();
        console.log("Mongoose database dropped");
    }
    const app = express();
    app.listen(process.env.PORT, () => console.log("Listening on port", process.env.PORT));
    console.log(isDevelopment ? "I am in development" : "I am in production mode");
    const handlers = [
        claimtime_1.claimtime(contractName),
        upsertorg_1.upsertorg(contractName),
        upsertprof_1.upsertprof(contractName),
        upsertrole_1.upsertrole(contractName)
    ];
    isDevelopment ? goDemux_1.goDemux(handlers) : goDfuse_1.goDfuse(handlers);
});
main();
