import request from "../../apiconf";
import {VERSION} from "@/pages/utils/apiconf/config";
const prefix = "fufu-search/" + VERSION + "/search"
export const getMate = (data) => {

    return request({
        url: prefix + '/mate',
        method: 'POST',
        data: data
    })
}
