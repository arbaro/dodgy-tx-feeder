"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const demux_1 = require("demux");
const demux_eos_1 = require("demux-eos");
const myActionHandler_1 = require("./myActionHandler");
exports.goDemux = (handlers) => {
    const actionHandler = new myActionHandler_1.myActionHandler([
        {
            versionName: "v1",
            updaters: handlers.map((handler) => (Object.assign({}, handler, { apply: (state, payload) => {
                    const { transactionId, name, authorization, data } = payload;
                    const obj = {
                        authorization,
                        data,
                        blockMeta: {
                            transactionId,
                        }
                    };
                    handler.apply(obj);
                } }))),
            effects: []
        }
    ]);
    const actionReader = new demux_eos_1.NodeosActionReader({
        nodeosEndpoint: "http://localhost:8888",
        startAtBlock: -20
    });
    const watcher = new demux_1.BaseActionWatcher(actionReader, actionHandler, 1000);
    watcher.watch();
};
