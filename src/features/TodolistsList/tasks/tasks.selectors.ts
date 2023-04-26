import {AppRootStateType} from "app/store";

export const selectTasks = (todoId: string) => (state: AppRootStateType) => state.tasks[todoId]