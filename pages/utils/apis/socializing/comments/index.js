import request from "../../../apiconf";
import {VERSION} from "@/pages/utils/apiconf/config";

const prefix = "fufu-socializing/" + VERSION + "/comments/"

export const getParentCommentsByCid = (cid,data) => {
    /**
     * {
     *   "pageSize": 0,
     *   "pageNum": 0
     * }
     */
    return request({
        url: prefix + `${cid}`,
        method: "PostMapping",
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
        method: "PostMapping",
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
        url: prefix,
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
