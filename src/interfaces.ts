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
  blockTime: Date;
  blockHash: string;
  blockNum: string;
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
  apply: (payload: GenericTx<any>) => void;
}

export interface ActionTraceInput {
  account: string;
  action_name: string;
}
