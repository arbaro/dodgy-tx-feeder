import { Handler } from '../interfaces'

import { prop, Typegoose } from "typegoose";
import { rpc } from '../app';


class ClaimTime extends Typegoose {
    @prop()
    worker: string;
  
    @prop()
    minutes: number;
  
    @prop()
    notes: string;
  
    @prop()
    transactionId: string;
  
    @prop()
    org: string;
  
    @prop()
    reward: {
      amount: number;
      symbol: string;
    };
  
    @prop()
    blockTime: string;
  }

const ClaimTimeModel = new ClaimTime().getModelForClass(ClaimTime);

export const claimtime = (contractName: string): Handler => ({
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
        } catch (e) {
            console.warn(
                `Failed commiting action ${payload.data.worker} of ${
                payload.data.dechours
                } hours to database ${e}`
            );
        }
    }
})