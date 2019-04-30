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

    @prop()
    git?: string
  }
  
  

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