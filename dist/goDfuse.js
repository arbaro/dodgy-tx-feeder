"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const node_fetch_1 = require("node-fetch");
const eosws_js_1 = require("@dfuse/eosws-js");
const handlerToActionTrace_1 = require("./handlerToActionTrace");
const convertMessageToGenericBlock = (message) => {
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
exports.goDfuse = (handlers) => __awaiter(this, void 0, void 0, function* () {
    const socketFactory = () => {
        return new WebSocket(`wss://${endpoint}/v1/stream?token=${apiKey}`, {
            origin: "https://example.com"
        });
    };
    const endpoint = "mainnet.eos.dfuse.io";
    const apiKey = process.env.DFUSE_TOKEN;
    const socket = eosws_js_1.createEoswsSocket(socketFactory);
    const client = new eosws_js_1.EoswsClient({
        socket,
        baseUrl: `https://${endpoint}`,
        httpClient: node_fetch_1.default
    });
    const connector = new eosws_js_1.EoswsConnector({ client, apiKey });
    try {
        yield connector.connect();
        handlers.forEach(handler => {
            const stream = client.getActionTraces(handlerToActionTrace_1.handlerToActionTrace(handler));
            stream.onMessage((message) => {
                if (message.type === eosws_js_1.InboundMessageType.ACTION_TRACE) {
                    return handler.apply(convertMessageToGenericBlock(message));
                }
            });
        });
    }
    catch (e) {
        console.log(e);
    }
});
