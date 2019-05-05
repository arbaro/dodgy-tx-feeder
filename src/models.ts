import { Profile, Org, ClaimTime } from './interfaces'

export const ProfileModel = new Profile().getModelForClass(Profile);
export const OrgModel = new Org().getModelForClass(Org);
export const ClaimTimeModel = new ClaimTime().getModelForClass(ClaimTime);
