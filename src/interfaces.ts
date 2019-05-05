import { prop, Typegoose } from "typegoose";

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

export class Profile extends Typegoose {
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

export class ClaimTime extends Typegoose {
  @prop()
  worker: string;

  @prop()
  minutes: number;

  @prop()
  notes: string;

  @prop()
  transactionId: string;

  @prop()
  org: string;

  @prop()
  reward: {
    amount: number;
    symbol: string;
  };

  @prop()
  blockTime: string;
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
