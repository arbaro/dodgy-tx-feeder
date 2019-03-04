import * as WebSocket from "ws";
import fetch from "node-fetch";

import { GenericTx, Handler } from "./interfaces";

import {
  EoswsClient,
  EoswsConnector,
  createEoswsSocket,
  InboundMessageType,
  ActionTraceData
} from "@dfuse/eosws-js";
import { handlerToActionTrace } from "./handlerToActionTrace";

const convertMessageToGenericBlock = <T extends {}>(
  message: any
): GenericTx<T> => {
  return {
    authorization: message.data.trace.act.authorization,
    data: message.data.trace.act.data,
    blockMeta: {
      blockTime: new Date(message.data.block_time),
      blockHash: message.data.block_id,
      blockNum: message.data.block_num,
      transactionId: message.data.trx_id
    }
  };
};

export const goDfuse = async (handlers: Handler[]) => {
  const socketFactory = (): any => {
    return new WebSocket(`wss://${endpoint}/v1/stream?token=${apiKey}`, {
      origin: "https://example.com"
    });
  };

  const endpoint = "mainnet.eos.dfuse.io";
  const apiKey = process.env.DFUSE_TOKEN;

  const socket = createEoswsSocket(socketFactory);
  const client = new EoswsClient({
    socket,
    baseUrl: `https://${endpoint}`,
    httpClient: fetch
  });
  const connector = new EoswsConnector({ client, apiKey });

  try {
    await connector.connect();

    handlers.forEach(handler => {
      const stream = client.getActionTraces(handlerToActionTrace(handler));
      stream.onMessage((message: any) => {
        if (message.type === InboundMessageType.ACTION_TRACE) {
          return handler.apply(convertMessageToGenericBlock(message));
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
};
