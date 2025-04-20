import request from "../../apiconf";
import {imagePrefix} from "@/pages/utils/apiconf/image-api";
export const putImage = (data) => {
    return uni.request({
        url: imagePrefix + 'upload',
        method: "POST",
        data: data,
        header: {
            "Content-Type": "multipart/form-data"
        }
    })
}
