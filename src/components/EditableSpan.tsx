import React, {ChangeEvent, memo, useState} from 'react';

type EditableSpanPropsType = {
    oldTitle: string
    callBack:(newTitle: string, taskId?: string) => void
    taskId?: string
}

export const EditableSpan = memo((props: EditableSpanPropsType) => {
    console.log('EditableSpan rendering')
    const [edit, setEdit] = useState<boolean>(false)
    const [newTitle, setNewTitle] = useState<string>(props.oldTitle)
    const focusHandler = () => {
        setEdit(!edit)
        updateOnBlurHandler()
    }
    const updateOnBlurHandler = () => props.callBack(newTitle, props.taskId)
    const onChangeLocalTitleHandler = (e: ChangeEvent<HTMLInputElement>) => setNewTitle(e.currentTarget.value)

    return (
        edit
            ? <input onChange={onChangeLocalTitleHandler} autoFocus value={newTitle} onBlur={focusHandler}/>
            : <span onDoubleClick={focusHandler}>{newTitle}</span>
    );
})

