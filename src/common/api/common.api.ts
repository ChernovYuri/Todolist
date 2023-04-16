import axios, {AxiosResponse} from "axios";
import {RequestStatusType} from "app/appReducer";
import {ValuesType} from "features/Auth/Auth";
import {UpdateDomainTaskModelType} from "features/TodolistsList/tasksReducer";
import {TaskPriorities, TaskStatuses} from "common/enums/common.enums";

// const settings = {
//     withCredentials: true
// }
export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true
})