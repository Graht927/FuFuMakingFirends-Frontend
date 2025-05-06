import request from "../../../apiconf";
import {VERSION} from "@/pages/utils/apiconf/config";

const prefix = "fufu-socializing/" + VERSION + "/privateChat/"

const sessionPrefix = prefix+"session/"
export const getUserAllChat = (uid) => {
    return request({
        url: sessionPrefix +"all/"+ uid,
        method: "GET",
    })
}
export const getSessionInfo = (sid) => {
    return request({
        url: sessionPrefix + sid,
        method: "GET",
    })
}
export const getMessageList = (sid,data) => {
    return request({
        url: prefix  + "messages/session/" + sid,
        method: "POST",
        data:data
    })
}
export const createSessionP = (data) => {
    return request({
        url: prefix + "session",
        method: "POST",
        data:data
    })
}
