import request from "../../apiconf";
import {VERSION} from "@/pages/utils/apiconf/config";
const prefix = "fufu-organize-bureau/" + VERSION + "/team"

export const getTeamList = (data) => {
    return request({
        url: prefix + '/list',
        method: 'POST',
        data: data
    })
}
export const getActivityById = (teamId) => {
    return request({
        url: prefix + '/info?teamId='+teamId,
        method: 'GET',
    })
}
export const sendJoinActivity = (data) => {
    /*
    * data:{
    * teamId: xx,
    * userId: xx
    * }
     */
    return request({
        url: prefix + '/sendJoin',
        method: 'POST',
        data: data
    })
}
export const getCreateActivity = (data) => {
    return request({
        url: prefix + '/getCreateTeam',
        method: 'POST',
        data: data
    })
}
export const joinActivityList = (data) => {
    return request({
        url: prefix + '/getAddTeam',
        method: 'POST',
        data: data
    })
}
export const createActivity = (data) => {
    return request({
        url: prefix + '/add',
        method: 'POST',
        data: data
    })
}
export const deleteActivity = (data) => {
    return request({
        url: prefix + '/delete',
        method: 'POST',
        data: data
    })
}
export const quitActivity = (data) => {
    return request({
        url: prefix + '/quit',
        method: 'POST',
        data: data
    })
}
