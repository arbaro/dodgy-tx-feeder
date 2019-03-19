import * as dotenv from "dotenv";

import { prop, Typegoose, ModelType, InstanceType } from "typegoose";
import { GenericTx, Handler } from "./interfaces";

import { goDemux } from "./goDemux";
import { goDfuse } from "./goDfuse";
import * as mongoose from "mongoose";

const fetch = require("node-fetch");
import { JsonRpc } from "eosjs";

dotenv.config();

const { NODE_ENV, PRODUCTION_CONTRACT, DEVELOPMENT_CONTRACT } = process.env;
const isDevelopment = NODE_ENV === "development";
const contractName = isDevelopment ? DEVELOPMENT_CONTRACT : PRODUCTION_CONTRACT;

class ClaimTime extends Typegoose {
  @prop()
  worker: string;

  @prop()
  dechours: number;

  @prop()
  notes: string;

  @prop()
  transactionId: string;

  @prop()
  role: string;

  @prop()
  reward: {
    amount: number;
    symbol: string;
  };

  @prop()
  blockTime: Date;
}

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

class TokenTransfer extends Typegoose {
  @prop()
  from: string;

  @prop()
  to: string;

  @prop()
  quantity: string;

  @prop()
  memo: string;
}

const main = async () => {
  mongoose.connect(
    `mongodb://localhost/arbaro`,
    { useNewUrlParser: true },
    error => console.log(error || "Successfully connected to MongoDB.")
  );
  await mongoose.connection.dropDatabase();

  const rpc = new JsonRpc("http://localhost:8888", { fetch });

  const ClaimTimeModel = new ClaimTime().getModelForClass(ClaimTime);
  const OrgModel = new Org().getModelForClass(Org);

  const handlers: Handler[] = [
    {
      versionName: "v1",
      actionType: `${contractName}::claimtime`,
      apply: async (payload: any) => {
        try {
          const result = await rpc.history_get_transaction(
            payload.transactionId
          );
          const [
            amount,
            symbol
          ] = result.traces[0].inline_traces[0].act.data.quantity.split(" ");
          const blockTime = result.block_time;
          const reward = { amount, symbol };
          await ClaimTimeModel.create({
            ...payload.data,
            transactionId: payload.transactionId,
            worker: payload.authorization[0].actor,
            reward,
            blockTime
          });
          console.log("Commited:", payload.data.notes);
        } catch (e) {
          console.warn(
            `Failed commiting action ${payload.data.worker} of ${
              payload.data.dechours
            } hours to database ${e}`
          );
        }
      }
    },
    {
      versionName: "v1",
      actionType: `${contractName}::createorg`,
      apply: async (payload: any) => {
        try {
          const result = await rpc.history_get_transaction(
            payload.transactionId
          );
          console.log(result.block_time);
          await OrgModel.create({
            ...payload.data,
            blockTime: result.block_time
          });
          console.log(payload);
        } catch (e) {
          console.warn(e);
        }
      }
    }
  ];

  isDevelopment ? goDemux(handlers) : goDfuse(handlers);
};

main();
