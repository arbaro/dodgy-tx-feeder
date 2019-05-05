 
import fetch from "node-fetch";
// @ts-ignore
global.fetch = fetch
// @ts-ignore
global.WebSocket = require("ws");

import { GenericTx,  Handler } from "./interfaces";
import { createDfuseClient, InboundMessageType} from '@dfuse/client';



const convertMessageToGenericBlock = <T extends {}>(
  message: any
): GenericTx<T> => {
  return {
    authorization: message.data.trace.act.authorization,
    data: message.data.trace.act.data,
    blockMeta: {
      blockTime: message.data.block_time,
      blockHash: message.data.block_id,
      blockNum: message.data.block_num,
      transactionId: message.data.trx_id
    }
  };
};

export const handlerToActionTrace = (handler: Handler): any => {
  const [account, action_name] = handler.actionType.split("::");
  return {
    account,
    action_name
  };
};


export const goDfuse = async (handlers: Handler[]) => {
  const apiKey = process.env.DFUSE_TOKEN
  const client = createDfuseClient({ apiKey , network: "mainnet" })

  handlers.forEach(handler => {
    const { account, action_name } = handlerToActionTrace(handler)
    client.streamActionTraces({ accounts: account, action_names: action_name}, (message) => {
      if (message.type == InboundMessageType.ACTION_TRACE) {
        return handler.apply(convertMessageToGenericBlock(message))
      }
    })
  })

};
