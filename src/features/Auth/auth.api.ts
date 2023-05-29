import {AxiosResponse} from "axios";
import {ResponseType} from "common/types/common.types";
import {instance} from "common/api/common.api";

export const authApi = {
    // for auth
    login(data: LoginParamsType) {
        return instance.post<{ data: string }, AxiosResponse<ResponseType<{ userId: number }>>, LoginParamsType>(`/auth/login`, data)
    },
    getCaptcha() {
        return instance.get<{ url: string }>(`/security/get-captcha-url`)
    },
    logout() {
        return instance.delete<ResponseType>(`/auth/login`)
    },
    me() {
        return instance.get<ResponseType<UserDataType>>(`/auth/me`)
    }
}

type UserDataType = {
    id: number
    email: string
    login: string
}
export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}