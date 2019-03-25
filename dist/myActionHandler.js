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
const demux_1 = require("demux");
let state = {
    posts: []
};
class myActionHandler extends demux_1.AbstractActionHandler {
    constructor(handlerVersions) {
        super(handlerVersions);
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    handleWithState(handle) {
        return __awaiter(this, void 0, void 0, function* () {
            yield handle(state);
        });
    }
    rollbackTo(blockNumber) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    updateIndexState(state, block, isReplay, handlerVersionName, context) {
        return __awaiter(this, void 0, void 0, function* () {
            this.lastProcessedBlockNumber = block.blockInfo.blockNumber;
            this.lastProcessedBlockHash = block.blockInfo.blockHash;
        });
    }
    loadIndexState() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                blockNumber: 0,
                blockHash: "",
                handlerVersionName: "v1",
                isReplay: false
            };
        });
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.myActionHandler = myActionHandler;
