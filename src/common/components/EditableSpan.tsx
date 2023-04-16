import React, {ChangeEvent, memo, useState} from 'react';

type EditableSpanPropsType = {
    oldTitle: string
    callBack: (newTitle: string, taskId?: string) => void
    taskId?: string
    isEntityStatusLoading?: boolean
}

export const EditableSpan = memo((props: EditableSpanPropsType) => {
    const [edit, setEdit] = useState<boolean>(false)
    const [newTitle, setNewTitle] = useState<string>(props.oldTitle)
    const focusHandler = () => {
        if (props.isEntityStatusLoading) {
        setEdit(!edit)
        setNewTitle(props.oldTitle)
        if (edit) {
            updateOnBlurHandler()
        }
    }
}
const updateOnBlurHandler = () => {
    props.callBack(newTitle, props.taskId)
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
        : <span onDoubleClick={focusHandler}>{props.oldTitle}</span>
);
})

