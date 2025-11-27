import { getSocket } from "./socket";

// export const JOIN_ROOM = "join-room";
// export const SEND_MESSAGE = "send_message";
// export const RECEIVE_MESSAGE = "receive_message";
// export const USER_TYPING_START = "user_typing_start";
// export const START_TYPING = "start_typing";
// export const USER_TYPING_STOP = "user_typing_stop";
// export const STOP_TYPING = "stop_typing";
// export const USER_SEEN = "user_seen";
// export const MESSAGE_SEEN = "message_seen";
// export const LEAVE_CHAT = "leave_chat";


const JOIN_ROOM = "join-room"
const SEND_MESSAGE = "send_message"
const RECEIVE_MESSAGE = "receive_message"
const LEAVE_CHAT = "leave_chat"
const USER_SEEN = "user_seen"
const MESSAGE_SEEN = "message_seen"
const USER_TYPING_START = "user_typing_start"
const START_TYPING = "start_typing"
const USER_TYPING_STOP = "user_typing_stop"
const STOP_TYPING = "stop_typing"
const GROUP_CHAT_USER_TYPING_SEND = "groupChatUserTyping"
const GROUP_CHAT_USER_TYPING_RECEIVE = "groupChatUserTyping"
const GROUP_CHAT_USER_TYPING_STOP_SEND = "groupChatUserTypingStop"
const GROUP_CHAT_USER_TYPING_STOP_RECEIVE = "groupChatUserTypingStop"
const USER_SEEN_GROUP = "user_seen_group"
const MESSAGE_SEEN_GROUP = "message_seen_group"
const GROUP_SEND_MESSAGE = "group_send_message"
const SEND_CALL = "send_call"
const RECEIVE_CALLRINGING = "call_ringing"
const LEAVE_CALL = "leave_call"

// JOIN_ROOM: emit
// put("chatId", chatId)
// put("userId", userId)

// SEND_MESSAGE: emit
// put("orgnid", orgnId)
// put("chatId", chatId)
// put("msg", chatMessage?.trim() ?: "")
// put("enc", 1)
// put("fileName", fileName)
// put("orgFileName", orgFileName)
// put("msgSize", msgSize)
// put("msgType", msgType)
// put("fromUser", userId)
// put("toUser", toUserArray)
// put("chatType", Constants.CHAT_USER_ADD_TYPE_SINGLE)
// put("timestamp", System.currentTimeMillis())
// put("seen", 0)
// put("isDisappearing", 0)


// RECEIVE_MESSAGE: Listen on

//emit events
export const joinRoom = (chatId, userId) => {
    getSocket().emit(JOIN_ROOM, { chatId, userId });
};

export const sendMessage = (data) => {
    getSocket().emit(SEND_MESSAGE, data);
};

export const startTyping = (chatId, userId) => {
    getSocket().emit(USER_TYPING_START, { chatId, userId });
    
};

export const stopTyping = (chatId, userId) => {
    getSocket().emit(USER_TYPING_STOP, { chatId, userId });
};

export const seenMessage = (chatId, userId, msgId,chatType) => {
    getSocket().emit(USER_SEEN, { chatId, userId ,msgId, chatType});
};

//listen events
export const onReceiveMessage = (callback) => {
    getSocket().on(RECEIVE_MESSAGE, callback);
};

export const onTypingStart = (callback) => {
    getSocket().on(START_TYPING, callback);
};

export const onTypingStop = (callback) => {
    getSocket().on(STOP_TYPING, callback);
};

export const onMessageSeen = (callback) => {
    getSocket().on(MESSAGE_SEEN, callback);
};

//cleanup
export const offReceiveMessage = () => {
    getSocket().off(RECEIVE_MESSAGE);
};
export const offTypingStart = () => {
    getSocket().off(START_TYPING);
};
export const offTypingStop = () => {
    getSocket().off(STOP_TYPING);
};
export const offMessageSeen = () => {
    getSocket().off(MESSAGE_SEEN);
};
export const offseenMessage = () => {
    getSocket().off(USER_SEEN);
};