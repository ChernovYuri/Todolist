import React, {ChangeEvent, FC, memo, useState} from 'react';

type Props = {
    oldTitle: string
    callBack: (newTitle: string, taskId?: string) => void
    taskId?: string
    isEntityStatusLoading?: boolean
}

export const EditableSpan: FC<Props> = memo(({oldTitle, callBack, taskId, isEntityStatusLoading}) => {
    const [edit, setEdit] = useState<boolean>(false)
    const [newTitle, setNewTitle] = useState<string>(oldTitle)
    const focusHandler = () => {
        if (isEntityStatusLoading) {
        setEdit(!edit)
        setNewTitle(oldTitle)
        if (edit) {
            updateOnBlurHandler()
        }
    }
}
const updateOnBlurHandler = () => {
    callBack(newTitle, taskId)
}
const onChangeLocalTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    /* if(e.currentTarget.value.length > 50) {
         return alert('max')
     }*/
    setNewTitle(e.currentTarget.value)
}

return (
    edit
        ? <input onChange={onChangeLocalTitleHandler} autoFocus value={newTitle} onBlur={focusHandler}/>
        : <span onDoubleClick={focusHandler}>{oldTitle}</span>
);
})

