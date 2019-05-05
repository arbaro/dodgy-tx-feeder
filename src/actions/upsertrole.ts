import { Handler, GenericTx, upsertroleAction } from '../interfaces'
import { ProfileModel, OrgModel } from '../models';

export const upsertrole = (contractName: string): Handler => ({
    versionName: "v1",
    actionType: `${contractName}::upsertrole`,
    apply: async function (payload: GenericTx<upsertroleAction>) {
        // Worker making a decision
        try {
            // Fetch Org being referenced
            const org = await OrgModel.findOne({ owner: payload.data.org })
            if (payload.authorization[0].actor == payload.data.worker) {
                if (!payload.data.active) {
                    await ProfileModel.findOneAndUpdate(
                        { prof: payload.data.worker }, 
                        { $pull: { orgs: org._id }}, 
                        { upsert: true }
                    )
                } else {
                    await ProfileModel.findOneAndUpdate(
                        { prof: payload.data.worker }, 
                        { $push: { orgs: org._id }}, 
                        { upsert: true }
                    )
                }
            }  
        } catch(e) {
            console.log('upsert role error', e)
        }
    }
})