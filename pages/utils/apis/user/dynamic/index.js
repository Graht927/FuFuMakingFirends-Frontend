import request from "../../../apiconf";
import {VERSION} from "@/pages/utils/apiconf/config";

const prefix = "fufu-user/" + VERSION + "/dynamics/"


export const getDynamicsByUserId = (data) => {
    /**
     * {
     *   "pageSize": 0,
     *   "pageNum": 0,
     *   "uid": ""
     * }
     */
    return request({
        url: prefix + "user/byUid",
        method: "POST",
        data
    })
}
export const getDynamicsByUid = (id) => {
    return request({
        url: prefix + `${id}`,
        method: "GET"
    })
}
export const createDynamic = (data) => {
    /**
     * {
     *   "userId": "",
     *   "content": "",
     *   "images": [],
     *   "coverImages": ""
     * }
     */
    return request({
        url: "fufu-user/" + VERSION + "/dynamics",
        method: "POST",
        data
    })
}

export const updateDynamic = (id,data) => {
    /**
     * {
     *   "userId": "",
     *   "content": "",
     *   "images": [],
     *   "coverImages": "",
     *   "likeCount": 0,
     *   "commentCount": 0,
     *   "forwardCount": 0
     * }
     */
    return request({
        url: prefix+`${id}`,
        method: "PUT",
        data
    })
}

export const deleteDynamic = (id) => {
    return request({
        url: prefix+`${id}`,
        method: "DELETE"
    })
}


