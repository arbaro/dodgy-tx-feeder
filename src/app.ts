import * as dotenv from "dotenv";

import { prop, Typegoose, ModelType, InstanceType } from "typegoose";
import { Org, Handler } from "./interfaces";

import { goDemux } from "./goDemux";
import { goDfuse } from "./goDfuse";
import * as mongoose from "mongoose";
import * as express from "express";

const fetch = require("node-fetch");
import { JsonRpc } from "eosjs";

import { upsertprof } from './actions/upsertprof'
import { claimtime } from './actions/claimtime'
import { acceptrole } from './actions/acceptrole'
import { upsertorg } from './actions/upsertorg'

dotenv.config();

const {
  NODE_ENV,
  PRODUCTION_CONTRACT,
  DEVELOPMENT_CONTRACT,
  EOS_RPC,
  EOS_RPC_DEV,
  MONGO_URI
} = process.env;
const isDevelopment = NODE_ENV === "development";
const contractName = isDevelopment ? DEVELOPMENT_CONTRACT : PRODUCTION_CONTRACT;

export const rpc = new JsonRpc(isDevelopment ? EOS_RPC_DEV : EOS_RPC, { fetch });

const main = async () => {
  mongoose.connect(MONGO_URI, { useNewUrlParser: true }, error =>
    console.log(error || "Successfully connected to MongoDB.")
  );

  if (isDevelopment) {
    await mongoose.connection.dropDatabase();
    console.log("Mongoose database dropped")
  }

  const app = express();
  app.listen(process.env.PORT, () =>
    console.log("Listening on port", process.env.PORT)
  );

  console.log(
    isDevelopment ? "I am in development" : "I am in production mode"
  );


  const handlers: Handler[] = [
    claimtime(contractName),
    acceptrole(contractName),
    upsertorg(contractName),
    upsertprof(contractName)
  ];

  isDevelopment ? goDemux(handlers) : goDfuse(handlers);
};

main();
