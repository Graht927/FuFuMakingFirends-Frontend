import request from "../../../apiconf";
import {VERSION} from "@/pages/utils/apiconf/config";

const prefix = "fufu-socializing/" + VERSION + "/notice/"

export const  getNoticeCountPage = (uid,pageSize) => {
    return request({
        url: prefix + uid +"/"+pageSize,
        method: "GET",
    })
}
export const getNotice = (uid,data) => {
    return request({
        url: prefix + uid,
        method: "POST",
        data: data
    })
}
