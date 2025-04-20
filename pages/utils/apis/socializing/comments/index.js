import request from "../../../apiconf";
import {VERSION} from "@/pages/utils/apiconf/config";

const prefix = "fufu-socializing/" + VERSION + "/comments/"

export const getParentCommentsByCid = (dynamicId,data) => {
    /**
     * {
     *   "pageSize": 0,
     *   "pageNum": 0
     * }
     */
    return request({
        url: prefix + `${dynamicId}`,
        method: "POST",
        data
    })
}
export const getCommentsByCid = (cid,data) => {
    /**
     * {
     *   "pageSize": 0,
     *   "pageNum": 0,
     *   "dynamicId": 0, 动态Id
     *   "pid": 0  父评论 id
     * }
     */
    return request({
        url: prefix + `c/${cid}`,
        method: "POST",
        data
    })
}

export const addComments = (data) => {
    /**
     * {
     *   "userId": "",
     *   "dynamicId": 0,
     *   "parentCommentId": 0, 0为父评论
     *   "content": ""
     * }
     */
    return request({
        url: prefix.substring(0,prefix.length-1),
        method: "POST",
        data
    })
}
export const deleteComments = (id) => {
    return request({
        url: prefix + id,
        method: "DELETE",
    })
}
