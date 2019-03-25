"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerToActionTrace = (handler) => {
    const [account, action_name] = handler.actionType.split("::");
    return {
        account,
        action_name
    };
};
