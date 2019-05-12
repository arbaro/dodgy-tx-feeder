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
const node_fetch_1 = require("node-fetch");
// @ts-ignore
global.fetch = node_fetch_1.default;
// @ts-ignore
global.WebSocket = require("ws");
const client_1 = require("@dfuse/client");
const convertMessageToGenericBlock = (message) => {
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
exports.handlerToActionTrace = (handler) => {
    const [account, action_name] = handler.actionType.split("::");
    return {
        account,
        action_name
    };
};
exports.goDfuse = (handlers) => __awaiter(this, void 0, void 0, function* () {
    const apiKey = process.env.DFUSE_TOKEN;
    const client = client_1.createDfuseClient({ apiKey, network: "mainnet" });
    handlers.forEach(handler => {
        const { account, action_name } = exports.handlerToActionTrace(handler);
        client.streamActionTraces({ accounts: account, action_names: action_name }, (message) => {
            if (message.type == client_1.InboundMessageType.ACTION_TRACE) {
                return handler.apply(convertMessageToGenericBlock(message));
            }
        });
    });
});
