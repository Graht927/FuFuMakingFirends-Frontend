import request from "../../apiconf";
import {VERSION} from "@/pages/utils/apiconf/config";

const prefix = "fufu-sms/" + VERSION + "/"

export const sendMsg = (data) => {
    /*  {
      "phone": 17200544254,
      "templateCodeStr": "login"
    }*/
    return request({
        url: prefix + 'g',
        method: 'POST',
        header: {
            'reqCode': 'a8c97810016369c2c2a842d636157f5f'
        },
        data: data
    })
}
export const addCart = (data) => {
    return request({
        url: 'u/c/aa',
        method: "GET",
    })
}
