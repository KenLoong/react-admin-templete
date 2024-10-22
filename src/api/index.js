import axios from './axios'

export const getMenu = (param) => {
    return axios.request({
        url: '/permission/getMenu',
        method: 'post',
        data: param
    })
}

export const getData = () => {
    return axios.request({
        url: '/home/getData',
        method: 'get'
    })
}

export const getUser = (params) => {
    return axios.request({
        url: '/user/getUser',
        method: 'get',
        params
    })
}

export const addUser = (data) => {
    return axios.request({
        url: '/user/add',
        method: 'post',
        data
    })
}

export const editUser = (data) => {
    return axios.request({
        url: '/user/edit',
        method: 'post',
        data
    })
}

export const deleteUser = (data) => {
    return axios.request({
        url: '/user/del',
        method: 'post',
        data
    })
}