import request from "../../../apiconf";
import {VERSION} from "@/pages/utils/apiconf/config";

const prefix = "fufu-user/" + VERSION + "/tags/"

export const getUserTags = (uid) => {
    return request({
        url: prefix + `${uid}`,
        method: "GET"
    })
}

export const editUserTags = (uid,data) => {
    /**
     * [标签列表]
     */
    return request({
        url: prefix + `${uid}`,
        method: "PUT",
        data
    })
}
