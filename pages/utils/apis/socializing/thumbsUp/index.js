import request from "../../../apiconf";
import {VERSION} from "@/pages/utils/apiconf/config";

const prefix = "fufu-socializing/" + VERSION + "/thumbsUp/"


export const getThumbsUpByCid = (dynamicId,data) => {
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
export const addThumbsUp = (data) => {
    /**
     * {
     *   "userId": "",
     *   "dynamicId": 0
     * }
     */
    return request({
        url: prefix.substring(0,prefix.length-1),
        method: "POST",
        data
    })
}
export const deleteThumbsUp = (uid,dynamicId) => {
    return request({
        url: prefix +`${uid}/${dynamicId}`,
        method: "DELETE"
    })
}
export const isThumbsUp = (uid,dynamicId) => {
    return request({
        url: prefix +`${dynamicId}/${uid}`,
        method: "GET"
    })
}
export const getThumbsUpCount = (dynamicId,uid) => {
    return request({
        url: prefix +`s/${dynamicId}`,
        method: "GET"
    })
}
