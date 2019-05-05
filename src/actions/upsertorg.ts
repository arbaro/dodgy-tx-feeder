import { Handler, Org, GenericTx, upsertorgAction } from '../interfaces'

import { rpc } from '../app';

const OrgModel = new Org().getModelForClass(Org);

export const upsertorg = (contractName: string): Handler => ({
    versionName: "v1",
    actionType: `${contractName}::upsertorg`,
    apply: async function (payload: GenericTx<upsertorgAction>) {
        try {
            const result = await rpc.history_get_transaction(
              payload.blockMeta.transactionId
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
})