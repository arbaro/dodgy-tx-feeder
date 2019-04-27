import { Handler } from '../interfaces'

import { prop, Typegoose, } from "typegoose";


class Profile extends Typegoose {
    @prop()
    prof: string;

    @prop()
    friendly: string;

    @prop()
    about: string;

    @prop()
    pic: string;

}

const ProfileModel = new Profile().getModelForClass(Profile);


export const upsertprof = (contractName: string): Handler => ({
    versionName: "v1",
    actionType: `${contractName}::upsertprof`,
    apply: async function (payload) {
        console.log(payload, 'was caught')
        await ProfileModel.findOneAndUpdate({ prof: payload.data.prof }, {
            ...payload.data,
        }, { upsert: true })
        console.log('Profile was created', payload.data.friendly)
    }
})