import request from "../../../apiconf";
import {VERSION} from "@/pages/utils/apiconf/config";

const prefix = "fufu-socializing/" + VERSION + "/groupChat/"

const sessionPrefix = prefix+"session/"

export const createSession = (data) => {
    /**
     * {
     *   "name": "",    //群聊名称
     *   "creatorId": "", //创建者id
     *   "avatarUrl": "" //群聊头像
     * }
     */
    return request({
        url: sessionPrefix,
        method: "POST",
        data
    })
}
export const getSession = (sid) => {
    return request({
        url: sessionPrefix + sid,
        method: "GET",
    })
}
export const updateSession = (sid,data) => {
    /**
     * {
     *   "name": "",
     *   "creatorId": "",
     *   "avatarUrl": ""
     * }
     */
    return request({
        url: sessionPrefix + sid,
        method: "PUT",
        data
    })
}

export const deleteSession = (sid) => {
    return request({
        url: sessionPrefix + sid,
        method: "DELETE",
    })
}

const memberPrefix = prefix+"member/"

export const addMember = (sid,data) => {
    /**
     * {
     *   "groupId": 0, sid
     *   "userId": "", 用户
     *   "joinTime": "", 加入时间
     *   "role": 0 权限
     * }
     */
    return request({
        url: memberPrefix + sid,
        method: "POST",
        data
    })
}

export const getUserAllGroupChat = (uid) => {
    return  request({
        url: sessionPrefix +"all/"+ uid,
        method: "GET",
    })
}
const messagePrefix = prefix+"message/"
export const getMessageSessionAll = (data) => {
    return request({
        url: "fufu-socializing/v1/groupChat/messages/session",
        method: "POST",
        data: data
    })
}
