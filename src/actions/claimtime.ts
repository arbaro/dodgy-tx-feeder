import { Handler, GenericTx, claimtimeAction } from '../interfaces'
import { rpc } from '../app';
import { ProfileModel, OrgModel, ClaimTimeModel } from '../models';

const wait = require('waait')

export const claimtime = (contractName: string): Handler => ({
    versionName: "v1",
    actionType: `${contractName}::claimtime`,
    apply: async (payload: GenericTx<claimtimeAction>) => {
        try {
            await wait(1000)
            const result = await rpc.history_get_transaction(
                payload.blockMeta.transactionId
            );
            const [
                amount,
                symbol
            ] = result.traces[0].inline_traces[0].act.data.quantity.split(" ");
            const blockTime = result.block_time;
            const reward = { amount, symbol };
            const profile = await ProfileModel.findOne({ prof: payload.data.worker })
            const org = await OrgModel.findOne({ owner: payload.data.org })
            await ClaimTimeModel.create({
                ...payload.data,
                prof: profile._id,
                org: org._id,
                transactionId: payload.blockMeta.transactionId,
                reward,
                blockTime
            });
        } catch (e) {
            console.warn(
                `Failed commiting action ${payload.data.worker} of ${
                payload.data.minutes
                } minutes to database ${e}`
            );
        }
    }
})