import { Handler, Profile } from '../interfaces'

  

const ProfileModel = new Profile().getModelForClass(Profile);


export const upsertprof = (contractName: string): Handler => ({
    versionName: "v1",
    actionType: `${contractName}::upsertprof`,
    apply: async function (payload) {
        await ProfileModel.findOneAndUpdate({ prof: payload.data.prof }, {
            ...payload.data,
        }, { upsert: true })
    }
})