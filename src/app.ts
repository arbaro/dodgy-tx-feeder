import * as dotenv from "dotenv";

import { prop, Typegoose, ModelType, InstanceType } from "typegoose";
import { GenericTx, Handler } from "./interfaces";

import { goDemux } from "./goDemux";
import { goDfuse } from "./goDfuse";
import * as mongoose from "mongoose";

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

  const ClaimTimeModel = new ClaimTime().getModelForClass(ClaimTime);
  // const TransferModel = new TokenTransfer().getModelForClass(TokenTransfer);
  const handlers: Handler[] = [
    {
      versionName: "v1",
      actionType: `${contractName}::claimtime`,
      apply: async (payload: any) => {
        try {
          console.log(payload);
          await ClaimTimeModel.create({
            ...payload.data,
            transactionId: payload.transactionId,
            worker: payload.authorization[0].actor
          });
          console.log("Commited:", payload.data.notes);
        } catch (e) {
          console.warn(
            `Failed commiting action ${payload.data.worker} of ${
              payload.data.dechours
            } hours to database`
          );
        }
      }
    }
  ];

  isDevelopment ? goDemux(handlers) : goDfuse(handlers);
};

main();
