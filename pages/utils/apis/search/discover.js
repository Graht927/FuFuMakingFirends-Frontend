import request from "../../apiconf";
import {VERSION} from "@/pages/utils/apiconf/config";
const prefix = "fufu-search/" + VERSION + "/search"
export const getDiscover = (data) => {

    return request({
        url: prefix + '/discover',
        method: 'POST',
        data: data
    })
}
