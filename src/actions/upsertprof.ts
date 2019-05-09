import { Handler, Profile, GenericTx, upsertprofAction } from '../interfaces'
import { ProfileModel, OrgModel } from '../models';

export const upsertprof = (contractName: string): Handler => ({
    versionName: "v1",
    actionType: `${contractName}::upsertprof`,
    apply: async function (payload: GenericTx<upsertprofAction>) {
        try {
            const org = await OrgModel.findOne({ owner: payload.data.prof })
            await ProfileModel.findOneAndUpdate({ prof: payload.data.prof }, {
                ...payload.data,
                isOrg: !!org
            }, { upsert: true })
        } catch(e) {
            console.log('Failure in upsert prof', e)
        }
    }
})