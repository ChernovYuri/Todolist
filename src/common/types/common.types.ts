export type FieldErrorType = {
    error: string
    field: string
}

export type ResponseType<T = {}> = { // {} = дефолтное значение типа T для data
    // PS вместо T могут быть любые символы (буквы и слова)
    data: T
    fieldsErrors: FieldErrorType[]
    messages: string[]
    resultCode: number
}