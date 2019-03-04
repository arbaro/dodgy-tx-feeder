import {
  AbstractActionHandler,
  HandlerInfo,
  HandlerVersion,
  Block,
  IndexState
} from "demux";

let state = {
  posts: []
};

export class myActionHandler extends AbstractActionHandler {
  constructor(handlerVersions: HandlerVersion[]) {
    super(handlerVersions);
  }

  async initialize(): Promise<void> {}

  async handleWithState(handle) {
    await handle(state);
  }

  async rollbackTo(blockNumber: number): Promise<void> {}

  async updateIndexState(
    state: any,
    block: Block,
    isReplay: boolean,
    handlerVersionName: string,
    context?: any
  ): Promise<void> {
    this.lastProcessedBlockNumber = block.blockInfo.blockNumber;
    this.lastProcessedBlockHash = block.blockInfo.blockHash;
  }

  async loadIndexState(): Promise<IndexState> {
    return {
      blockNumber: 0,
      blockHash: "",
      handlerVersionName: "v1",
      isReplay: false
    };
  }

  async setup(): Promise<void> {}
}
