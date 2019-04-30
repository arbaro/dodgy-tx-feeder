import { Handler } from '../interfaces'

import { prop, Typegoose } from "typegoose";


class Profile extends Typegoose {
    @prop()
    prof: string;
  
    @prop()
    friendly?: string;
  
    @prop()
    about?: string;
  
    @prop()
    pic?: string;
  
    @prop()
    orgs?: string[];
  }
  
  
const ProfileModel = new Profile().getModelForClass(Profile);


export const acceptrole = (contractName: string): Handler => ({
    versionName: "v1",
    actionType: `${contractName}::acceptrole`,
    apply: async function (payload: any) {
        console.log('Accept role running', payload)
        await ProfileModel.findOneAndUpdate({ prof: payload.data.worker }, {
            $push: { orgs: payload.data.org }
        }, { upsert: true })
    }
})