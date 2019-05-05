import { Handler, Org, GenericTx, Profile, upsertorgAction } from '../interfaces'

import { rpc } from '../app';

const OrgModel = new Org().getModelForClass(Org);
const ProfileModel = new Profile().getModelForClass(Profile);

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
            await ProfileModel.findOneAndUpdate({ prof: payload.data.owner }, {
                prof: payload.data.owner,
                isOrg: true
            })
            console.log(`Commited: ${payload.data.friendlyname}`);
          } catch (e) {
            console.warn('Upsert org error,', e);
          }
    }
})