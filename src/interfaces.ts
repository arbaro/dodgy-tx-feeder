import { prop, Typegoose, Ref } from "typegoose";

export interface Data {
  worker: string;
  dechours: string;
  notes: string;
}

export interface Authorization {
  actor: string;
  permission: string;
}

export interface BlockMeta {
  blockTime?: Date;
  blockHash?: string;
  blockNum?: string;
  transactionId: string;
}

export interface GenericTx<Data> {
  authorization: Authorization;
  data: Data;
  blockMeta: BlockMeta;
}

export interface Handler {
  versionName: string;
  actionType: string;
  apply: (payload: GenericTx<any>) => Promise<void>;
}

export interface ActionTraceInput {
  account: string;
  action_name: string;
}

export class Org extends Typegoose {
  @prop()
  owner: string;

  @prop()
  tokensym: string;

  @prop()
  tokencon: string;

  @prop()
  friendlyname: string;

  @prop()
  blockTime: string;
}

export class Profile extends Typegoose {
  @prop({ unique: true })
  prof: string;

  @prop()
  friendly?: string;

  @prop()
  about?: string;

  @prop()
  pic?: string;

  @prop({ ref: Org, unique: true })
  orgs?: Ref<Org>[];

  @prop()
  isOrg: boolean;

}

export class ClaimTime extends Typegoose {

  @prop({ ref: Profile })
  prof: Ref<Profile>;

  @prop({ ref: Org })
  org: Ref<Org>;

  // @prop()
  // org: string;

  @prop()
  minutes: number;

  @prop()
  notes: string;

  @prop()
  transactionId: string;

  @prop()
  reward: {
    amount: number;
    symbol: string;
  };

  @prop()
  blockTime: string;
}



export interface upsertroleAction {
  org: string;
  worker: string;
  payrate: string;
  active: string;
}

export interface upsertprofAction {
  prof: string;
  friendly: string;
  about: string;
  pic: string;
  git: string;
}

export interface upsertorgAction {
  owner: string;
  tokensym: string;
  tokencon: string;
  friendlyname: string;
}

export interface claimtimeAction {
  worker: string;
  org: string;
  minutes: string;
  notes: string;
}