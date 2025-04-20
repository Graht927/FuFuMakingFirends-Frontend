import request from "../../../apiconf";
import {VERSION} from "@/pages/utils/apiconf/config";

const prefix = "fufu-socializing/" + VERSION + "/focus/"


export const getFocus = (data) => {
    /**
     * {
     *   "pageSize": 0,
     *   "pageNum": 0,
     *   "userId": "",  /当前登录id
     *   "focusUid": "" /查看的是谁
     * }
     */
    return request({
        url: prefix + "getFocus",
        method: "POST",
        data
    })
}
export const getFans = (data) => {
    /**
     * {
     *   "pageSize": 0,
     *   "pageNum": 0,
     *   "userId": "",
     *   "focusId": ""
     * }
     */
    return request({
        url: prefix + "getFans",
        method: "POST",
        data
    })
}
export const addFocus = (data) => {
    /**
     * {
     *   "userId": "",
     *   "focusUserId": ""
     * }
     */
    return request({
        url: "fufu-socializing/" + VERSION + "/focus",
        method: "POST",
        data
    })
}
export const deleteFocus = (data) => {
    /**
     * {
     *   "userId": "",
     *   "focusUserId": ""
     * }
     */
    return request({
        url: prefix,
        method: "Delete",
        data
    })
}
export const isFocusAndFans = (data) => {
    /**
     * {
     *   "userId": "",
     *   "focusUserId": ""
     * }
     */
    return request({
        url: prefix + "isFocusAndFans",
        method: "POST",
        data
    })
}
export const isFocus = (data) => {
    /**
     * {
     *   "userId": "",
     *   "focusUserId": ""
     * }
     */
    return request({
        url: prefix + "isFocus",
        method: "POST",
        data
    })
}
export const getFansCount = () => {
    return request({
        url: prefix + "fansNum",
        method: "GET",
    })
}
export const getFocusCount = () => {
    return request({
        url: prefix + "focusNum",
        method: "GET",
    })
}
