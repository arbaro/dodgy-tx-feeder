 
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
  // client.streamActionTraces({ accounts: "eosio.token", action_names: "transfer" }, (message) => {
  //   if (message.type === InboundMessageType.ACTION_TRACE) {
  //     const { from, to, quantity, memo } = message.data.trace.act.data
  //     console.log(`Transfer [${from} -> ${to}, ${quantity}] (${memo})`)
  //   }
  // }).catch((error) => {
  //   console.log("An error occurred.", error)
  // })

  
  // const socketFactory = (): any => {
  //   return new WebSocket(`wss://${endpoint}/v1/stream?token=${apiKey}`, {
  //     origin: "https://example.com"
  //   });
  // };

  // const endpoint = "mainnet.eos.dfuse.io";
  // const apiKey = process.env.DFUSE_TOKEN;

  // const socket = createEoswsSocket(socketFactory);
  // const client = new EoswsClient({
  //   socket,
  //   baseUrl: `https://${endpoint}`,
  //   httpClient: fetch
  // });
  // const connector = new EoswsConnector({ client, apiKey });

  // try {
  //   await connector.connect();

  //   handlers.forEach(handler => {
  //     const stream = client.getActionTraces(handlerToActionTrace(handler));
  //     stream.onMessage((message: any) => {
  //       if (message.type === InboundMessageType.ACTION_TRACE) {
  //         return handler.apply(convertMessageToGenericBlock(message));
  //       }
  //     });
  //   });
  // } catch (e) {
  //   console.log(e);
  // }
};
