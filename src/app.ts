import * as dotenv from "dotenv";

import { prop, Typegoose, ModelType, InstanceType } from "typegoose";
import { GenericTx, Handler } from "./interfaces";

import { goDemux } from "./goDemux";
import { goDfuse } from "./goDfuse";
import * as mongoose from "mongoose";
import * as express from "express";

const fetch = require("node-fetch");
import { JsonRpc } from "eosjs";

import { upsertprof } from './actions/upsertprof'
import { claimtime } from './actions/claimtime'
import { acceptrole } from './actions/acceptrole'

dotenv.config();

const {
  NODE_ENV,
  PRODUCTION_CONTRACT,
  DEVELOPMENT_CONTRACT,
  EOS_RPC,
  MONGO_URI
} = process.env;
const isDevelopment = NODE_ENV === "development";
const contractName = isDevelopment ? DEVELOPMENT_CONTRACT : PRODUCTION_CONTRACT;



class Org extends Typegoose {
  @prop()
  owner: string;

  @prop()
  tokensym: string;

  @prop()
  tokencon: string;

  @prop()
  friendlyname: string;

  @prop()
  blockTime: string;
}

 

export const rpc = new JsonRpc(EOS_RPC, { fetch });

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

  const OrgModel = new Org().getModelForClass(Org);

  const handlers: Handler[] = [
    claimtime(contractName),
    acceptrole(contractName),
    {
      versionName: "v1",
      actionType: `${contractName}::upsertorg`,
      apply: async (payload: any) => {
        try {
          const result = await rpc.history_get_transaction(
            payload.transactionId
          );
          await OrgModel.findOneAndUpdate({owner: payload.data.owner},{
            ...payload.data,
            blockTime: result.block_time
          }, { upsert: true });
          console.log(`Commited: ${payload.data.friendlyname}`);
        } catch (e) {
          console.warn(e);
        }
      }
    },
    upsertprof(contractName)
  ];

  isDevelopment ? goDemux(handlers) : goDfuse(handlers);
};

main();
