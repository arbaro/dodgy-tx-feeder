import { Handler, Profile, GenericTx, upsertprofAction } from '../interfaces'

const ProfileModel = new Profile().getModelForClass(Profile);

export const upsertprof = (contractName: string): Handler => ({
    versionName: "v1",
    actionType: `${contractName}::upsertprof`,
    apply: async function (payload: GenericTx<upsertprofAction>) {
        try {
            await ProfileModel.findOneAndUpdate({ prof: payload.data.prof }, {
                ...payload.data,
            }, { upsert: true })
        } catch(e) {
            console.log('Failure in upsert prof', e)
        }
    }
})