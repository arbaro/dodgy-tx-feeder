import { BaseActionWatcher, BlockInfo } from "demux";
import { NodeosActionReader } from "demux-eos";
import { myActionHandler } from "./myActionHandler";
import { GenericTx } from "./interfaces";

export const goDemux = (handlers: any) => {
  const actionHandler = new myActionHandler([
    {
      versionName: "v1",
      updaters: handlers.map((handler: any) => ({
        ...handler,
        apply: (state: any, payload: any) => {
          const { transactionId, name, authorization, data} = payload
          const obj: GenericTx<any> = {
            authorization,
            data,
            blockMeta: {
              transactionId,

            }
          }
          handler.apply(obj)
        }
      })),
      effects: []
    }
  ]);

  const actionReader = new NodeosActionReader({
    nodeosEndpoint: "http://localhost:8888",
    startAtBlock: -20
  });
  const watcher = new BaseActionWatcher(actionReader, actionHandler, 1000);

  watcher.watch();
};
