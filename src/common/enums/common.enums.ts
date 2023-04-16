export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

// export const TaskStatuses = {
//     New: 0,
//     InProgress: 1,
//     Completed: 2,
//     Draft: 3
// } as const

export const ResultCode = {
    OK: 0,
    Error: 1,
    Captcha: 10
} as const

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

// export const TaskPriorities = {
//     Low: 0,
//     Middle: 1,
//     Hi: 2,
//     Urgently: 3,
//     Later: 4
// }
