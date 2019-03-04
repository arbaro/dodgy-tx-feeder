import { Handler, ActionTraceInput } from "./interfaces";
export const handlerToActionTrace = (handler: Handler): ActionTraceInput => {
  const [account, action_name] = handler.actionType.split("::");
  return {
    account,
    action_name
  };
};
