import { Handler, Profile } from '../interfaces'
  
const ProfileModel = new Profile().getModelForClass(Profile);


export const acceptrole = (contractName: string): Handler => ({
    versionName: "v1",
    actionType: `${contractName}::upsertrole`,
    apply: async function (payload: any) {
        // Worker making a decision
        if (payload.authorization[0].actor == payload.data.worker) {
            if (!payload.data.active) {
                await ProfileModel.findOneAndUpdate(
                    { prof: payload.data.worker }, 
                    { $pull: { orgs: payload.data.org }}, 
                    { upsert: true }
                )
            } else {
                await ProfileModel.findOneAndUpdate(
                    { prof: payload.data.worker }, 
                    { $push: { orgs: payload.data.org }}, 
                    { upsert: true }
                )
            }
        }  
    }
})