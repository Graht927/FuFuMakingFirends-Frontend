import request from "../../apiconf";
import {VERSION} from "@/pages/utils/apiconf/config";

const prefix = "fufu-user/" + VERSION + "/"

// 登录
export const login = (data,location) => {
    /*
    * {
  "phone": "xxxxxxxxx",
  "phoneCode": "xxxxxx",
  "userPassword": "xxxx",
}*/
    return request({
        url: prefix + "login auth",
        method: "POST",
        header: {
            'location': location
        },
        data
    })
}
// 注册
export const registry = (data,location) => {
    /**
     * {
     *   "nickname": "",
     *   "phone": "",
     *   "phoneCode": "",
     *   "userPassword": "",
     *   "checkPassword": ""
     * }
     */
    return request({
        url: prefix + "register auth",
        method: "POST",
        header: {
            'location': location
        },
        data
    })
}
// 验证手机验证码
export const checkPhoneCode = (data,type) => {
    /**
     * {
     *     phone: "",
     *     phoneCode: ""
     * }
     */
    return request({
        url: prefix + `checkPhoneCode/${type}`,
        method: "POST",
        data
    })
}
// 退出登录
export const logout = () => {
    return request({
        url: prefix + "logout",
        method: "GET"
    })
}
// 根据uid获取用户信息
export const getUserInfoByUId = (uid) => {
    return request({
        url: prefix + `info/${uid}`,
        method: "GET"
    })
}
// 修改用户信息
export const editUserInfo = (data) => {
    /**
     * {
     *   "id": "",
     *   "nickname": "",
     *   "avatarUrl": "",
     *   "gender": 0,
     *   "email": "",
     *   "tags": "",
     *   "profile": ""
     * }
     */
    return request({
        url: prefix + "info",
        method: "PUT",
        data
    })
}
// 注销用户
export const cancelUser = (uid) => {
    return request({
        url: prefix + `info/${uid}`,
        method: "DELETE"
    })
}
// 取消注销用户
export const cancelCancelUser = (uid) => {
    return request({
        url: prefix + `info/cancel-unregister/${uid}`,
        method: "GET"
    })
}

