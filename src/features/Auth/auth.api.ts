import {ValuesType} from "features/Auth/Auth";
import {AxiosResponse} from "axios";
import {ResponseType} from "common/types/common.types";
import {instance} from "common/api/common.api";

export const authApi = {
    // for auth
    login(data: ValuesType) {
        return instance.post<{ data: string }, AxiosResponse<ResponseType<{ userId: number }>>, ValuesType>(`/auth/login`, data)
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